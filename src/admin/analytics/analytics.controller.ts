import {
  Controller,
  Get,
} from '@nestjs/common';

import { AnalyticsService } from './analytics.service';

@Controller({
  path: 'admin/analytics',
  version: '1',
})
export class AnalyticsController {

  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get()
  getAnalytics() {
    return this.analyticsService.getAnalytics();
  }

}