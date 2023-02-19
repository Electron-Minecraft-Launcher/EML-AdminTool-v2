import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../shared/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ready = false

  constructor(private languageService: LanguageService) { }

  async ngOnInit() {
    this.ready = await this.languageService.init()
  }

}
