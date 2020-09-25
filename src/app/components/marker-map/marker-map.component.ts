import { Component } from '@angular/core';
import { circle, latLng, marker, polygon, tileLayer } from 'leaflet';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';

@Component({
  selector: 'app-marker-map',
  templateUrl: './marker-map.component.html',
  styleUrls: ['./marker-map.component.scss'],
})
export class MarkerMapComponent {
  constructor() {}

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
  layers = [
    circle([55.008354, 82.93573], { radius: 5000 }),
    polygon([
      [53.008354, 83.93573],
      [52.008354, 84.93573],
      [51.008354, 82.93573],
    ]),
    marker([55.008354, 82.93573], {
      title: 'Пожар',
    }),
  ];
}
