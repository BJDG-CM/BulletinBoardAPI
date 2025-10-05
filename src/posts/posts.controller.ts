import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, ParseIntPipe
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';

@ApiTags('Posts') // Swagger에서 API들을 "Posts"라는 태그로 묶어줌
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: '새로운 게시글 생성' })
  @ApiResponse({ status: 201, description: '게시글 생성 성공!', type: PostEntity })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiQuery({ type: FindPostsQueryDto }) // Query DTO를 문서에 명시
  @ApiResponse({ status: 200, description: '목록 조회 성공!', type: [PostEntity] })
  findAll(@Query() query: FindPostsQueryDto): Promise<PostEntity[]> {
    return this.postsService.findAll(query.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 게시글 상세 조회' })
  @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
  @ApiResponse({ status: 200, description: '상세 조회 성공!', type: PostEntity })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없음' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '특정 게시글 수정' })
  @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
  @ApiResponse({ status: 200, description: '게시글 수정 성공!', type: PostEntity })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없음' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 성공 시 204 No Content 응답
  @ApiOperation({ summary: '특정 게시글 삭제' })
  @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
  @ApiResponse({ status: 204, description: '게시글 삭제 성공!' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없음' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.postsService.remove(id);
  }
}