import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { DomEntry } from './../../../models/domEntry';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-domsave',
  templateUrl: './domsave.component.html',
  styleUrls: ['./domsave.component.css'],
  imports: [ReactiveFormsModule, NgIf, TranslateModule],
})
export class DomSaveComponent implements OnInit {
  bsModalRef = inject(BsModalRef);
  fb = inject(FormBuilder);

  title!: string;
  closeBtnName!: string;
  locationReload = false;

  domSaveForm!: FormGroup;
  domJson!: DomEntry[];

  public onSaved!: Subject<boolean>;

  public ngOnInit(): void {
    this.onSaved = new Subject();
    const entriesVal = localStorage.getItem('cddEntries_Template');
    this.domJson = JSON.parse(entriesVal as string);
    this.domSaveForm = this.fb.group({
      groupType: [null, Validators.required],
      name: [null, Validators.required],
      clearEntriesAfterSaving: [true],
    });
  }

  onSubmit() {
    if (this.domSaveForm.valid) {
      this.locationReload = true;
      const itemName =
        this.domSaveForm.value.groupType + this.domSaveForm.value.name;
      localStorage.setItem(itemName, JSON.stringify(this.domJson));

      if (this.domSaveForm.value.clearEntriesAfterSaving === true) {
        localStorage.removeItem('cddEntries_Template');
      }
      this.onSaved.next(true);
      this.bsModalRef.hide();
    }
  }
}
