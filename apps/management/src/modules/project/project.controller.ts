import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiHeader({
  name: 'x-auth',
  description: 'Authentication token for the request',
  required: true,
})
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Projects' })
  @ApiResponse({ status: 201, description: 'List of Projects availible' })
  async getAll(@CurrentUser() user) {
    return this.projectService.getAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id' })
  @ApiResponse({ status: 201, description: 'The reqquested Project' })
  async getProject(@Param('id') id: string, @CurrentUser() user) {
    return this.projectService.getProjectForUserOrThrow(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created' })
  async create(@Body() dto: CreateProjectDto, @Request() req) {
    return this.projectService.create(dto, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing project' })
  @ApiResponse({
    status: 200,
    description: 'Project successfully updated',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing project' })
  @ApiResponse({ status: 204, description: 'Project successfully deleted' })
  async delete(@Param('id') id: string) {
    await this.projectService.delete(id);
    return { success: true };
  }
}
