import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PostEntity } from '../entities/post.entity';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 게시글 생성
  async create(data: Omit<PostEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PostEntity> {
    return this.prisma.post.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }) as PostEntity;
  }

  // 게시글 전체 조회 (userId로 필터링)
  async findAll(userId?: string): Promise<PostEntity[]> {
    const whereCondition: any = userId ? { userId } : {};
    
    return this.prisma.post.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    }) as PostEntity[];
  }

  // ID로 특정 게시글 조회
  async findById(id: number): Promise<PostEntity | null> {
    return this.prisma.post.findUnique({
      where: { id },
    }) as PostEntity | null;
  }

  // 게시글 수정
  async update(id: number, data: Partial<Omit<PostEntity, 'id' | 'createdAt'>>): Promise<PostEntity> {
    const existingPost = await this.findById(id);
    if (!existingPost) {
      throw new Error(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    }) as PostEntity;
  }

  // 게시글 삭제
  async delete(id: number): Promise<PostEntity> {
    const existingPost = await this.findById(id);
    if (!existingPost) {
      throw new Error(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }

    return this.prisma.post.delete({
      where: { id },
    }) as PostEntity;
  }
}