import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  @Input() step!: 1 | 2 | 3 | 4;

  constructor() { }

  ngOnInit(): void {

    switch (this.step) {
      case 1:
        document.getElementById('progress')!.style.width = '17%'
        break;
      case 2:
        document.getElementById('progress')!.style.width = '50%'
        break;
      case 3:
        document.getElementById('progress')!.style.width = '84%'
        break;
      case 4:
        document.getElementById('progress')!.style.width = '100%'
        document.getElementById('progress')!.style.borderTopRightRadius = '0'
        document.getElementById('progress')!.style.borderBottomRightRadius = '0'
        break;
    }

  }

}
