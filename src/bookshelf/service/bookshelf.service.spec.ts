import { Test, TestingModule } from '@nestjs/testing';
import { BookshelfService } from './bookshelf.service';

describe('BookshelfService', () => {
  let service: BookshelfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookshelfService],
    }).compile();

    service = module.get<BookshelfService>(BookshelfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
