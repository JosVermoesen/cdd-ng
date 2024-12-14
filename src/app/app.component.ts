import { Component, inject, OnInit } from '@angular/core';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  ls = inject(LanguageService)

  ngOnInit() {
    this.ls.setInitialAppLanguage();
  }
}
