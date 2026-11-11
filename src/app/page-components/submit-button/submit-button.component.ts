import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SubmitButtonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
