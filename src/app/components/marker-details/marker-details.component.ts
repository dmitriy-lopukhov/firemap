import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HeatService } from 'src/app/services/heat.service';
import { PointService } from 'src/app/services/point.service';
import { IFeature } from 'src/app/types/feature.type';
import { IHeatItem } from 'src/app/types/heat.type';
import { IMapPoint } from 'src/app/types/map-point.type';

@Component({
  selector: 'app-marker-details',
  templateUrl: './marker-details.component.html',
  styleUrls: ['./marker-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkerDetailsComponent implements OnInit {
  @Input() input: {
    data: IFeature | null;
    point: IMapPoint | null;
  } | null = null;
  heatPoint$: Observable<IHeatItem | null>;

  constructor(
    private pointService: PointService,
    private heatService: HeatService
  ) {
    this.heatPoint$ = combineLatest([
      this.pointService.state$,
      this.heatService.state$,
    ]).pipe(
      filter(([point, heats]) => !!(point && heats)),
      map(([point, heats]) => {
        if (point && point.pointId && heats.length) {
          const found = heats.find((i) => i.id === point.pointId);
          return found ?? null;
        }
        return null;
      })
    );
  }

  ngOnInit(): void {}
}
