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
import { CurrentUser } from '@management/core/decorators/current-user.decorator';
import { UserEntity } from '@database/user/user.entity';
import { AuthGuard } from '@management/modules/auth/auth.guard';

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

  @Get('projects/:projectId/bin')
  @ApiOperation({
    summary: 'Get all entries of a specific project in the bin',
  })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'schemaSlug', type: String })
  @ApiResponse({ status: 200, description: 'List of entries returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getEntriesInBin(
    @Param('projectId') projectId: string,
    @Param('schemaSlug') schemaSlug: string,
  ) {
    return this.contentEntryService.getEntriesInBIn(projectId);
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
  @ApiParam({ name: 'entryId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Entry with latest version returned',
  })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  getEntryWithLatestVersion(@Param('entryId') entryId: string) {
    return this.contentEntryService.getEntryWithLatestVersion(entryId);
  }

  @Get('entries/:entryId/details')
  @ApiOperation({ summary: 'Get entry details with latest version and values' })
  @ApiParam({ name: 'entryId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Entry with latest version returned',
  })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  getEntryDetails(@Param('entryId') entryId: string) {
    return this.contentEntryService.getEntryDetails(entryId);
  }

  @Put('entries/:entryId')
  @ApiOperation({ summary: 'Update an entry (creates a new version)' })
  @ApiParam({ name: 'entryId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Entry updated (new version created)',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  updateEntry(
    @Param('entryId') entryId: string,
    @Body() dto: UpdateEntryDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.contentEntryService.updateEntry(entryId, dto, user);
  }

  @Get('entries/:entryId/bin')
  @ApiOperation({ summary: 'Moves entry into bin' })
  @ApiParam({ name: 'entryId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Entry moved into bin',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  softDeleteEntry(@Param('entryId') entryId: string) {
    return this.contentEntryService.softDeleteEntry(entryId);
  }

  @Get('entries/:entryId/revoke')
  @ApiOperation({ summary: 'Moves entry out of bin' })
  @ApiParam({ name: 'entryId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Entry moved out of bin',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  revokeEntry(@Param('entryId') entryId: string) {
    return this.contentEntryService.revokeFromBin(entryId);
  }

  @Post('entries/:entryId/duplicate')
  @ApiOperation({ summary: 'Update an entry (creates a new version)' })
  @ApiParam({ name: 'entryId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Entry updated (new version created)',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  duplicate(
    @Param('entryId') entryId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.contentEntryService.duplicateEntry(entryId, user);
  }

  @Delete('entries/:entryId')
  @ApiOperation({
    summary: 'Delete an entry and all associated versions/values',
  })
  @ApiParam({ name: 'entryId', type: String })
  @ApiResponse({ status: 200, description: 'Entry deleted' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  deleteEntry(@Param('entryId') entryId: string) {
    return this.contentEntryService.deleteEntry(entryId);
  }

  // -------------------------------
  // Version management
  // -------------------------------

  @Get('entries/:entryId/versions')
  @ApiOperation({ summary: 'List all versions of a content entry' })
  @ApiParam({ name: 'entryId', type: String })
  @ApiResponse({ status: 200, description: 'List of versions returned' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  getVersions(@Param('entryId') entryId: string) {
    return this.contentEntryService.getVersions(entryId);
  }

  @Post('versions/:versionId/publish')
  @ApiOperation({ summary: 'Publish a specific version' })
  @ApiParam({ name: 'versionId', type: String })
  @ApiResponse({ status: 200, description: 'Version published' })
  @ApiResponse({ status: 404, description: 'Version not found' })
  publishVersion(@Param('versionId') versionId: string) {
    return this.contentEntryService.publishVersion(versionId);
  }

  @Post('versions/:versionId/restore')
  @ApiOperation({ summary: 'Restore a specific version (creates new draft)' })
  @ApiParam({ name: 'versionId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Version restored (new draft created)',
  })
  @ApiResponse({ status: 404, description: 'Version not found' })
  restoreVersion(
    @Param('versionId') versionId: string,
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
