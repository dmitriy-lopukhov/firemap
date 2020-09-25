import { Component } from '@angular/core';
import { LeafletEvent, LeafletMouseEvent } from 'leaflet';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PkkService } from './services/pkk.service';
import { IFeature } from './types/feature.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'firemap';
  opened = false;
  data$: Observable<IFeature | null>;

  constructor(private pkkService: PkkService) {
    this.data$ = this.pkkService.state$.pipe(
      tap((data) => {
        if (data) {
          this.opened = true;
        }
      })
    );
  }

  onMarkerClicked(event: LeafletEvent): void {
    this.opened = true;
  }

  onMapClicked(latlng: { lat: number; lng: number }): void {
    console.log(latlng);
    this.pkkService.getInformation(latlng.lat, latlng.lng);
  }
}
