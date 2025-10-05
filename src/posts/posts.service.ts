import { Injectable, NotFoundException } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './repositories/posts.repository';

@Injectable()
export class PostsService {
  // 메모리 저장소 제거

  constructor(private readonly postsRepository: PostsRepository) {}

  // 생성
  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsRepository.create({
      userId: createPostDto.userId,
      title: createPostDto.title,
      content: createPostDto.content,
    });
  }

  // 목록 조회
  async findAll(userId?: string): Promise<PostEntity[]> {
    return this.postsRepository.findAll(userId);
  }

  // 개별 조회
  async findOneById(id: number): Promise<PostEntity> {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }
    return post;
  }

  // 수정
  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    return this.postsRepository.update(id, {
      title: updatePostDto.title,
      content: updatePostDto.content,
    });
  }

  // 삭제
  async remove(id: number): Promise<void> {
    await this.postsRepository.delete(id);
  }
}