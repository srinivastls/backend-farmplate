import { Controller, Get, Version } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller({
  path: 'home',
  version: '1',
})
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
  ) {}

  @Get()
  getHome() {
    return this.homeService.getHomeData();
  }
}
