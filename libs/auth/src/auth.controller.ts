import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Res,
  UnauthorizedException,
  HttpCode,
  HttpException,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionEntity } from '@database/session/session.entity';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { CurrentSession } from '@shared/decorators/current-session.decorator';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { UserEntity } from '@database/user/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login using email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Login successful. A session ID is returned.',
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  async login(@Body() loginDto: LoginDto): Promise<{ sessionId: string }> {
    const { email, password } = loginDto;

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const session: SessionEntity = await this.authService.createSession(user);
    return { sessionId: session.id };
  }

  // GitHub OAuth
  @Get('github')
  @UseGuards(PassportAuthGuard('github'))
  @ApiOperation({ summary: 'Redirect to GitHub for authentication' })
  async githubLogin(): Promise<void> {}

  @Get('github/callback')
  @UseGuards(PassportAuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  @ApiResponse({
    status: 200,
    description: 'Session ID returned after successful GitHub login.',
  })
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const session = await this.authService.createSession(req.user as any);
    return res.json({ sessionId: session.id });
  }

  // Google OAuth
  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  @ApiOperation({ summary: 'Redirect to Google for authentication' })
  async googleLogin(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(PassportAuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({
    status: 200,
    description: 'Session ID returned after successful Google login.',
  })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const session = await this.authService.createSession(req.user as any);
    return res.json({ sessionId: session.id });
  }

  // Microsoft OAuth
  @Get('microsoft')
  @UseGuards(PassportAuthGuard('microsoft'))
  @ApiOperation({ summary: 'Redirect to Microsoft for authentication' })
  async microsoftLogin(): Promise<void> {}

  @Get('microsoft/callback')
  @UseGuards(PassportAuthGuard('microsoft'))
  @ApiOperation({ summary: 'Microsoft OAuth callback' })
  @ApiResponse({
    status: 200,
    description: 'Session ID returned after successful Microsoft login.',
  })
  async microsoftCallback(@Req() req: Request, @Res() res: Response) {
    const session = await this.authService.createSession(req.user as any);
    return res.json({ sessionId: session.id });
  }

  @Get('validate/:sessionId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Validate a session ID' })
  @ApiParam({ name: 'sessionId', required: true, description: 'Session UUID' })
  @ApiResponse({ status: 200, description: 'Session is valid' })
  @ApiResponse({ status: 418, description: 'Session is invalid or expired' })
  async validateSessionById(
    @Param('sessionId') sessionId: string,
  ): Promise<void> {
    const session = await this.authService.getValidSession(sessionId);
    if (!session) {
      throw new HttpException('Session invalid', 418);
    }
  }

  @Get('user')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  @HttpCode(200)
  @ApiOperation({ summary: 'Loads current logged inUser' })
  @ApiResponse({ status: 200, description: 'Current user successfully loaded' })
  @ApiResponse({ status: 418, description: 'Session is invalid or expired' })
  async loadCurrentUser(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'Authentication token for the request',
    required: true,
  })
  @HttpCode(200)
  @ApiOperation({ summary: 'Ends current Session' })
  @ApiResponse({ status: 200, description: 'Session successfully deleted' })
  @ApiResponse({ status: 418, description: 'Session is invalid or expired' })
  async logout(@CurrentSession() session: SessionEntity) {
    return await this.authService.deleteSession(session.id);
  }
}
