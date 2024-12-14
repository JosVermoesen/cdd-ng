import { Component, inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { LanguageComponent } from './language/language.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent {
  bsModalRef!: BsModalRef;
  modalService = inject(BsModalService)
  translate = inject(TranslateService)

  onLanguageModal() {
    const lblTitle = this.translate.instant('NAVBAR.LanguageModalTitle');
    const lblCloseBtnName = this.translate.instant(
      'NAVBAR.LanguageModalCloseBtnName'
    );

    const initialState = {
      title: lblTitle,
    };
    this.bsModalRef = this.modalService.show(LanguageComponent, {
      initialState,
    });
    this.bsModalRef.content.onSelected.subscribe(() => {
      // when closed do something eventualy
    });

    this.bsModalRef.content.closeBtnName = lblCloseBtnName;
  }
}
