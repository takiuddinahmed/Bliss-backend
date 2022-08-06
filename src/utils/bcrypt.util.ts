import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export const hashPassword = (password: string) => {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  return hash;
};

export const comparePassword = (hash: string, password: string) => {
  return compareSync(password, hash);
};
