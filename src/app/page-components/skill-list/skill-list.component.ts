import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.css']
})
export class SkillListComponent implements OnInit {

  @Input() title: string;

  @Input() skillList: Array<string>;

  constructor() { }

  ngOnInit() {
  }

}
