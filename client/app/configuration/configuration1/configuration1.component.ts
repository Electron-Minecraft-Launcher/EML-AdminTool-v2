import { Component } from '@angular/core';
import { Config } from 'client/app/shared/types/config';
import { DisplayUtilsService } from 'client/app/shared/services/display-utils.service';

@Component({
  selector: 'app-configuration1',
  templateUrl: './configuration1.component.html',
  styleUrls: ['./configuration1.component.scss']
})
export class Configuration1Component {

  data: Config = {
    data: 'language',
    value: undefined,
  }

  constructor(private displayUtils: DisplayUtilsService) { }

  onEn() {
    let enButton = document.getElementById('en-button')
    let frButton = document.getElementById('fr-button')

    if (!enButton?.classList.contains('selected')) {
      if (frButton?.classList.contains('selected')) {
        frButton.classList.remove('selected')
      }
      enButton?.classList.add('selected')
      this.data.value = 'en'
    } else {
      enButton.classList.remove('selected')
      this.data.value = undefined
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
      this.data.value = 'fr'
    } else {
      frButton.classList.remove('selected')
      this.data.value = undefined
    }
  }

  async onLanguageModal(open: boolean) {
    await this.displayUtils.showModal('language-modal')
  }

}
