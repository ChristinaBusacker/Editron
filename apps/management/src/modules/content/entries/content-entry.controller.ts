import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { CreateEntryDto } from '../dto/create-entry.dto';
import { ContentEntryService } from './content-entry.service';
import { UpdateEntryDto } from '../dto/update-entry.dto';
import { RestoreVersionDto } from '../dto/restore-version.dto';
import { ValidateEntryDto } from '../dto/validate-entry.dto';
import { AuthGuard } from '@management/modules/auth/auth.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { UserEntity } from '@database/user/user.entity';

@ApiTags('Content Entries')
@UseGuards(AuthGuard)
@ApiHeader({
  name: 'x-auth',
  description: 'Authentication token for the request',
  required: true,
})
@Controller('content')
export class ContentEntryController {
  constructor(private readonly contentEntryService: ContentEntryService) {}

  // -------------------------------
  // Entry listing and creation
  // -------------------------------

  @Get('projects/:projectId/schemas/:schemaSlug/entries')
  @ApiOperation({
    summary: 'Get all entries of a schema in a specific project',
  })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'schemaSlug', type: String })
  @ApiResponse({ status: 200, description: 'List of entries returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getEntries(
    @Param('projectId') projectId: string,
    @Param('schemaSlug') schemaSlug: string,
  ) {
    return this.contentEntryService.getEntriesForSchema(projectId, schemaSlug);
  }

  @Post('projects/:projectId/schemas/:schemaSlug/entries')
  @ApiOperation({
    summary: 'Create a new entry in a specific project and schema',
  })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'schemaSlug', type: String })
  @ApiResponse({ status: 201, description: 'Entry created successfully' })
  @ApiResponse({ status: 409, description: 'Entry with key already exists' })
  createEntry(
    @Param('projectId') projectId: string,
    @Param('schemaSlug') schemaSlug: string,
    @Body() dto: CreateEntryDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.contentEntryService.createEntry(
      projectId,
      schemaSlug,
      dto,
      user,
    );
  }

  // -------------------------------
  // Entry detail, update, delete
  // -------------------------------

  @Get('entries/:entryId')
  @ApiOperation({ summary: 'Get entry details with latest version and values' })
  @ApiParam({ name: 'entryId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Entry with latest version returned',
  })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  getEntryDetails(@Param('entryId') entryId: number) {
    return this.contentEntryService.getEntryWithLatestVersion(entryId);
  }

  @Put('entries/:entryId')
  @ApiOperation({ summary: 'Update an entry (creates a new version)' })
  @ApiParam({ name: 'entryId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Entry updated (new version created)',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  updateEntry(
    @Param('entryId') entryId: number,
    @Body() dto: UpdateEntryDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.contentEntryService.updateEntry(entryId, dto, user);
  }

  @Delete('entries/:entryId')
  @ApiOperation({
    summary: 'Delete an entry and all associated versions/values',
  })
  @ApiParam({ name: 'entryId', type: Number })
  @ApiResponse({ status: 200, description: 'Entry deleted' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  deleteEntry(@Param('entryId') entryId: number) {
    return this.contentEntryService.deleteEntry(entryId);
  }

  // -------------------------------
  // Version management
  // -------------------------------

  @Get('entries/:entryId/versions')
  @ApiOperation({ summary: 'List all versions of a content entry' })
  @ApiParam({ name: 'entryId', type: Number })
  @ApiResponse({ status: 200, description: 'List of versions returned' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  getVersions(@Param('entryId') entryId: number) {
    return this.contentEntryService.getVersions(entryId);
  }

  @Post('versions/:versionId/publish')
  @ApiOperation({ summary: 'Publish a specific version' })
  @ApiParam({ name: 'versionId', type: Number })
  @ApiResponse({ status: 200, description: 'Version published' })
  @ApiResponse({ status: 404, description: 'Version not found' })
  publishVersion(@Param('versionId') versionId: number) {
    return this.contentEntryService.publishVersion(versionId);
  }

  @Post('versions/:versionId/restore')
  @ApiOperation({ summary: 'Restore a specific version (creates new draft)' })
  @ApiParam({ name: 'versionId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Version restored (new draft created)',
  })
  @ApiResponse({ status: 404, description: 'Version not found' })
  restoreVersion(
    @Param('versionId') versionId: number,
    @Body() dto: RestoreVersionDto,
  ) {
    return this.contentEntryService.restoreVersion(versionId);
  }

  // -------------------------------
  // Validation
  // -------------------------------

  @Post('validate')
  @ApiOperation({ summary: 'Validate entry data against a schema definition' })
  @ApiResponse({ status: 200, description: 'Validation result returned' })
  validateEntry(@Body() dto: ValidateEntryDto) {
    return this.contentEntryService.validateEntry(dto);
  }
}
