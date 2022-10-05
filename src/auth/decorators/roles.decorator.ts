import { SetMetadata } from '@nestjs/common';
import { RolesModel } from '../models/roles.model';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RolesModel[]) => SetMetadata(ROLES_KEY, roles);
