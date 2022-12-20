import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UtilsService } from 'client/app/shared/utils.service';

@Component({
  selector: 'app-configuration1',
  templateUrl: './configuration1.component.html',
  styleUrls: ['./configuration1.component.scss']
})
export class Configuration1Component implements OnInit {

  constructor(private utils: UtilsService, private title: Title) { }

  async ngOnInit(): Promise<void> {
    this.title.setTitle("Configuration • EML AdminTool")

    // await this.utils.changeTexteWithTransition('h1', 1000, 1000, 'Welcome!');
    // await this.utils.changeTexteWithTransition('h1', 2000, 1000, 'You can now configure the EML&nbsp;AdminTool.');
    // await this.utils.unDisplayElementWithTransition('h1', 4000, 500);
    await this.utils.unDisplayElementWithTransition('h1', 0, 500);

    await this.utils.displayElementWithTransition('form', 0, 500)

  }

  onSubmit() {

  }

}
