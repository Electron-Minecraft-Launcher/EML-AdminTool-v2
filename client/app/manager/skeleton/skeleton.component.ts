import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent implements OnInit {

  @Input() padding: string = '0px'
  @Input() height: string = '24px'
  @Input() randomWidth: { times: number, min: number } = { times: 100, min: 30 }
  @Input() customStyle: { [key: string]: string }[] = []
  width: string = ''
  style = ''

  ngOnInit() {

    this.width = (Math.random() * this.randomWidth.times + this.randomWidth.min) + 'px'

    console.log(this.customStyle);


    this.style += 'padding: ' + this.padding + '; '
    this.style += 'height: ' + this.height + '; '
    this.style += 'width: ' + this.width + '; '

    this.customStyle.forEach(element => {
      this.style += Object.entries(element)[0][0] + ': ' + element[Object.entries(element)[0][0]] + ' !important; '
    })

  }

}
