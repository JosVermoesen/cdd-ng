import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule, createTranslateLoader } from './app/app.module';
import { DomService } from './app/services/dom.service';
import { LanguageService } from './app/services/language.service';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { provideHttpClient, withInterceptorsFromDi, HttpClient } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, ReactiveFormsModule, TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }), ButtonsModule.forRoot(), TabsModule.forRoot(), BsDatepickerModule.forRoot(), ModalModule.forRoot()),
        DomService,
        LanguageService,
        BsModalRef,
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
    ]
})
  .catch(err => console.error(err));
