import { Component, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';

import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LanguageComponent } from './language/language.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class NavbarComponent {
  bsModalRef!: BsModalRef;
  modalService = inject(BsModalService);
  translate = inject(TranslateService);
  destroyRef = inject(DestroyRef);

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
    this.bsModalRef.content.onSelected.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      // when closed do something eventualy
    });

    this.bsModalRef.content.closeBtnName = lblCloseBtnName;
  }
}
