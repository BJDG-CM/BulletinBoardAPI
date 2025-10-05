import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PostEntity } from '../entities/post.entity';
import { Post } from '@prisma/client';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Prisma 모델 -> 도메인 엔티티 변환
  private toEntity(model: Post): PostEntity {
    
    return { ...model } as PostEntity;
  }

  // 게시글 생성
  async create(data: Omit<PostEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PostEntity> {
    const created = await this.prisma.post.create({
      data, // createdAt / updatedAt 은 Prisma가 처리
    });
    return this.toEntity(created);
  }

  // 게시글 전체 조회 (userId로 필터링)
  async findAll(userId?: string): Promise<PostEntity[]> {
    const rows = await this.prisma.post.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(r => this.toEntity(r));
  }

  // ID로 특정 게시글 조회
  async findById(id: number): Promise<PostEntity | null> {
    const row = await this.prisma.post.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  // 게시글 수정
 async update(
    id: number,
    data: Partial<Omit<PostEntity, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<PostEntity> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }
    const updated = await this.prisma.post.update({
      where: { id },
      data,
    });
    return this.toEntity(updated);
  }

  // 게시글 삭제
  async delete(id: number): Promise<PostEntity> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }
    const deleted = await this.prisma.post.delete({ where: { id } });
    return this.toEntity(deleted);
  }
}
