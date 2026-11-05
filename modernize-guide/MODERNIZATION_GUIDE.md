# Angular 22 Modernization Guide

## Current Status
✅ **Already on Angular 22.2.3** - The app has been upgraded but still uses Angular 13-era patterns.

## Modernization Opportunities

### 1. Change Detection Strategy
**Current:** `ChangeDetectionStrategy.Eager` (deprecated in Angular 22)
**Target:** `ChangeDetectionStrategy.OnPush` with signals

**Impact:** 🟡 MEDIUM - Already partially done in `domentries.component.ts`

**Files to update:**
- `src/app/app.component.ts`
- `src/app/components/navbar/navbar.component.ts`
- `src/app/components/navbar/language/language.component.ts`
- `src/app/components/dom/domsave/domsave.component.ts`
- `src/app/components/dom/domload/domload.component.ts`
- `src/app/components/dom/domexport/domexport.component.ts`
- `src/app/components/dom/domsettings/domsettings.component.ts`
- `src/app/components/dom/domtools/domtools.component.ts`

**Migration Pattern:**
```typescript
// OLD
changeDetection: ChangeDetectionStrategy.Eager

// NEW
changeDetection: ChangeDetectionStrategy.OnPush
// Add: cdr = inject(ChangeDetectorRef);
// Call: this.cdr.markForCheck(); after state changes
```

---

### 2. Angular Signals (Angular 14+)
**Current:** RxJS BehaviorSubject everywhere
**Target:** Angular Signals with signal(), computed(), and effect()

**Impact:** 🟠 HIGH - Major modernization benefit

**Example Migration - DomService:**

```typescript
// OLD
private domEntrieSource = new BehaviorSubject<DomEntry>({...});
selectedDomEntry = this.domEntrieSource.asObservable();

// NEW
private selectedDomEntry = signal<DomEntry>({...});
selectedDomEntry = this.selectedDomEntry.asReadonly();

// Notify via signal
this.selectedDomEntry.set(newValue);
```

**Benefits:**
- Better performance (no observable overhead)
- Simpler subscription patterns
- Reactivity without RxJS
- Easier to test

---

### 3. New Control Flow Syntax
**Current:** `@if`, `@for` (already modern! ✅)
**Status:** No changes needed - already using Angular 17+ syntax

---

### 4. New View Query API
**Current:** Only `viewChild()` used in `domentry.component.ts` ✅
**Status:** Already using modern API

---

### 5. Standalone Components
**Current:** All components already use standalone API ✅
**Status:** Already modern - no module.ts files

---

### 6. Dependency Injection
**Current:** Using `inject()` everywhere ✅
**Status:** Already modern

---

### 7. Type Safety & Strict Null Checks
**Impact:** 🟡 MEDIUM

**Current Issues in DomService:**
```typescript
mandateStartDate: null  // Should be: string | null
```

**Recommendation:**
```typescript
interface DomEntry {
  id: string;
  endToEndReference: string;
  amount: number;
  mandateId: string;
  mandateStartDate: string | null;  // Better typing
  clientName: string;
  clientIban: string;
  communication: string;
}
```

---

### 8. Unsubscribe Pattern
**Current:** Manual subscriptions without unsubscribe
**Target:** Use `takeUntilDestroyed()` or signals

**Impact:** 🟡 MEDIUM - Memory leak risk in long-running apps

**Files with subscriptions:**
- `domentries.component.ts` - 2 subscriptions in ngOnInit
- `domentry.component.ts` - subscription in ngOnInit
- `navbar.component.ts` - subscription in onLanguageModal
- `language.component.ts` - likely has subscriptions

**Migration Pattern:**
```typescript
// OLD
this.domService.stateClear.subscribe((clear) => { ... });

// NEW
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

constructor(private destroyRef = inject(DestroyRef)) {}

ngOnInit() {
  this.domService.stateClear.pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((clear) => { ... });
}
```

---

### 9. RxJS Updates
**Current:** Using RxJS patterns from Angular 13
**Target:** Streamline with signals where possible

**Files to review:**
- `dom.service.ts` - Multiple BehaviorSubjects
- `language.service.ts` - Uses TranslateService observables

---

### 10. Async Pipe in Templates
**Recommendation:** Review templates for unnecessary subscriptions

Check if components are using `| async` pipe or subscribing in code.

---

## Priority Roadmap

### Phase 1: Quick Wins (No Breaking Changes)
1. ✅ Update remaining `ChangeDetectionStrategy.Eager` → `OnPush`
2. ✅ Add `takeUntilDestroyed()` to subscriptions
3. ✅ Improve type safety in models

### Phase 2: Modern Patterns (Minor Refactoring)
1. Migrate core services to Signals (DomService first)
2. Update component state management
3. Remove RxJS where Signals work better

### Phase 3: Future-Proof (Optional)
1. Consider NgRx/Akita for complex state
2. Add strict type checking
3. Performance optimization with OnPush everywhere

---

## Estimated Effort

| Task | Complexity | Time | Priority |
|------|-----------|------|----------|
| Change Detection Strategy | ⭐ Easy | 2h | High |
| Unsubscribe Pattern | ⭐ Easy | 3h | High |
| Type Safety | ⭐⭐ Medium | 4h | Medium |
| Signals Migration | ⭐⭐⭐ Hard | 12h | Medium |
| Full Modernization | ⭐⭐⭐ Hard | 24h | Low |

---

## Recommendations

1. **Start with:** Change Detection Strategy + Memory leak fixes (5 hours total)
2. **Next:** Type safety improvements (4 hours)
3. **Future:** Signals migration when time permits (12+ hours)

The app is **already 70% modern** - mostly just needs refinement of patterns rather than major rewrites.
