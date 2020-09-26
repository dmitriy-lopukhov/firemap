import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LeafletMouseEvent } from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IHeatItem, IHeatPoint, IPoint } from '../types/heat.type';
import * as turf from '@turf/turf';

@Injectable({
  providedIn: 'root',
})
export class HeatService {
  private state = new BehaviorSubject<IHeatItem[]>([]);
  public readonly state$ = this.state.asObservable();
  public readonly points$ = this.state$.pipe(
    map((data) =>
      data.map((i) => {
        const point: IHeatPoint = {
          lat: i.point.lat,
          lng: i.point.lon,
          count: 1,
        };
        return point;
      })
    )
  );

  constructor(private http: HttpClient) {}

  public getHeatPoints(): void {
    this.http
      .get<IHeatItem[]>('https://lzamaraev.herokuapp.com/')
      .subscribe((data) => this.state.next(data));
  }

  private calculateFireArea(points: IPoint[]): number {
    const positions: number[][] = points.map((i) => {
      return [i.lat, i.lon];
    });
    const poly = turf.polygon([positions]);
    const firearea = turf.area(poly);
    return firearea;
  }

  public getFirePoint(
    latlng: { lat: number; lng: number },
    heats: IHeatItem[] | null
  ): {
    firearea: number;
    pointId: number;
  } | null {
    if (!heats) {
      return null;
    }
    const point = turf.point([latlng.lat, latlng.lng]);
    for (const heat of heats) {
      const positions: number[][] = heat.polygonBurn.points.map((i) => {
        return [i.lat, i.lon];
      });
      const poly = turf.polygon([positions]);
      if (turf.inside(point, poly)) {
        return {
          firearea: Math.round(this.calculateFireArea(heat.polygonBurn.points)),
          pointId: heat.id,
        };
      }
    }
    return null;
  }
}
