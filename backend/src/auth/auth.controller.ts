// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Headers,
  HttpCode,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  /**
   * POST /api/v1/auth/register
   * Đăng ký tài khoản mới
   */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    this.logger.log(`📝 Register attempt: ${dto.email}`);
    return this.authService.register(dto);
  }

  /**
   * POST /api/v1/auth/login
   * Đăng nhập
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    this.logger.log(`🔐 Login attempt: ${dto.email}`);
    return this.authService.login(dto);
  }

  /**
   * GET /api/v1/auth/profile
   * Lấy thông tin profile từ JWT token
   * Header: Authorization: Bearer <token>
   */
  @Get('profile')
  async getProfile(@Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader);
    const user = await this.authService.verifyToken(token);
    return this.authService.getProfile(user.id);
  }

  /**
   * PATCH /api/v1/auth/profile
   * Cập nhật thông tin profile
   */
  @Patch('profile')
  async updateProfile(
    @Headers('authorization') authHeader: string,
    @Body() dto: UpdateProfileDto,
  ) {
    const token = this.extractToken(authHeader);
    const user = await this.authService.verifyToken(token);
    return this.authService.updateProfile(user.id, dto);
  }

  /**
   * POST /api/v1/auth/verify
   * Xác thực token (dùng khi refresh page)
   */
  @Post('verify')
  @HttpCode(200)
  async verifyToken(@Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader);
    return this.authService.verifyToken(token);
  }

  // ─── Helper ───────────────────────────────────────────

  private extractToken(authHeader: string): string {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token không được cung cấp.');
    }
    return authHeader.replace('Bearer ', '');
  }
}
