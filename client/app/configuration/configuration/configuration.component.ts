import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DisplayUtilsService } from 'client/app/shared/services/display-utils.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  step: 0 | 1 | 2 | 3 | 4 = 0

  constructor(private displayUtils: DisplayUtilsService, private title: Title) { }

  async ngOnInit(): Promise<void> {
    this.title.setTitle("Configuration • EML AdminTool")

    // await this.displayUtils.changeTexteWithTransition('h1', 1000, 1000, 'Welcome!');
    // await this.displayUtils.changeTexteWithTransition('h1', 2000, 1000, 'You can now configure the EML&nbsp;AdminTool.');
    // await this.displayUtils.unDisplayElementWithTransition('h1', 4000, 500);
    await this.displayUtils.unDisplayElementWithTransition('h1', 0, 500);

    await this.displayUtils.displayElementWithTransition('app-configuration1 form', 0, 500)
    this.step = 1

  }

}
