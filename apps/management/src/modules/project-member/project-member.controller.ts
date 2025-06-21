import {
  Controller,
  Post,
  Param,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ProjectMemberService } from './project-member.service';
import { AuthGuard } from '@auth';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Project Members')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiHeader({
  name: 'x-auth',
  description: 'Authentication token for the request',
  required: true,
})
@Controller('projects/:projectId/members')
export class ProjectMemberController {
  constructor(private readonly memberService: ProjectMemberService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Add a user to a project' })
  async add(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.memberService.addUserToProject(projectId, userId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Remove a user from a project' })
  async remove(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    await this.memberService.removeUserFromProject(projectId, userId);
    return { success: true };
  }

  @Get()
  @ApiOperation({ summary: 'List all users in a project' })
  async list(@Param('projectId') projectId: string) {
    return this.memberService.getUsersForProject(projectId);
  }
}
