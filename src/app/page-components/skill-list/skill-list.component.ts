import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SkillListComponent implements OnInit {

  @Input() title: string;

  @Input() skillList: Array<string>;

  constructor() { }

  ngOnInit() {
  }

}
