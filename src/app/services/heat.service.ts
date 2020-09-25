import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IHeatItem, IHeatPoint } from '../types/heat.type';

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

  getHeatPoints(): void {
    this.http
      .get<IHeatItem[]>('https://lzamaraev.herokuapp.com/')
      .subscribe((data) => this.state.next(data));
  }
}
