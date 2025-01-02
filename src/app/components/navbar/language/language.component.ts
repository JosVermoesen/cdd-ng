import { Component, inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { LanguageService } from './../../../services/language.service';
import { Language } from 'src/app/models/language';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css'],
  imports: [NgFor],
})
export class LanguageComponent implements OnInit {
  title!: string;
  closeBtnName!: string;

  languages!: Language[];
  selected = '';

  public onSelected!: Subject<boolean>;
  bsModalRef = inject(BsModalRef);
  ls = inject(LanguageService);

  public ngOnInit(): void {
    this.onSelected = new Subject();
    this.languages = this.ls.getLanguages();
    this.selected = this.ls.selected;
  }

  select(lng: string) {
    this.ls.setLanguage(lng);
    // this.saveSettings();
    // this.popoverCtrl.dismiss();

    this.onSelected.next(true);
    this.bsModalRef.hide();
  }
}
