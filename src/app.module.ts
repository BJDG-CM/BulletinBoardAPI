import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
<<<<<<< HEAD
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PostsModule, PrismaModule],
=======
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PostsModule, UsersModule, AuthModule],
>>>>>>> 1fffab0 (feat: First commit)
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
