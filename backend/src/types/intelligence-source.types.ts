
export interface IntelligenceSource<T> {
  name: string;

  collect(target: string): Promise<T>;
}
