# Bug Fix: Duplicate Client Import Issue

## Problem Description

When importing a saved client (e.g., "Bouvy Tina"), an additional unexpected client ("Roelandt Denise") was also being imported. The imported entries list showed:

1. Roelandt Denise (first)
2. Bouvy Tina (second)

Expected behavior: Only Bouvy Tina entries should be imported.

## Root Cause Analysis

The bug was in the **save logic** (`domsave.component.ts`), not the load logic.

### What Was Happening

1. **Save Operation**: When you clicked "Save" and entered a client name (e.g., "Bouvy Tina"), the component saved **ALL current entries in memory** under that client name, regardless of each entry's actual `clientName` field.

2. **Example Scenario**:
   - Current entries in memory: Entry with `clientName: "Roelandt Denise"` and Entry with `clientName: "Bouvy Tina"`
   - User clicks "Save As Client" → enters "Bouvy Tina"
   - Result: Both entries were saved under key `cddClient_Bouvy Tina` in localStorage

3. **Load Operation**: When you later "Load" and selected "Bouvy Tina", it retrieved everything stored under `cddClient_Bouvy Tina` - both clients' entries.

### Code Evidence

**Before (buggy behavior)** in `domsave.component.ts`:

```typescript
onSubmit() {
  if (this.domSaveForm.valid) {
    const itemName = this.domSaveForm.value.groupType + this.domSaveForm.value.name;
    localStorage.setItem(itemName, JSON.stringify(this.domJson)); // <-- Saves ALL entries
    // ...
  }
}
```

The `this.domJson` array contained ALL entries regardless of client name filtering.

## Solution Implemented

### 1. Fixed Save Logic (`domsave.component.ts`)

Added client name filtering when saving entries:

```typescript
onSubmit() {
  if (this.domSaveForm.valid) {
    this.locationReload = true;
    const itemName =
      this.domSaveForm.value.groupType + this.domSaveForm.value.name;
    const saveName = this.domSaveForm.value.name;

    let entriesToSave = this.domJson;

    // Filter entries by client name when saving as a client
    if (this.domSaveForm.value.groupType === 'cddClient_') {
      entriesToSave = this.domJson.filter(
        (entry) => entry.clientName === saveName
      );
    }

    localStorage.setItem(itemName, JSON.stringify(entriesToSave));
    // ... rest of logic
  }
}
```

**Key Changes**:

- Extract the save name: `const saveName = this.domSaveForm.value.name`
- Filter entries matching that client name: `filter(entry => entry.clientName === saveName)`
- Only save filtered entries: `JSON.stringify(entriesToSave)`
- Handle both "Client" saves (filtered) and "List" saves (all entries)

### 2. Improved Load Logic (`domload.component.ts`)

Refactored the load logic for better clarity and safety:

**Before**:

```typescript
const tmpJson: DomEntry[] = JSON.parse(itemVal2 as string);

if (areThereEntries === null) {
  this.domJson = tmpJson;
} else {
  this.iCount = 0;
  while (this.iCount < tmpJson.length) {
    const tmpEntry: DomEntry = tmpJson[this.iCount];
    this.domJson.unshift(tmpEntry);
    this.iCount++;
  }
}
```

**After**:

```typescript
const itemVal2 = localStorage.getItem(itemName);
if (itemVal2) {
  const tmpJson: DomEntry[] = JSON.parse(itemVal2);

  // Add loaded entries to existing entries
  if (tmpJson && tmpJson.length > 0) {
    for (const entry of tmpJson) {
      this.domJson.unshift(entry);
    }
  }
}
```

**Improvements**:

- Initialize `domJson` as empty array instead of leaving it undefined
- Add defensive null checks before parsing
- Use modern `for...of` loop instead of while loop with index
- More explicit conditions and error handling
- Removed unused `iCount` property

## Testing Scenario

To verify the fix works:

1. **Create entries** with different client names:
   - Entry 1: `clientName: "Roelandt Denise"`, `amount: 50`
   - Entry 2: `clientName: "Bouvy Tina"`, `amount: 100`

2. **Save Bouvy Tina**:
   - Click "Save"
   - Group Type: "Clients"
   - Name: "Bouvy Tina"
   - Clear Entries: unchecked
   - Click "Save"

3. **Verify Saved Data**: In browser developer tools, check:

   ```javascript
   JSON.parse(localStorage.getItem('cddClient_Bouvy Tina'))
   // Should contain only entries with clientName === "Bouvy Tina"
   // Should have 1 entry, not 2
   ```

4. **Clear and Load**:
   - Clear current entries
   - Click "Load"
   - Group Type: "Clients"
   - Name: "Bouvy Tina"
   - Replace Entries: checked
   - Click "Load"

5. **Expected Result**: Only Bouvy Tina's entry should be in the list (no Roelandt Denise)

## Impact Assessment

✅ **Fixes**: Duplicate client import bug  
✅ **Maintains**: Backward compatibility - existing "List" saves still work  
✅ **Improves**: Code clarity and robustness  
✅ **Removes**: Unused `iCount` variable  
✅ **Adds**: Better error handling and null checks  

## Files Changed

1. **src/app/components/dom/domsave/domsave.component.ts**
   - Added client name filtering in `onSubmit()`
   - Ensures saved clients contain only matching entries

2. **src/app/components/dom/domload/domload.component.ts**
   - Improved load logic with better null handling
   - Refactored while loop to for-of loop
   - Removed unused `iCount` property
   - Better initialization of `domJson` array

## Build Status

✅ Build successful - no errors or warnings  
✅ Zero breaking changes  
✅ 100% backward compatible
