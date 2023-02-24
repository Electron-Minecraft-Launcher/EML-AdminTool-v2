import { Component, OnInit } from '@angular/core';
import { ApiConfigureService } from '../shared/services/api/api-configure.service';
import { EnvService } from '../shared/services/env.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ready1 = false
  ready2 = false
  ready = this.ready1 && this.ready2

  constructor(private envService: EnvService, private apiConfigureService: ApiConfigureService) { }

  async ngOnInit() {
    this.ready1 = await this.envService.init()
    this.ready = this.ready1 && this.ready2
    this.apiConfigureService.getConfigure().subscribe({
      next: (res) => {
        this.ready2 = true
        this.ready = this.ready1 && this.ready2
      },
      error: (err) => {
        this.ready2 = true
        this.ready = this.ready1 && this.ready2
      }
    })
  }

}
