import { Component, inject, OnInit } from '@angular/core';
import { LanguageService } from './services/language.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DomEntryComponent } from './components/dom/domentry/domentry.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NavbarComponent, DomEntryComponent],
})
export class AppComponent implements OnInit {
  ls = inject(LanguageService);

  ngOnInit() {
    this.ls.setInitialAppLanguage();
  }
}
