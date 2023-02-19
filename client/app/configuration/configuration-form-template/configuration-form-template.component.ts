import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DefaultResponse } from 'client/app/shared/models/responses/response.model';
import { ApiConfigureService } from 'client/app/shared/services/api/api-configure.service';
import { StepManagerService } from 'client/app/shared/services/configure/step-manager.service';
import { LanguageService } from 'client/app/shared/services/language.service';
import { UtilsService } from 'client/app/shared/services/utils.service';
import { Config } from 'client/app/shared/models/configurations/config.model';
import { User } from 'client/app/shared/models/features/user.model';
import { Observable } from 'rxjs';
import en from 'client/app/shared/language/en';

@Component({
  selector: 'app-configuration-form-template',
  templateUrl: './configuration-form-template.component.html',
  styleUrls: ['./configuration-form-template.component.scss']
})
export class ConfigurationFormComponent implements OnInit {

  l = en

  @Input() id!: string

  @Input() prev: boolean = true
  @Input() next: boolean = true
  @Input() cond: boolean = true
  @Input() language?: Config
  @Input() dbPassword?: string
  @Input() adminAccount?: User

  private putLanguage$!: Observable<HttpResponse<DefaultResponse>>
  private putDbPassword$!: Observable<HttpResponse<DefaultResponse>>
  private step: 0 | 1 | 2 | 3 | 4 = 0

  constructor(private apiConfigureService: ApiConfigureService, private stepManagerService: StepManagerService, private utils: UtilsService, private languageService: LanguageService) {
    this.stepManagerService.getStep().subscribe((step) => {
      this.step = step
    })
  }

  ngOnInit() {
    this.languageService.get().subscribe({ next: (l) => this.l = l })
  }

  async onSubmit() {
    if (this.language) {
      document.querySelector<HTMLElement>('app-loading-splash#config-1')!.style.display = 'block'
      this.putLanguage$ = this.apiConfigureService.putLanguage(this.language.value)
      this.putLanguage$.subscribe(
        {
          next: async (val) => {
            this.stepManagerService.updateStep(2)
            await this.utils.sleep(500)
            document.querySelector<HTMLElement>('app-loading-splash')!.style.display = 'none'
          }
        }
      )
    }
    if (this.dbPassword) {
      document.querySelector<HTMLElement>('app-loading-splash#config-2')!.style.display = 'block'
      this.putDbPassword$ = this.apiConfigureService.putDbPassword(this.dbPassword)
      this.putDbPassword$.subscribe(
        {
          next: async (val) => {
            this.stepManagerService.updateStep(3)
            await this.utils.sleep(500)
            document.querySelector<HTMLElement>('app-loading-splash')!.style.display = 'none'
          }
        }
      )
    }
  }

  onPrevious() {
    let step = this.step - 1
    if (step == 0 || step == 1 || step == 2 || step == 3 || step == 4) {
      this.stepManagerService.updateStep(step)
    }
  }

}
