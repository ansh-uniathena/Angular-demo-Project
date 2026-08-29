import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicFooter } from './footer/footer';
import { PublicHeader } from './header/header';

/** Shell for public pages — Home, Courses, Instructors (§4). */
@Component({
  selector: 'app-public-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, PublicHeader, PublicFooter],
  template: `
    <app-public-header />
    <main>
      <router-outlet />
    </main>
    <app-public-footer />
  `,
})
export class PublicLayout {}
