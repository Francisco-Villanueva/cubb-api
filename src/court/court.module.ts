import { Module } from '@nestjs/common';
import { CourtController } from './court.controller';
import { CourtService } from './court.service';
import { courtProvider } from './court.provider';

@Module({
  controllers: [CourtController],
  providers: [CourtService, ...courtProvider],
})
export class CourtModule {}
