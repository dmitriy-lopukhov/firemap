import { Component, Input, OnInit } from '@angular/core';
import { HeatService } from 'src/app/services/heat.service';
import { PkkService } from 'src/app/services/pkk.service';
import { PointService } from 'src/app/services/point.service';
import { IHeatItem } from 'src/app/types/heat.type';
import { IMapPoint } from 'src/app/types/map-point.type';

@Component({
  selector: 'app-heat-list',
  templateUrl: './heat-list.component.html',
  styleUrls: ['./heat-list.component.scss'],
})
export class HeatListComponent implements OnInit {
  @Input() heat: IHeatItem[] | null = null;

  constructor(
    private pointService: PointService,
    private heatService: HeatService,
    private pkkService: PkkService
  ) {}

  ngOnInit(): void {}

  onSelectPoint(point: IHeatItem): void {
    const mapEvent: IMapPoint = {
      lat: point.point.lat,
      lng: point.point.lon,
    };
    const firePoint: {
      firearea: number;
      pointId: number;
    } | null = this.heatService.getFirePoint(mapEvent, this.heat);
    if (firePoint) {
      mapEvent.firearea = firePoint.firearea;
      mapEvent.pointId = firePoint.pointId;
    }
    this.pointService.setMapPoint(mapEvent);
    this.pkkService.getInformation(mapEvent.lat, mapEvent.lng);
  }
}
