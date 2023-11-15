import { Controller, Get } from '@nestjs/common';
import * as ip from 'ip';

@Controller('health')
export class HealthCheckController {
  @Get('/')
  healthCheck() {
    return `health check, ${ip.address()}`;
  }
}