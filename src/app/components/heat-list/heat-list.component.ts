import { Component, Input, OnInit } from '@angular/core';
import { IHeatItem } from 'src/app/types/heat.type';

@Component({
  selector: 'app-heat-list',
  templateUrl: './heat-list.component.html',
  styleUrls: ['./heat-list.component.scss'],
})
export class HeatListComponent implements OnInit {
  @Input() heat: IHeatItem[] | null = null;

  constructor() {}

  ngOnInit(): void {}

  onSelectPoint(point: IHeatItem) {}
}
