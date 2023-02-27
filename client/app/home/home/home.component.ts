import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfigureService } from 'client/app/shared/services/api/api-configure.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private apiConfigureService: ApiConfigureService) { }

  ngOnInit(): void {

    this.router.navigate(['/dashboard'])

  }

}
