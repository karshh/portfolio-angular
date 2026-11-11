import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-form-text-area',
  templateUrl: './form-text-area.component.html',
  styleUrls: ['./form-text-area.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class FormTextAreaComponent implements OnInit {

  @Input() title: string;
  @Input() titleName: string;
  
  constructor() { }

  ngOnInit() {
  }

}
