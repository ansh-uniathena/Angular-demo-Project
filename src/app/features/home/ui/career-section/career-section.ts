import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon, IconName } from '../../../../shared/ui/icon/icon';

interface CareerFeature {
  icon: IconName;
  text: string;
}

const FEATURES: CareerFeature[] = [
  { icon: 'user', text: 'Stay motivated with engaging instructors' },
  { icon: 'cloud', text: 'Keep up with in the latest in cloud' },
  { icon: 'grid', text: 'Build skills your way, from labs to courses' },
  { icon: 'crown', text: 'Get certified with 100+ certification courses' },
];

@Component({
  selector: 'app-career-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './career-section.html',
  styleUrl: './career-section.scss',
})
export class CareerSection {
  protected readonly features = FEATURES;
}
