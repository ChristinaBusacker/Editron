import { UserEntity } from '@database/user/user.entity';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { ApiTokenService } from './api-token.service';
import { CreateApiTokenDto } from './dto/api-token.dto';

@ApiTags('API Token')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-auth',
  description: 'Authentication token for the request',
  required: true,
})
@Controller('api-token')
export class ApiTokenController {
  constructor(private readonly apiTokenService: ApiTokenService) {}

  @Get('list/:projectId')
  @ApiOperation({
    summary: 'List all Api Tokens',
  })
  @ApiParam({ name: 'projectId', type: String })
  list(@Param('projectId') projectId: string, @CurrentUser() user: UserEntity) {
    return this.apiTokenService.list(projectId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a api token by id',
  })
  @ApiParam({ name: 'projectId', type: String })
  get(@Param('id') tokenId: string) {
    return this.apiTokenService.get(tokenId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new Api Token',
  })
  @ApiResponse({ status: 201, description: 'Entry created successfully' })
  createEntry(@Body() dto: CreateApiTokenDto, @CurrentUser() user: UserEntity) {
    return this.apiTokenService.create(dto, user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a Api Token',
  })
  @ApiResponse({ status: 201, description: 'Entry deleted successfully' })
  delete(@Param('id') tokenId: string) {
    return this.apiTokenService.delete(tokenId);
  }
}
