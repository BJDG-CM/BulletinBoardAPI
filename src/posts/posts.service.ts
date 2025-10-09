<<<<<<< HEAD
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
=======
mport { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
>>>>>>> 1fffab0 (feat: First commit)
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

<<<<<<< HEAD
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
=======
  private nextPostId = 4;

  create(createPostDto: CreatePostDto, userId: string): PostEntity {
    const newPost: PostEntity = {
      id: this.nextPostId++,
      userId: userId, // 인증된 사용자 ID
      title: createPostDto.title,
      content: createPostDto.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.posts.push(newPost);
    return newPost;
  }

  findAll(userId?: string): PostEntity[] {
    if(userId){
      return this.posts.filter((post) => post.userId === userId);
>>>>>>> 1fffab0 (feat: First commit)
    }
    return this.posts;
  }

<<<<<<< HEAD
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
=======
  findOneById(id: number): PostEntity {
    const post = this.posts.find((post) => post.id === id);

    if(!post){
      throw new NotFoundException(`Error!: 게시글 ID가 "${id}"인 게시글을 찾을 수 없습니다.`);
    }

    return post;
  }
  
  update(id: number, updatePostDto: UpdatePostDto, userId: string): PostEntity {
    const postIndex = this.posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      throw new NotFoundException(`Error!: 게시글 ID가 "${id}"인 게시글을 찾을 수 없습니다.`);
    }

    // 작성자 본인 확인
    if (this.posts[postIndex].userId !== userId) {
      throw new ForbiddenException('Error!: 본인이 작성한 게시글만 수정할 수 있습니다.');
    }

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...updatePostDto,
      updatedAt: new Date()
    };

    return this.posts[postIndex];
  }

  remove(id: number, userId: string): void {
    const postIndex = this.posts.findIndex((p) => p.id === id);
    
    if (postIndex === -1){
      throw new NotFoundException(`Error!: 게시글 ID가 "${id}"인 게시글을 찾을 수 없습니다.`);
    }

    // 작성자 본인 확인
    if (this.posts[postIndex].userId !== userId) {
      throw new ForbiddenException('Error!: 본인이 작성한 게시글만 삭제할 수 있습니다.');
    }

    this.posts.splice(postIndex, 1);
>>>>>>> 1fffab0 (feat: First commit)
  }
}