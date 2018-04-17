import { Component, OnInit } from '@angular/core';
import { ClockService } from '../services/clock.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private clock: ClockService) { }

  ngOnInit() {
  }

  getClock():number {
  	return this.clock.getClock();
  }

}
