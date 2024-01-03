import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_AUTH_GUARD } from 'src/common/constants/guards.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_AUTH_GUARD) {}