import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMapPoint } from '../types/map-point.type';

@Injectable({
  providedIn: 'root',
})
export class PointService {
  private state = new BehaviorSubject<IMapPoint | null>(null);
  public readonly state$ = this.state.asObservable();

  constructor() {}

  setMapPoint(mapPoint: IMapPoint): void {
    this.state.next(mapPoint);
  }
}
