import { NgModule } from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule(
  /* TODO(standalone-migration): clean up removed NgModule class manually. 
{
    declarations: [AppComponent],
  
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
        ButtonsModule.forRoot(),
        TabsModule.forRoot(),
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        NavbarComponent,
        LanguageComponent,
        DomEntryComponent,
        DomEntriesComponent,
        DomSettingsComponent,
        DomExportComponent,
        DomLoadComponent,
        DomSaveComponent,
        DomToolsComponent,
    ],
    providers: [
        DomService,
        LanguageService,
        BsModalRef,
        provideHttpClient(withInterceptorsFromDi()),
    ],
} */)
export class AppModule { }
