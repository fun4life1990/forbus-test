import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export function Serialize(dto: ClassConstructor<unknown>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor<unknown>) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Observable<unknown> {
    return handler.handle().pipe(
      map((data: unknown) => {
        return transform(this.dto, data);
      }),
    );
  }
}

export function transform(
  cls: ClassConstructor<unknown>,
  data: unknown,
): unknown {
  return plainToInstance(cls, data, {
    excludeExtraneousValues: true,
  });
}
