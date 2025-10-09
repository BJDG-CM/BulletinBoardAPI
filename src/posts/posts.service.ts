import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostsRepository } from './repositories/posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<PostResponseDto> {
    return this.postsRepository.create(createPostDto, userId);
  }

  async findAll(userId?: string): Promise<PostResponseDto[]> {
    return this.postsRepository.findAll(userId);
  }

  async findOneById(id: number): Promise<PostResponseDto> {
    const post = await this.postsRepository.findOneById(id);

    if (!post) {
      throw new NotFoundException(`Error!: 게시글 ID가 "${id}"인 게시글을 찾을 수 없습니다.`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: string): Promise<PostResponseDto> {
    const post = await this.postsRepository.findOneById(id);

    if (!post) {
      throw new NotFoundException(`Error!: 게시글 ID가 "${id}"인 게시글을 찾을 수 없습니다.`);
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Error!: 본인이 작성한 게시글만 수정할 수 있습니다.');
    }

    return this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: number, userId: string): Promise<void> {
    const post = await this.postsRepository.findOneById(id);

    if (!post) {
      throw new NotFoundException(`Error!: 게시글 ID가 "${id}"인 게시글을 찾을 수 없습니다.`);
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Error!: 본인이 작성한 게시글만 삭제할 수 있습니다.');
    }

    await this.postsRepository.delete(id);
  }
}