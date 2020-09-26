import { Component } from '@angular/core';
import { LeafletEvent } from 'leaflet';
import { combineLatest, Observable } from 'rxjs';
import { tap, map, debounceTime } from 'rxjs/operators';
import { HeatService } from './services/heat.service';
import { PkkService } from './services/pkk.service';
import { PointService } from './services/point.service';
import { IFeature } from './types/feature.type';
import { IHeatItem } from './types/heat.type';
import { IMapPoint } from './types/map-point.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'firemap';
  opened = false;
  data$: Observable<{
    data: IFeature | null;
    point: IMapPoint | null;
  } | null>;
  heat$: Observable<IHeatItem[]>;

  constructor(
    private pkkService: PkkService,
    private heatService: HeatService,
    private pointService: PointService
  ) {
    this.data$ = combineLatest([
      this.pkkService.state$,
      this.pointService.state$,
    ]).pipe(
      debounceTime(100),
      map(([feature, point]) => {
        if (feature || point) {
          this.opened = true;
        }
        return {
          data: feature,
          point,
        };
      })
    );
    this.heat$ = this.heatService.state$.pipe(
      tap((data) => console.log('heat', data))
    );
    this.heatService.getHeatPoints();
  }

  onMarkerClicked(event: LeafletEvent): void {
    this.opened = true;
  }

  onMapClicked(latlng: { lat: number; lng: number }): void {
    console.log(latlng);
    this.pkkService.getInformation(latlng.lat, latlng.lng);
  }
}
