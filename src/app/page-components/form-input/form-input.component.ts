import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent implements OnInit {
  
  @Input() title: string;
  @Input() type: string;
  @Input() titleName: string;
  
  constructor() { }

  ngOnInit() {
  }

}
