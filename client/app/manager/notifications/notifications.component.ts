import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  @Input() type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'INFO'
  @Input() content: string = ''

}
