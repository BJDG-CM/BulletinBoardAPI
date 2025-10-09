import { Body, Controller, Post, Get, Param, Query, Patch, Delete, HttpCode, HttpStatus, UseGuards, Request, ParseIntPipe } from '@nestjs/common';  
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiParam, ApiQuery, ApiNoContentResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 생성' })
  @ApiCreatedResponse({ description: '게시글 생성 성공!', type: PostEntity })
  async create(@Body() createPostDto: CreatePostDto, @Request() req): Promise<PostEntity> {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiQuery({ type: FindPostsQueryDto })
  @ApiOkResponse({ description: '목록 조회 성공!', type: [PostEntity] })
  async findAll(@Query() query: FindPostsQueryDto): Promise<PostEntity[]> {
    return this.postsService.findAll(query.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 게시글 상세 조회' })
  @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
  @ApiOkResponse({ description: '상세 조회 성공!', type: PostEntity })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 게시글 수정' })
  @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
  @ApiOkResponse({ description: '게시글 수정 성공!', type: PostEntity })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 게시글 삭제' })
  @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
  @ApiNoContentResponse({ description: '게시글 삭제 성공!' })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    return this.postsService.remove(id, req.user.userId);
  }
}