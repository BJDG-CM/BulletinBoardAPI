import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 게시글 생성
  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  // 게시글 전체 조회 (userId로 필터링)
  async findAll(userId?: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' }, // 최신순으로 정렬
    });
  }

  // ID로 특정 게시글 조회
  async findById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  // 게시글 수정
  async update(id: number, data: Prisma.PostUpdateInput): Promise<Post> {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  // 게시글 삭제
  async delete(id: number): Promise<Post> {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}