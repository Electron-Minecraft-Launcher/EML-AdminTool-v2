import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  @Input() step!: 0 | 1 | 2 | 3 | 4;

  constructor() { }

  ngOnInit(): void { }

}
