/**
 * Domain Layer - Base Use Case
 * Abstract base class for all use cases
 */

export abstract class UseCase<TParams, TResult> {
  abstract execute(params: TParams): Promise<TResult>;
}
