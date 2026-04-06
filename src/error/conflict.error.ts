export class ConflictError extends Error {
  public status: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ConflictError';
    this.status = status || 409;
  }
}
