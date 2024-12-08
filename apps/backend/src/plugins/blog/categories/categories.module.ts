import { Module } from '@nestjs/common';

import { CategoriesBlogController } from './categories.controller';
import { ShowCategoriesBlogService } from './service/show.service';

@Module({
  providers: [ShowCategoriesBlogService],
  controllers: [CategoriesBlogController],
})
export class CategoriesBlogModule {}
