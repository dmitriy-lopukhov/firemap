import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { IFeature } from 'src/app/types/feature.type';

@Component({
  selector: 'app-marker-details',
  templateUrl: './marker-details.component.html',
  styleUrls: ['./marker-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkerDetailsComponent implements OnInit {
  @Input() data: IFeature | null = null;

  constructor() {}

  ngOnInit(): void {}
}
