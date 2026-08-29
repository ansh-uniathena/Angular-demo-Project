import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'mail'
  | 'user'
  | 'eye'
  | 'eye-off'
  | 'chevron-right'
  | 'chevron-down'
  | 'clock'
  | 'check'
  | 'heart'
  | 'cart'
  | 'book'
  | 'badge-check'
  | 'search'
  | 'arrow-right'
  | 'quote'
  | 'star'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'twitter-x'
  | 'apple'
  | 'play-store'
  | 'cloud'
  | 'grid'
  | 'crown'
  | 'filter'
  | 'list'
  | 'sun'
  | 'lock'
  | 'location'
  | 'phone'
  | 'play'
  | 'share'
  | 'users'
  | 'bar-chart'
  | 'download'
  | 'devices'
  | 'infinity'
  | 'clipboard-check'
  | 'settings'
  | 'logout'
  | 'message'
  | 'ticket'
  | 'graduation-cap'
  | 'pencil'
  | 'gift'
  | 'menu'
  | 'close';

const STROKE_PATHS: Partial<Record<IconName, string>> = {
  mail: 'M3 5h18v14H3zM3 5l9 7 9-7',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  eye: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'eye-off':
    'M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M6.9 6.9C4.2 8.5 2 12 2 12s4 7 11 7c1.6 0 3-.3 4.2-.8M9.9 4.2C10.6 4.1 11.3 4 12 4c7 0 11 7 11 7-.4.7-1 1.6-1.9 2.5',
  'chevron-right': 'M9 6l6 6-6 6',
  'chevron-down': 'M6 9l6 6 6-6',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
  check: 'M4 12l5 5L20 6',
  heart:
    'M12 21s-7.5-4.6-10-9.3C.5 8.4 2.2 5 5.6 5c1.9 0 3.4 1 4.4 2.5C11 6 12.5 5 14.4 5c3.4 0 5.1 3.4 3.6 6.7C19.5 16.4 12 21 12 21Z',
  cart: 'M3 4h2l2.4 12.2a2 2 0 0 0 2 1.8h7.6a2 2 0 0 0 2-1.6L21 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  book: 'M4 4h8a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H4V4ZM20 4h-4a4 4 0 0 0-4 4',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  'arrow-right': 'M4 12h16M13 5l7 7-7 7',
  star: 'M12 2l3.1 6.6 7.2.9-5.3 5 1.4 7.2-6.4-3.6-6.4 3.6 1.4-7.2-5.3-5 7.2-.9L12 2Z',
  cloud: 'M6.5 18a4.5 4.5 0 0 1-.5-9 5.5 5.5 0 0 1 10.6-2 4.5 4.5 0 0 1-.6 11h-9.5Z',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  crown: 'M4 18h16l1-9-5 3-4-6-4 6-5-3 1 9Z',
  filter: 'M4 5h16M7 12h10M10 19h4',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  sun: 'M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  lock: 'M6 11V8a6 6 0 1 1 12 0v3M5 11h14v9H5z',
  location: 'M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12ZM12 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  phone:
    'M6.6 10.8c1.4 2.7 3.5 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.5-1 1-1h3.5c.5 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1.1L6.6 10.8Z',
  play: 'M7 4.5v15l13-7.5-13-7.5Z',
  share:
    'M18 8a3 3 0 1 0-2.8-4.1L8.9 7.6a3 3 0 1 0 0 5.8l6.3 3.7a3 3 0 1 0 1-1.7L9.9 11.7a3 3 0 0 0 0-2.4l6.3-3.7c.5.4 1.1.4 1.8.4Z',
  users:
    'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a7 7 0 0 1 14 0M17 8a4 4 0 0 1 0 7.75M22 21a6.5 6.5 0 0 0-4.5-6.2',
  'bar-chart': 'M5 21V10M12 21V3M19 21v-7',
  download: 'M12 3v12m0 0 4-4m-4 4-4-4M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3',
  devices:
    'M4 4h12v9H4zM8 20h4M9 13v4M16 9h4v8h-4zM18 15h.01',
  infinity:
    'M7 9a3 3 0 1 0 0 6c1.5 0 2.6-1 5-4 2.4-3 3.5-4 5-4a3 3 0 1 1 0 6c-1.5 0-2.6-1-5-4C9.6 6 8.5 5 7 5a3 3 0 0 0-3 4',
  'clipboard-check': 'M9 4h6v3H9zM6 6h12v15H6zM9.5 14l2 2 4-4',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.6 1Z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  message: 'M4 4h16v12H8l-4 4V4Z',
  ticket:
    'M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4V9ZM10 6v12',
  'graduation-cap':
    'M22 10 12 5 2 10l10 5 10-5ZM6 12.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 10v6',
  pencil: 'M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3ZM13.5 7l3 3',
  gift: 'M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7C10 3 6 3 6 6c0 1.5 3 1 6 1ZM12 7c2-4 6-4 6-1 0 1.5-3 1-6 1Z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M6 18L18 6',
};

const FILLED_PATHS: Partial<Record<IconName, string>> = {
  heart:
    'M12 21s-7.5-4.6-10-9.3C.5 8.4 2.2 5 5.6 5c1.9 0 3.4 1 4.4 2.5C11 6 12.5 5 14.4 5c3.4 0 5.1 3.4 3.6 6.7C19.5 16.4 12 21 12 21Z',
  star: 'M12 2l3.1 6.6 7.2.9-5.3 5 1.4 7.2-6.4-3.6-6.4 3.6 1.4-7.2-5.3-5 7.2-.9L12 2Z',
  'badge-check':
    'M12 2l2.4 1.2 2.6-.4 1.2 2.4 2.4 1.2-.4 2.6 1.2 2.4-1.2 2.4.4 2.6-2.4 1.2-1.2 2.4-2.6-.4L12 22l-2.4-1.2-2.6.4-1.2-2.4-2.4-1.2.4-2.6L2.6 12l1.2-2.4-.4-2.6 2.4-1.2 1.2-2.4 2.6.4L12 2Zm-1 12.4 5-5-1.4-1.4-3.6 3.6-1.6-1.6L8 11.4l3 3Z',
  quote:
    'M4 11c0-3.9 2.4-6.7 6-7.7L11 5c-2.4.8-3.6 2.3-3.8 4H10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3Zm10 0c0-3.9 2.4-6.7 6-7.7L21 5c-2.4.8-3.6 2.3-3.8 4H20a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-3Z',
  facebook: 'M14 8h-2a1 1 0 0 0-1 1v2h3l-.5 3H11v7H8v-7H6v-3h2V9a4 4 0 0 1 4-4h2v3Z',
  instagram:
    'M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm5 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm4.5-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
  linkedin:
    'M4 4h4v4H4V4Zm0 6h4v10H4V10Zm7 0h4v1.5c.6-1 1.8-1.8 3.5-1.8 3 0 4.5 2 4.5 5.5V20h-4v-5.5c0-1.5-.5-2.5-2-2.5-1.3 0-2 1-2 2.5V20h-4V10Z',
  'twitter-x': 'M4 4l7.5 8.5L4.5 20H7l5.5-6.2L17 20h3l-8-9 7-7h-2.5l-5 5.6L7 4H4Z',
  apple:
    'M16.4 2c.1 1.2-.4 2.4-1.1 3.3-.8.9-2 1.6-3.2 1.5-.1-1.1.5-2.3 1.2-3.1C14.1 2.7 15.3 2.1 16.4 2ZM20 17.3c-.5 1.2-.8 1.7-1.5 2.7-1 1.4-2.3 3.2-4 3.2-1.5 0-1.9-1-3.9-1-2 0-2.5 1-4 1-1.7 0-3-1.6-4-3-2.7-3.9-3-8.5-1.3-11 .8-1.3 2.4-2.2 4-2.2 1.6 0 2.7 1 4 1 1.3 0 2.1-1 4-1 1.4 0 2.9.8 3.9 2.1-3.4 1.9-2.9 6.4.8 8.2Z',
  'play-store': 'M6 3v18l14-9L6 3Z',
  play: 'M7 4.5v15l13-7.5-13-7.5Z',
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (renderFilled()) {
      <svg
        [attr.width]="size()"
        [attr.height]="size()"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path [attr.d]="filledPath()" />
      </svg>
    } @else {
      <svg
        [attr.width]="size()"
        [attr.height]="size()"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path [attr.d]="strokePath()" />
      </svg>
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(18);
  readonly filled = input(false);

  // Some icons (badge-check, quote, the social marks) only have a filled
  // path drawn — there's no meaningful open-stroke version of a compound
  // shape like a checkmark-in-a-badge. Force filled rendering for those
  // regardless of the `filled` input, so a caller that forgets
  // `[filled]="true"` gets the icon, not a blank/broken outline.
  protected readonly renderFilled = () => this.filled() || !STROKE_PATHS[this.name()];
  protected readonly strokePath = () => STROKE_PATHS[this.name()] ?? '';
  protected readonly filledPath = () => FILLED_PATHS[this.name()] ?? STROKE_PATHS[this.name()] ?? '';
}
