import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<PostEntity> {
    return this.prisma.post.create({
      data: {
        userId,
        title: createPostDto.title,
        content: createPostDto.content,
      },
    });
  }

  async findAll(userId?: string): Promise<PostEntity[]> {
    return this.prisma.post.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneById(id: number): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Error!: 게시글 ID가 "${id}"인 게시글을 찾을 수 없습니다.`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: string): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Error!: 게시글 ID가 "${id}"인 게시글을 찾을 수 없습니다.`);
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Error!: 본인이 작성한 게시글만 수정할 수 있습니다.');
    }

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: number, userId: string): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Error!: 게시글 ID가 "${id}"인 게시글을 찾을 수 없습니다.`);
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Error!: 본인이 작성한 게시글만 삭제할 수 있습니다.');
    }

    await this.prisma.post.delete({
      where: { id },
    });
  }
}