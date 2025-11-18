import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ensureDefaultCategories(names: string[]) {
    await Promise.all(
      names.map((name) =>
        this.prisma.category.upsert({
          where: { name },
          update: {},
          create: { name },
        }),
      ),
    );
  }

  async create(name: string) {
    try {
      return await this.prisma.category.create({ data: { name } });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('이미 존재하는 카테고리입니다.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.category.findMany({ orderBy: { id: 'asc' } });
  }

  async delete(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }

    const postCount = await this.prisma.post.count({ where: { categoryId: id } });
    if (postCount > 0) {
      throw new ConflictException('게시글이 있는 카테고리는 삭제할 수 없습니다.');
    }

    await this.prisma.category.delete({ where: { id } });
  }

  async subscribe(userId: string, categoryId: number) {
    await this.ensureCategoryExists(categoryId);

    try {
      return await this.prisma.userCategory.create({
        data: {
          userId,
          categoryId,
        },
        include: { category: true },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('이미 구독 중인 카테고리입니다.');
      }
      throw error;
    }
  }

  async unsubscribe(userId: string, categoryId: number) {
    const existing = await this.prisma.userCategory.findUnique({
      where: { userId_categoryId: { userId, categoryId } },
    });

    if (!existing) {
      throw new NotFoundException('구독 정보를 찾을 수 없습니다.');
    }

    await this.prisma.userCategory.delete({ where: { userId_categoryId: { userId, categoryId } } });
  }

  async findSubscriptions(userId: string) {
    return this.prisma.userCategory.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async ensureCategoryExists(categoryId: number) {
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }
  }
}
