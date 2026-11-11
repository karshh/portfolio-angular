import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class FormInputComponent implements OnInit {
  
  @Input() title: string;
  @Input() type: string;
  @Input() titleName: string;
  
  constructor() { }

  ngOnInit() {
  }

}
