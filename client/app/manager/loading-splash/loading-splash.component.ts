import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-splash',
  templateUrl: './loading-splash.component.html',
  styleUrls: ['./loading-splash.component.scss']
})
export class LoadingSplashComponent {

  @Input() transparent: boolean = false

}
