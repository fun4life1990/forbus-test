export class NotFoundError extends Error {
  public status: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'NotFoundError';
    this.status = status || 404;
  }
}
