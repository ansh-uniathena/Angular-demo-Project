import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BlogPost } from '../../data-access/home.model';

@Component({
  selector: 'app-blog-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-section.html',
  styleUrl: './blog-section.scss',
})
export class BlogSection {
  readonly posts = input.required<BlogPost[]>();
}
