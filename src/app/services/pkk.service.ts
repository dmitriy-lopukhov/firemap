import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, iif, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  IFeature,
  ISearchFeature,
  ISearchFeatures,
} from '../types/feature.type';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PkkService {
  private state = new BehaviorSubject<IFeature | null>(null);
  public readonly state$ = this.state.asObservable();

  constructor(private http: HttpClient) {}

  getInformation(lat: number, lng: number, firearea?: number): void {
    this.getIdByCoordinates(lat, lng)
      .pipe(
        switchMap((feature) =>
          iif(
            () => !!(feature && feature.attrs && feature.attrs.id),
            this.getInformationById(
              (feature && feature.attrs && feature.attrs.id) ?? '0'
            ),
            of(null)
          )
        )
      )
      .subscribe((data: IFeature | null) => {
        if (data) {
          data.firearea = firearea;
        }
        console.log(data);
        this.setData(data);
      });
  }

  private getIdByCoordinates(
    lat: number,
    lng: number
  ): Observable<ISearchFeature | null> {
    // https://pkk.rosreestr.ru/api/features/1?_=1601059452296&text=54.286879+78.785594&limit=40&skip=0&inPoint=true
    // https://pkk2.rosreestronline.ru/api/ll/?l=5&ll=37.230219841003425,55.91191214234205
    return this.http
      .get<ISearchFeatures>(
        `https://pkk.rosreestr.ru/api/features/1?_=1601059452296&text=${lat},${lng}&limit=40&skip=0&inPoint=true`
      )
      .pipe(
        map((data) =>
          data.features && data.features.length ? data.features[0] : null
        )
      );
  }

  private getInformationById(id: string | undefined): Observable<IFeature> {
    return this.http.get<IFeature>(
      `https://pkk.rosreestr.ru/api/features/1/${id}`
    );
  }

  private setData(data: IFeature | null): void {
    this.state.next(data);
  }
}
