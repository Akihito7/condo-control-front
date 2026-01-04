export interface CommandInterface<T> {
  execute(params? : T): Promise<void>;
}
