import { Component, Input, OnInit } from '@angular/core';
import en from 'client/app/shared/language/en';
import { EnvService } from 'client/app/shared/services/env.service';

@Component({
  selector: 'app-language-modal',
  templateUrl: './language-modal.component.html',
  styleUrls: ['./language-modal.component.scss']
})
export class LanguageModalComponent implements OnInit {
  @Input() id: string = 'modal'

  l = en

  constructor(private envService: EnvService) {}

  async ngOnInit() {
    this.envService.get().subscribe({ next: (env) => this.l = env.language })
  }
}
