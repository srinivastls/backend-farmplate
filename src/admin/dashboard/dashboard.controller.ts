import {
  Controller,
  Get,
} from '@nestjs/common';

import { DashboardService } from './dashboard.service';

@Controller({
  path: 'admin/dashboard',
  version: '1',
})
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  getDashboard() {
    return this.dashboardService.getDashboard();
  }
}