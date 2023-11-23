import { Hash } from "../interface/hash";
import * as bcrypt from 'bcryptjs';

export class BcryptHash implements Hash {
  public async generate(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const result = await bcrypt.hash(data, salt);

    return result;
  }

  public async compare(data: string, encrypted: string | null): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}