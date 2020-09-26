import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  circle,
  Icon,
  latLng,
  LatLngExpression,
  LeafletEvent,
  LeafletMouseEvent,
  Marker,
  marker,
  Polygon,
  polygon,
  tileLayer,
} from 'leaflet';
import { IHeatItem, IHeatPoint, IPoint } from 'src/app/types/heat.type';
import * as turf from '@turf/turf';
import { IMapClickEvent } from 'src/app/types/marker-map.type';
import { PointService } from 'src/app/services/point.service';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  takeUntil,
} from 'rxjs/operators';

declare var L: any;
declare var HeatmapOverlay: any;

// const initialView = [55.008354, 82.93573]
const initialView = {
  lat: 76.930222617,
  lng: 54.575284095,
};

@Component({
  selector: 'app-marker-map',
  templateUrl: './marker-map.component.html',
  styleUrls: ['./marker-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkerMapComponent implements OnDestroy {
  @Input() set heat(heat: IHeatItem[] | null) {
    this.heats = heat;
    if (heat) {
      const heatPoints: IHeatPoint[] = heat.map((i) => {
        const point: IHeatPoint = {
          lat: i.point.lat,
          lng: i.point.lon,
          count: 1,
        };
        return point;
      });
      const heatPolygons: Polygon<any>[] = heat.map((i) =>
        this.getHeatPolygon(i)
      );
      this.polygons = heatPolygons;
      this.layers = [...this.polygons, ...this.markers];
      const data = {
        data: heatPoints,
      };
      this.heatmapLayer.setData(data);
      if (this.map && heatPoints.length) {
        const coords: LatLngExpression = [heatPoints[0].lat, heatPoints[0].lng];
        this.map.setView(coords, this.zoom);
      }
    }
  }
  get heat(): IHeatItem[] | null {
    return this.heats;
  }
  private heats: IHeatItem[] | null = null;
  @Output() markerClicked = new EventEmitter<LeafletEvent>();
  @Output() mapClicked = new EventEmitter<{ lat: number; lng: number }>();
  map: L.Map | null = null;
  marker: Marker<any> = this.getMarker(initialView.lat, initialView.lng);
  private polygons: Polygon<any>[] = [];
  markers: Marker<any>[] = [this.marker];
  layers: (Polygon<any> | Marker<any>)[] = [...this.polygons, ...this.markers];
  zoom = 9;
  heatmapLayer = new HeatmapOverlay({
    radius: 0.1,
    maxOpacity: 0.7,
    scaleRadius: true,
    useLocalExtrema: true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count',
  });
  destroy$ = new Subject();

  constructor(private zone: NgZone, private pointService: PointService) {
    this.pointService.state$
      .pipe(
        filter((val) => !!val),
        distinctUntilChanged((val1, val2) => {
          return !!(
            val1 &&
            val2 &&
            val1.lat === val2.lat &&
            val1.lng === val2.lng
          );
        }),
        debounceTime(200),
        takeUntil(this.destroy$)
      )
      .subscribe((point) => {
        console.log('point', point);
        if (this.map && point) {
          const coords: LatLngExpression = [point.lat, point.lng];
          this.map.panTo(coords);
        }
      });
  }

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
      this.heatmapLayer,
    ],
    zoom: this.zoom,
    center: latLng(initialView.lat, initialView.lng),
  };

  onMarkerClick(event: LeafletEvent): void {
    console.log(event);
    // this.markerClicked.next(event);
  }

  onLeafletClick(event: LeafletMouseEvent): void {
    this.markers = [this.getMarker(event.latlng.lat, event.latlng.lng)];
    this.layers = [...this.polygons, ...this.markers];
    const mapEvent: IMapClickEvent = {
      ...event.latlng,
    };

    const firearea: number | null = this.getFirePoint(event);
    if (firearea) {
      mapEvent.firearea = firearea;
    }
    this.pointService.setMapPoint(mapEvent);
    this.mapClicked.next(event.latlng);
  }

  onMapReady(map: L.Map): void {
    this.map = map;
    // map.on('mousemove', (event: L.LeafletMouseEvent) => {
    //   this.data.data.push({
    //     lat: event.latlng.lat,
    //     lng: event.latlng.lng,
    //     count: 1,
    //   });
    //   this.heatmapLayer.setData(this.data);
    // });
  }

  private getMarker(lat: number, lng: number): Marker<any> {
    return marker([lat, lng], {
      title: `${lat}, ${lng}`,
      icon: new Icon({
        iconUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png',
        iconSize: [25, 41],
        shadowSize: [41, 41],
        iconAnchor: [12, 41],
        shadowAnchor: [12, 41],
      }),
    }).on('click', (event) => {
      this.zone.run(() => this.onMarkerClick(event));
    });
  }

  private getHeatPolygon(item: IHeatItem): Polygon<any> {
    const points: LatLngExpression[] = item.polygonBurn.points.map((i) => {
      return [i.lat, i.lon];
    });
    const firearea: number = this.calculateFireArea(item.polygonBurn.points);
    return polygon(points, {
      color: 'red',
    });
  }

  private calculateFireArea(points: IPoint[]): number {
    const positions: number[][] = points.map((i) => {
      return [i.lat, i.lon];
    });
    const poly = turf.polygon([positions]);
    const firearea = turf.area(poly);
    return firearea;
  }

  getFirePoint(event: LeafletMouseEvent): number | null {
    if (!this.heats) {
      return null;
    }
    const point = turf.point([event.latlng.lat, event.latlng.lng]);
    for (const heat of this.heats) {
      const positions: number[][] = heat.polygonBurn.points.map((i) => {
        return [i.lat, i.lon];
      });
      const poly = turf.polygon([positions]);
      if (turf.inside(point, poly)) {
        return Math.round(this.calculateFireArea(heat.polygonBurn.points));
      }
    }
    return null;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
