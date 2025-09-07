import { Test, TestingModule } from '@nestjs/testing';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

describe('AssetController', () => {
  let assetController: AssetController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [AssetService],
    }).compile();

    assetController = app.get<AssetController>(AssetController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(assetController.getHello()).toBe('Hello World!');
    });
  });
});
