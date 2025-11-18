import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';

const DEFAULT_CATEGORIES = ['announcement', 'qna', 'misc'];

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async onModuleInit() {
    await this.categoriesRepository.ensureDefaultCategories(DEFAULT_CATEGORIES);
  }

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoriesRepository.create(createCategoryDto.name);
  }

  findAll() {
    return this.categoriesRepository.findAll();
  }

  remove(id: number) {
    return this.categoriesRepository.delete(id);
  }

  subscribe(userId: string, categoryId: number) {
    return this.categoriesRepository.subscribe(userId, categoryId);
  }

  unsubscribe(userId: string, categoryId: number) {
    return this.categoriesRepository.unsubscribe(userId, categoryId);
  }

  findSubscriptions(userId: string) {
    return this.categoriesRepository.findSubscriptions(userId);
  }
}