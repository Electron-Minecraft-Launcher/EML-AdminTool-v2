import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-language-modal',
  templateUrl: './language-modal.component.html',
  styleUrls: ['./language-modal.component.scss']
})
export class LanguageModalComponent {
  @Input() id: string = 'modal'
}
