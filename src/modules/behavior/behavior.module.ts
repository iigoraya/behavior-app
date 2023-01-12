import { Module } from '@nestjs/common';
import { BehaviorService } from './behavior.service';
import { BehaviorController } from './behavior.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Behavior, BehaviorSchema } from './entities/behavior.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Behavior.name, schema: BehaviorSchema },
    ]),
  ],
  controllers: [BehaviorController],
  providers: [BehaviorService],
})
export class BehaviorModule {}
