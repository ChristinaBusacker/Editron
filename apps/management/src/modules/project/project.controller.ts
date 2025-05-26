import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectNameDto } from './dto/project.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

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

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created' })
  async create(@Body() dto: CreateProjectDto, @Request() req) {
    return this.projectService.create(dto.name, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the name of an existing project' })
  @ApiResponse({
    status: 200,
    description: 'Project name successfully updated',
  })
  async updateName(@Param('id') id: string, @Body() dto: UpdateProjectNameDto) {
    return this.projectService.updateName(id, dto.name);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing project' })
  @ApiResponse({ status: 204, description: 'Project successfully deleted' })
  async delete(@Param('id') id: string) {
    await this.projectService.delete(id);
    return { success: true };
  }
}
