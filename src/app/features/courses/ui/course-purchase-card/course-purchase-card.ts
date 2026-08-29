import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CourseDetail } from '../../data-access/course-detail.model';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-course-purchase-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './course-purchase-card.html',
  styleUrl: './course-purchase-card.scss',
})
export class CoursePurchaseCard {
  readonly course = input.required<CourseDetail>();
  readonly favoriteToggled = output<void>();
}
