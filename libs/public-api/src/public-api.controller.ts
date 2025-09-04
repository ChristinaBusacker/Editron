import { Controller, Get } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { API_KEY_HEADER } from '@shared/constants/api-key.constant';
import { ApiReadPermissionGuard } from './guards/api-read.guard';
import { ApiReadAccess } from '@shared/decorators/permission.decorator';

@Controller('public')
@ApiHeader({
  name: API_KEY_HEADER,
  description: 'Authentication token for the request',
  required: true,
})
export class PublicApiController {
  @Get()
  @ApiReadAccess()
  test() {
    return 'hi';
  }
}
