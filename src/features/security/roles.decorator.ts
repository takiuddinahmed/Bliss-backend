import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../common/enum/user-role.enum';

export const Roles = (...roles: ROLE[]) => SetMetadata('role', roles);
