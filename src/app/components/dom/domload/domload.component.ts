import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { DomEntry } from './../../../models/domEntry';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-domload',
  templateUrl: './domload.component.html',
  styleUrls: ['./domload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslateModule],
})
export class DomLoadComponent implements OnInit {
  bsModalRef = inject(BsModalRef);
  fb = inject(FormBuilder);

  title!: string;
  closeBtnName!: string;
  locationReload = false;

  domLoadForm!: FormGroup;
  domJson!: DomEntry[];

  localStorageItems = [] as string[];
  localStorageItemValues = [] as string[];

  public onSelected!: Subject<boolean>;

  public ngOnInit(): void {
    this.onChangeGroupType('cddClient_');
    this.onSelected = new Subject();
  }

  onChangeGroupType(groupTypeTarget: any) {
    const domToSearch = groupTypeTarget.value || 'choose';
    const lengthOfSearch = domToSearch.length;
    this.localStorageItems = [];
    this.localStorageItemValues = [];
    for (let i = 0, len = localStorage.length; i < len; i++) {
      const key = localStorage.key(i) as string;
      if (key.substring(0, lengthOfSearch) === domToSearch) {
        const value = localStorage[key];
        const itemDescription = key.substring(lengthOfSearch);
        this.localStorageItems.push(itemDescription);
        this.localStorageItemValues.push(value);

        // console.log(domToSearch + itemDescription + ' (key)' + ' => ' + value);
      } else {
        // skip
      }
    }
    this.localStorageItems.sort();
    this.domLoadForm = this.fb.group({
      groupType: [groupTypeTarget.value, Validators.required],
      name: [this.localStorageItems[0], Validators.required],
      replaceEntries: [false],
      deleteAfterLoading: [false],
    });
  }

  onSubmit() {
    if (this.domLoadForm.valid) {
      const areThereEntries = localStorage.getItem('cddEntries_Template');
      this.locationReload = true;
      const itemName =
        this.domLoadForm.value.groupType + this.domLoadForm.value.name;

      if (this.domLoadForm.value.replaceEntries) {
        localStorage.removeItem('cddEntries_Template');

        const itemVal = localStorage.getItem(itemName);
        if (itemVal) {
          this.domJson = JSON.parse(itemVal);
        } else {
          this.domJson = [];
        }
        localStorage.setItem(
          'cddEntries_Template',
          JSON.stringify(this.domJson)
        );
      } else {
        // Initialize domJson with existing entries or empty array
        if (areThereEntries) {
          const templateVal = localStorage.getItem('cddEntries_Template');
          if (templateVal) {
            this.domJson = JSON.parse(templateVal);
          }
        } else {
          this.domJson = [];
        }

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

        localStorage.setItem(
          'cddEntries_Template',
          JSON.stringify(this.domJson)
        );

        if (this.domLoadForm.value.deleteAfterLoading === true) {
          localStorage.removeItem(itemName);
        }
      }
      this.onSelected.next(true);
      this.bsModalRef.hide();
    }
  }
}
