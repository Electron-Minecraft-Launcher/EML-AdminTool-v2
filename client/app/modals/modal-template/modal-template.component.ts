import { Component, Input } from '@angular/core';
import { DisplayUtilsService } from 'client/app/shared/services/display-utils.service';

@Component({
  selector: 'app-modal-template',
  templateUrl: './modal-template.component.html',
  styleUrls: ['./modal-template.component.scss']
})
export class ModalTemplateComponent {

  @Input() size: 's' | 'm' | 'l' = 'm'
  @Input() id: string = 'modal'

  constructor(private displayUtils: DisplayUtilsService) {}

  async onCloseModal() {
    await this.displayUtils.closeModal(this.id)
  }

}
