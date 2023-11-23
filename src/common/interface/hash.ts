export interface Hash {
  generate(data: string): Promise<string>;
  compare(data: string, encrypted: string | null): Promise<boolean>;
}