import { Component, Input, OnInit } from '@angular/core';
import en from 'client/app/shared/language/en';
import { LanguageService } from 'client/app/shared/services/language.service';

@Component({
  selector: 'app-language-modal',
  templateUrl: './language-modal.component.html',
  styleUrls: ['./language-modal.component.scss']
})
export class LanguageModalComponent implements OnInit {
  @Input() id: string = 'modal'

  l = en

  constructor(private languageService: LanguageService) {}

  async ngOnInit() {
    this.languageService.get().subscribe({ next: (l) => this.l = l })
  }
}
