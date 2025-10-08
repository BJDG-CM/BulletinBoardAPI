import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, ParseIntPipe
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiParam, ApiQuery, ApiBadRequestResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: '새로운 게시글 생성' })
  @ApiCreatedResponse({ description: '게시글 생성 성공!', type: PostEntity })
  @ApiBadRequestResponse({ description: '잘못된 요청' })
  create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiQuery({ type: FindPostsQueryDto })
  @ApiOkResponse({ description: '목록 조회 성공!', type: [PostEntity] })
  findAll(@Query() query: FindPostsQueryDto): Promise<PostEntity[]> {
    return this.postsService.findAll(query.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 게시글 상세 조회' })
  @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
  @ApiOkResponse({ description: '상세 조회 성공!', type: PostEntity })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '특정 게시글 수정' })
  @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
  @ApiOkResponse({ description: '게시글 수정 성공!', type: PostEntity })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '특정 게시글 삭제' })
  @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
  @ApiNoContentResponse({ description: '게시글 삭제 성공!' })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.postsService.remove(id);
  }
}