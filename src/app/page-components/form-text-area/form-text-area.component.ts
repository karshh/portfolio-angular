import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-text-area',
  templateUrl: './form-text-area.component.html',
  styleUrls: ['./form-text-area.component.css']
})
export class FormTextAreaComponent implements OnInit {

  @Input() title: string;
  @Input() titleName: string;
  
  constructor() { }

  ngOnInit() {
  }

}
