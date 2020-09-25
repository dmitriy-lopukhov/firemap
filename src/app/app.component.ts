import { Component } from '@angular/core';
import { LeafletEvent } from 'leaflet';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HeatService } from './services/heat.service';
import { PkkService } from './services/pkk.service';
import { IFeature } from './types/feature.type';
import { IHeatPoint } from './types/heat.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'firemap';
  opened = false;
  data$: Observable<IFeature | null>;
  heat$: Observable<IHeatPoint[]>;

  constructor(
    private pkkService: PkkService,
    private heatService: HeatService
  ) {
    this.data$ = this.pkkService.state$.pipe(
      tap((data) => {
        if (data) {
          this.opened = true;
        }
      })
    );
    this.heat$ = this.heatService.points$;
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
