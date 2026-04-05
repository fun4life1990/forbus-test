export class ForbiddenError extends Error {
  public status: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ForbiddenError';
    this.status = status || 403;
  }
}
