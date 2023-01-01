import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DefaultResponse } from 'api/types/response';
import { ApiConfigureService } from 'client/app/shared/services/api/api-configure.service';
import { Config } from 'client/app/shared/types/config';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-configuration-form-template',
  templateUrl: './configuration-form-template.component.html',
  styleUrls: ['./configuration-form-template.component.scss']
})
export class ConfigurationFormComponent {

  @Input() prev: boolean = true
  @Input() next: boolean = true
  @Input() cond: boolean = true
  @Input() data!: Config

  private putLanguage$!: Observable<HttpResponse<DefaultResponse>>

  constructor(private apiConfigureService: ApiConfigureService) { }

  onSubmit() {
    if (this.data.data == 'language') {
      this.putLanguage$ = this.apiConfigureService.putLanguage(this.data.value)
      this.putLanguage$.subscribe(
        {
          next(val) {
            //next
            console.log(val);
          }
        }
      )
    }
  }

}
