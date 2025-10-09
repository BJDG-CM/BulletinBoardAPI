import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    return this.prisma.post.create({
      data: {
        userId,
        title: createPostDto.title,
        content: createPostDto.content,
      },
    });
  }

  async findAll(userId?: string) {
    return this.prisma.post.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneById(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async delete(id: number) {
    await this.prisma.post.delete({ where: { id } });
  }
}
