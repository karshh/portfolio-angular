import { Injectable } from '@angular/core';

@Injectable()
export class ClockService {

  private today: number;

  constructor() {
	  this.runClock();
  }

  updateClock():void {
  	this.today = Date.now();
  }

  runClock() {
  	this.updateClock();
  	setInterval(() => this.runClock(), 1000 * 20);
  }

  getClock() {
  	return this.today;
  }

}
