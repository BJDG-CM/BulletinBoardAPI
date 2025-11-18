import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    await this.ensureCategory(createPostDto.categoryId);

    const post = await this.prisma.post.create({
      data: {
        userId,
        categoryId: createPostDto.categoryId,
        title: createPostDto.title,
        content: createPostDto.content,
      },
      include: { category: true },
    });

    return this.toResponse(post);
  }

  async findAll(userId?: string, categoryId?: number) {
    const posts = await this.prisma.post.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    return posts.map((post) => this.toResponse(post));
  }

  async findOneById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { category: true },
    });

    return post ? this.toResponse(post) : null;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    if (updatePostDto.categoryId) {
      await this.ensureCategory(updatePostDto.categoryId);
    }

    const post = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: { category: true },
    });

    return this.toResponse(post);
  }

  async delete(id: number) {
    await this.prisma.post.delete({ where: { id } });
  }

  private async ensureCategory(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }
  }

  private toResponse(post: any) {
    const { category, ...rest } = post;
    return {
      ...rest,
      categoryName: category?.name,
    };
    }
}
