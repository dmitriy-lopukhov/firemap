import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  NgZone,
  Output,
} from '@angular/core';
import {
  circle,
  Icon,
  latLng,
  LeafletEvent,
  LeafletMouseEvent,
  Marker,
  marker,
  polygon,
  tileLayer,
} from 'leaflet';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';

@Component({
  selector: 'app-marker-map',
  templateUrl: './marker-map.component.html',
  styleUrls: ['./marker-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkerMapComponent {
  @Output() markerClicked = new EventEmitter<LeafletEvent>();
  @Output() mapClicked = new EventEmitter<{ lat: number; lng: number }>();
  marker: Marker<any> = marker([55.008354, 82.93573], {
    title: 'Пожар',
  }).on('click', (event) => {
    this.zone.run(() => this.onMarkerClick(event));
  });
  layers: Marker<any>[] = [this.marker];

  constructor(private zone: NgZone) {}

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 5,
    center: latLng(55.008354, 82.93573),
  };

  onMarkerClick(event: LeafletEvent): void {
    console.log(event);
    // this.markerClicked.next(event);
  }

  onLeafletClick(event: LeafletMouseEvent): void {
    this.layers = [];
    this.layers.push(
      marker([event.latlng.lat, event.latlng.lng], {
        title: `${event.latlng.lat}, ${event.latlng.lng}`,
      })
    );
    this.mapClicked.next(event.latlng);
  }
}
