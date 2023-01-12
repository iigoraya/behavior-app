import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingMiddleware } from 'src/middlewares/logging.middleware';

import { BehaviorModule } from 'src/modules/behavior/behavior.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/behaviordb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    BehaviorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
