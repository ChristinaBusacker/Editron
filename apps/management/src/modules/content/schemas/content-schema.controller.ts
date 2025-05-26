import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { ContentSchemaService } from './content-schema.service';
import { AuthGuard } from '@management/modules/auth/auth.guard';

@ApiTags('Content Schemas')
@UseGuards(AuthGuard)
@ApiHeader({
  name: 'x-auth',
  description: 'Authentication token for the request',
  required: true,
})
@Controller('content/schemas')
export class ContentSchemaController {
  constructor(private readonly contentSchemaService: ContentSchemaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all content schema definitions' })
  @ApiResponse({
    status: 200,
    description: 'Array of available content schemas returned',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAllSchemas() {
    return this.contentSchemaService.getAllSchemas();
  }

  @Get(':schemaSlug')
  @ApiOperation({ summary: 'Get a specific content schema by slug' })
  @ApiParam({ name: 'schemaSlug', type: String })
  @ApiResponse({
    status: 200,
    description: 'Schema definition returned',
  })
  @ApiResponse({ status: 404, description: 'Schema not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getSchemaBySlug(@Param('schemaSlug') slug: string) {
    return this.contentSchemaService.getSchemaBySlug(slug);
  }
}
