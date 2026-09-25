interface IPasswordService {
  validateAndHash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export type {IPasswordService};