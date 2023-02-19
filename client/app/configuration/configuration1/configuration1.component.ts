import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Config } from 'client/app/shared/models/configurations/config.model';
import { DisplayUtilsService } from 'client/app/shared/services/display-utils.service';
import { LanguageService } from 'client/app/shared/services/language.service';
import en from 'client/app/shared/language/en';

@Component({
  selector: 'app-configuration1',
  templateUrl: './configuration1.component.html',
  styleUrls: ['./configuration1.component.scss']
})
export class Configuration1Component implements OnInit {

  l = en

  @Output() stepUpdated = new EventEmitter<any>();
  language: Config = {
    data: 'language',
    value: undefined,
  }

  constructor(private displayUtils: DisplayUtilsService, private languageService: LanguageService) { }

  ngOnInit() {
    this.languageService.get().subscribe({ next: (l) => this.l = l })
  }

  onEn() {
    let enButton = document.getElementById('en-button')
    let frButton = document.getElementById('fr-button')

    if (!enButton?.classList.contains('selected')) {
      if (frButton?.classList.contains('selected')) {
        frButton.classList.remove('selected')
      }
      enButton?.classList.add('selected')
      this.language.value = 'en'
      this.languageService.set('en')
    } else {
      enButton.classList.remove('selected')
      this.language.value = undefined
    }
  }

  onFr() {
    let enButton = document.getElementById('en-button')
    let frButton = document.getElementById('fr-button')

    if (!frButton?.classList.contains('selected')) {
      if (enButton?.classList.contains('selected')) {
        enButton.classList.remove('selected')
      }
      frButton?.classList.add('selected')
      this.language.value = 'fr'
      this.languageService.set('fr')
    } else {
      frButton.classList.remove('selected')
      this.language.value = undefined
      this.languageService.set('en')
    }
  }

  updateStep(step: any) {
    this.stepUpdated.emit(step)
  }

  async onLanguageModal(open: boolean) {
    await this.displayUtils.showModal('language-modal')
  }

}
