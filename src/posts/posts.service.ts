import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(model: any): PostEntity {
    return { ...model } as PostEntity;
  }

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const created = await this.prisma.post.create({
      data: {
        userId: createPostDto.userId,
        title: createPostDto.title,
        content: createPostDto.content,
      },
    });
    return this.toEntity(created);
  }

  async findAll(userId?: string): Promise<PostEntity[]> {
    const rows = await this.prisma.post.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(r => this.toEntity(r));
  }

  async findOneById(id: number): Promise<PostEntity> {
    try {
      const post = await this.prisma.post.findUniqueOrThrow({ where: { id } });
      return this.toEntity(post);
    } catch {
      throw new NotFoundException(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    try {
      const updated = await this.prisma.post.update({
        where: { id },
        data: {
          title: updatePostDto.title,
          content: updatePostDto.content,
        },
      });
      return this.toEntity(updated);
    } catch {
      throw new NotFoundException(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.post.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }
  }
}