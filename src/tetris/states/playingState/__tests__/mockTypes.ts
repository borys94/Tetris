import { vi } from 'vitest'

/* eslint-disable @typescript-eslint/no-explicit-any */
type HasMethod<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? true : never
}[keyof T] extends never
  ? false
  : true

type IsClassLikeObject<T> = T extends
  | Date
  | Array<any>
  | Map<any, any>
  | Set<any>
  | WeakMap<any, any>
  | WeakSet<any>
  | Promise<any>
  ? false
  : T extends object
    ? T extends Function // eslint-disable-line @typescript-eslint/no-unsafe-function-type
      ? false
      : HasMethod<T> extends true
        ? true
        : false
    : false

export type MockFromClass<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R
    ? IsClassLikeObject<R> extends true
      ? () => MockFromClass<R>
      : ReturnType<typeof vi.fn<T[K]>>
    : T[K]
}
