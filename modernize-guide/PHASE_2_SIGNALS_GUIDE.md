# Phase 2: Angular Signals Migration Guide

**Status:** Ready for implementation  
**Estimated Effort:** 12-16 hours  
**Complexity:** Medium-High  
**Priority:** Medium (Nice to have, not critical)

---

## Why Migrate to Signals?

### Current State (RxJS BehaviorSubjects)
```typescript
private domEntrieSource = new BehaviorSubject<DomEntry>({...});
selectedDomEntry = this.domEntrieSource.asObservable();

// Usage
setFormDomEntry(entry: DomEntry) {
  this.domEntrieSource.next(entry);
}
```

**Downsides:**
- Requires RxJS knowledge
- Observable overhead
- More complex syntax
- Extra imports

### Modern State (Angular Signals)
```typescript
private selectedDomEntry = signal<DomEntry>({...});
selectedDomEntry = this.selectedDomEntry.asReadonly();

// Usage
setFormDomEntry(entry: DomEntry) {
  this.selectedDomEntry.set(entry);
}
```

**Benefits:**
- ✅ Simpler syntax
- ✅ Better performance
- ✅ No RxJS overhead
- ✅ Automatic reactivity
- ✅ Easier to test

---

## Migration Plan

### Step 1: Update `DomService` (2-3 hours)

**Current Code:**
```typescript
@Injectable()
export class DomService {
  domEntries: DomEntry[];

  private domEntrieSource = new BehaviorSubject<DomEntry>({...});
  selectedDomEntry = this.domEntrieSource.asObservable();

  private stateSource = new BehaviorSubject<boolean>(true);
  stateClear = this.stateSource.asObservable();

  private entriesUpdatedSource = new BehaviorSubject<void>(undefined);
  entriesUpdated = this.entriesUpdatedSource.asObservable();
  
  setFormDomEntry(domEntry: DomEntry) {
    this.domEntrieSource.next(domEntry);
  }
}
```

**Target Code:**
```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable()
export class DomService {
  // Signals
  private selectedDomEntrySignal = signal<DomEntry>({
    id: '',
    endToEndReference: '',
    amount: 0,
    mandateId: '',
    mandateStartDate: null,
    clientName: '',
    clientIban: '',
    communication: '',
  });
  
  // Public readonly version
  selectedDomEntry = this.selectedDomEntrySignal.asReadonly();

  private stateClearSignal = signal<boolean>(true);
  stateClear = this.stateClearSignal.asReadonly();

  private entriesUpdatedSignal = signal<number>(0);
  entriesUpdated = this.entriesUpdatedSignal.asReadonly();

  domEntries: DomEntry[] = [];

  constructor() {
    this.domEntries = [];
  }

  getDomEntries(): Observable<DomEntry[]> {
    // Keep this as Observable for now
    const cddEntriesTemplate = localStorage.getItem('cddEntries_Template');
    if (!cddEntriesTemplate) {
      this.domEntries = [];
    } else {
      this.domEntries = JSON.parse(cddEntriesTemplate);
    }

    return of(
      this.domEntries.sort((a: any, b: any) => {
        return (b.dummy = a.dummy);
      })
    );
  }

  setFormDomEntry(domEntry: DomEntry) {
    this.selectedDomEntrySignal.set(domEntry);
  }

  addDomEntry(domEntry: DomEntry) {
    this.domEntries.unshift(domEntry);
    localStorage.setItem('cddEntries_Template', JSON.stringify(this.domEntries));
    this.entriesUpdatedSignal.update(v => v + 1);
  }

  updateDomEntry(domEntry: DomEntry) {
    this.domEntries.forEach((cur, index) => {
      if (domEntry.id === cur.id) {
        this.domEntries.splice(index, 1);
      }
    });
    this.domEntries.unshift(domEntry);
    localStorage.setItem('cddEntries_Template', JSON.stringify(this.domEntries));
    this.entriesUpdatedSignal.update(v => v + 1);
  }

  deleteDomEntry(domEntry: DomEntry) {
    this.domEntries.forEach((cur, index) => {
      if (domEntry.id === cur.id) {
        this.domEntries.splice(index, 1);
      }
    });
    localStorage.setItem('cddEntries_Template', JSON.stringify(this.domEntries));
    this.entriesUpdatedSignal.update(v => v + 1);
  }

  deleteAllDomEntries() {
    localStorage.removeItem('cddEntries_Template');
    this.entriesUpdatedSignal.update(v => v + 1);
    this.clearState();
  }

  clearState() {
    this.stateClearSignal.set(true);
  }
}
```

### Step 2: Update Component Subscriptions (6-8 hours)

**Pattern 1: Using effect() instead of subscribe()**
```typescript
import { Component, effect, injector } from '@angular/core';

export class DomEntriesComponent implements OnInit {
  injector = inject(Injector);

  ngOnInit() {
    effect(() => {
      const entry = this.domService.selectedDomEntry();
      if (entry.id !== null) {
        // react to change
      }
    }, { injector: this.injector });
  }
}
```

### Step 3: Template Updates (1-2 hours)

Templates already work! Just use signals directly:

```html
<!-- Works with both patterns -->
<div>{{ domService.selectedDomEntry()?.clientName }}</div>
```

---

## Files to Update (in order)

1. **src/app/services/dom.service.ts** - Core migrations
2. **src/app/components/dom/domentries/domentries.component.ts** - Update subscriptions
3. **src/app/components/dom/domentry/domentry.component.ts** - Update subscriptions
4. **src/app/components/navbar/navbar.component.ts** - Update subscriptions
5. **src/app/services/language.service.ts** - Optional migration

---

## Expected Performance Gains

| Metric | Before | After | Gain |
|--------|--------|-------|------|
| Change Detection | Higher | Lower | 10-15% |
| Memory Usage | Higher | Lower | 5-10% |
| Code Complexity | Medium | Low | Simpler |

---

## Checklist for Phase 2

- [ ] Read Signals documentation
- [ ] Create feature branch
- [ ] Update DomService
- [ ] Test DomService locally
- [ ] Update components one by one
- [ ] Run full test suite
- [ ] Performance test
- [ ] Get team review
- [ ] Merge to main

---

**Ready to Start Phase 2?** Plan 2-3 working days for implementation and testing.

For more info, see [Angular Signals Documentation](https://angular.io/guide/signals)
