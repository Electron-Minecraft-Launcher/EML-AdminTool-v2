import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiConfigureService } from 'client/app/shared/services/api/api-configure.service';
import { StepManagerService } from 'client/app/shared/services/configure/step-manager.service';
import { DisplayUtilsService } from 'client/app/shared/services/display-utils.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  step: 0 | 1 | 2 | 3 | 4 = 0

  constructor(private displayUtils: DisplayUtilsService, private title: Title, private stepManagerService: StepManagerService, private apiConfigureService: ApiConfigureService, private router: Router) {
    this.stepManagerService.getStep().subscribe((step) => {
      document.getElementById('config-slider')?.classList.remove('step-' + (this.step))
      this.step = step
      document.getElementById('config-slider')?.classList.add('step-' + step)
      if (this.step == 4) {
        this.finish()
      }
    })
  }

  async ngOnInit(): Promise<void> {
    this.title.setTitle("Configuration • EML AdminTool")

    this.apiConfigureService.getConfigure().subscribe({
      next: (res) => {
        if (res.body?.code == 'SUCCESS') {
          this.router.navigate(['/'])
        } else {
          this.start()
        }
      },
      error: (err) => {
        if (err.body?.code == 'SUCCESS') {
          this.router.navigate(['/'])
        } else {
          this.start()
        }
      }
    })

  }

  async start() {
    await this.displayUtils.changeTexteWithTransition('h1', 1000, 1000, 'Welcome!')
    await this.displayUtils.changeTexteWithTransition('h1', 2000, 1000, 'You can now configure the EML&nbsp;AdminTool.')
    await this.displayUtils.unDisplayElementWithTransition('h1', 4000, 500)
    await this.displayUtils.unDisplayElementWithTransition('h1', 0, 500)

    document.querySelector<HTMLElement>('div.config-slider')!.style.display = 'block'
    await this.displayUtils.displayElementWithTransition('app-configuration1 form', 0, 500)
    await this.displayUtils.displayElementWithTransition('app-configuration2 form', 0, 500)
    await this.displayUtils.displayElementWithTransition('app-configuration3 form', 0, 500)
    this.stepManagerService.updateStep(1)
  }

  async finish() {
    await this.displayUtils.changeTexteWithTransition('h1', 0, 500, '')
    document.querySelector<HTMLElement>('div.config-slider')!.style.display = 'none'
    await this.displayUtils.displayElementWithTransition('h1', 0, 0)
    await this.displayUtils.changeTexteWithTransition('h1', 500, 1000, 'You can now use the EML&nbsp;AdminTool!')
    await this.displayUtils.unDisplayElementWithTransition('h1', 1500, 500)
    await this.displayUtils.unDisplayElementWithTransition('h1', 0, 500)
    this.router.navigate(['/'])
  }

}
