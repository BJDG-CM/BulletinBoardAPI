import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PostEntity } from '../entities/post.entity';
import { Post } from '@prisma/client';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(model: Post): PostEntity {
    return { ...model } as PostEntity;
  }

  async create(data: Omit<PostEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PostEntity> {
    const created = await this.prisma.post.create({ data });
    return this.toEntity(created);
  }

  async findAll(userId?: string): Promise<PostEntity[]> {
    const rows = await this.prisma.post.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(r => this.toEntity(r));
  }

  async findById(id: number): Promise<PostEntity | null> {
    const row = await this.prisma.post.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  // 트랜잭션 적용
  async update(
    id: number,
    data: Partial<Omit<PostEntity, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<PostEntity> {
    const exists = await this.findById(id);
    if (!exists) {
      throw new NotFoundException(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }
    const [, latest] = await this.prisma.$transaction([
      this.prisma.post.update({ where: { id }, data }),
      this.prisma.post.findUnique({ where: { id } }),
    ]);
    return this.toEntity(latest!);
  }

  async delete(id: number): Promise<PostEntity> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }
    const deleted = await this.prisma.post.delete({ where: { id } });
    return this.toEntity(deleted);
  }
}