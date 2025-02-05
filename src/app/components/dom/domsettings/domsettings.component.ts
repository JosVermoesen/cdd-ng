import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { DomCompany } from './../../../models/domCompany';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { IbanCheck } from '../../../functions/ibancheck';
import { NinCheck } from '../../../functions/nincheck';
import { format } from 'date-fns';

@Component({
  selector: 'app-domsettings',
  templateUrl: './domsettings.component.html',
  styleUrls: ['./domsettings.component.css'],
  imports: [ReactiveFormsModule, TranslateModule],
})
export class DomSettingsComponent implements OnInit {
  bsModalRef = inject(BsModalRef);
  fb = inject(FormBuilder);
  ts = inject(TranslateService);

  title!: string;
  closeBtnName!: string;
  maleOrFemale!: string;

  domSettingsForm!: FormGroup;
  domSettings!: DomCompany;

  public onSaved!: Subject<boolean>;

  /* nameLabel: string;
  enterpriseNumberLabel: string;
  countryCodeLabel: string;
  streetAndNumberLabel: string;
  postalCodeAndCityLabel: string;
  ibanLabel: string;
  bicLabel: string;
  domIdLabel: string; */

  public ngOnInit(): void {
    /* this.ts.get('CDDSETTINGS.NameLabel').subscribe((res: string) => {
      this.nameLabel = res;
    });
    this.ts.get('CDDSETTINGS.EnterpriseNumberLabel').subscribe((res: string) => {
      this.enterpriseNumberLabel = res;
    });
    this.ts.get('CDDSETTINGS.CountryCodeLabel').subscribe((res: string) => {
      this.countryCodeLabel = res;
    });
    this.ts.get('CDDSETTINGS.StreetAndNumberLabel').subscribe((res: string) => {
      this.streetAndNumberLabel = res;
    });
    this.ts.get('CDDSETTINGS.PostalCodeAndCityLabel').subscribe((res: string) => {
      this.postalCodeAndCityLabel = res;
    });
    this.ts.get('CDDSETTINGS.IbanLabel').subscribe((res: string) => {
      this.ibanLabel = res;
    });
    this.ts.get('CDDSETTINGS.BicLabel').subscribe((res: string) => {
      this.bicLabel = res;
    });
    this.ts.get('CDDSETTINGS.DomIdLabel').subscribe((res: string) => {
      this.domIdLabel = res;
    }); */

    this.onSaved = new Subject();
    const settingsVal = localStorage.getItem('cddSettings_Template');
    this.domSettings = JSON.parse(settingsVal as string);
    if (this.domSettings === null) {
      this.clearState();
    } else {
      this.domSettingsForm = this.fb.group({
        name: [this.domSettings.name, Validators.required],
        enterpriseNumber: [
          this.domSettings.enterpriseNumber,
          Validators.required,
        ],
        country: [this.domSettings.country, Validators.required],
        street: [this.domSettings.street, Validators.required],
        pcPlace: [this.domSettings.pcPlace, Validators.required],
        iban: [this.domSettings.iban, Validators.required],
        bic: [this.domSettings.bic, Validators.required],
        domId: [this.domSettings.domId, Validators.required],
      });
    }
  }

  onSubmit() {
    const ibanIsValid = this.ibanMatchValidator(
      this.domSettingsForm.value.iban
    );
    if (ibanIsValid) {
      if (this.domSettingsForm.valid) {
        this.domSettings = this.domSettingsForm.value;
        localStorage.setItem(
          'cddSettings_Template',
          JSON.stringify(this.domSettings)
        );
      }
      this.onSaved.next(true);
      this.bsModalRef.hide();
    }
  }

  onNinTest() {
    // const shortYear = Number(format(new Date(), 'yy'));
    // const resultString = NinCheck('61022540345', shortYear, 'W', 'ExtendedInfo');
    const resultString = this.ninMatchValidator('61022540345');
    console.log('result: ', resultString);
  }

  onRead() {
    const templateVal = localStorage.getItem('cddSettings_Template');
    this.domSettings = JSON.parse(templateVal as string);
    this.domSettingsForm = this.fb.group({
      name: [this.domSettings.name, Validators.required],
      enterpriseNumber: [
        this.domSettings.enterpriseNumber,
        Validators.required,
      ],
      country: [this.domSettings.country, Validators.required],
      street: [this.domSettings.street, Validators.required],
      pcPlace: [this.domSettings.pcPlace, Validators.required],
      iban: [this.domSettings.iban, Validators.required],
      bic: [this.domSettings.bic, Validators.required],
      domId: [this.domSettings.domId, Validators.required],
    });
  }

  clearState() {
    this.domSettingsForm = this.fb.group({
      name: ['', Validators.required],
      enterpriseNumber: ['', Validators.required],
      country: ['', Validators.required],
      street: ['', Validators.required],
      pcPlace: ['', Validators.required],
      iban: ['', Validators.required],
      bic: ['', Validators.required],
      domId: ['', Validators.required],
    });
  }

  ibanMatchValidator(ibanToCheck: string): boolean {
    const ibanValid = IbanCheck(ibanToCheck, true, false);
    if (ibanValid == ibanToCheck) {
      return true;
    } else {
      console.log('TODO: message iban invalid ');
      return false;
    }
  }

  ninMatchValidator(ninToCheck: string): boolean {
    const shortYear = Number(format(new Date(), 'yy'));
    const ninValid = NinCheck(ninToCheck, shortYear, 'W', 'NinOnly');
    if (ninValid == ninToCheck) {
      return true;
    } else {
      console.log(ninValid);
      return false;
    }
  }
}
