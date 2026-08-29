export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/** The one place that turns a caught error into copy shown to a user. */
export function toUserMessage(error: unknown): string {
  return error instanceof AppError ? error.message : 'Something went wrong. Please try again.';
}
