import { ROLE } from 'src/features/user/user.model';

export interface JwtPayload {
  firstName: string;
  lastName: string;
  _id: string;
  email: string;
  role: ROLE;
}

export type IAuthUser = JwtPayload;

export type JwtPayloadWithToken = JwtPayload & { accessToken: string };
