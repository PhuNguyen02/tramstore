// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  /**
   * Đăng ký tài khoản mới
   */
  async register(dto: RegisterDto) {
    // Kiểm tra email đã tồn tại chưa
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email này đã được đăng ký. Vui lòng dùng email khác.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Tạo user
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    this.logger.log(`👤 New user registered: ${user.email}`);

    // Trả về token
    const token = this.signToken(user.id, user.email, user.role);
    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  /**
   * Đăng nhập
   */
  async login(dto: LoginDto) {
    // Tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }

    // Kiểm tra password
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }

    this.logger.log(`🔐 User logged in: ${user.email}`);

    const token = this.signToken(user.id, user.email, user.role);
    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  /**
   * Lấy thông tin profile từ token
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản.');
    }
    return this.sanitizeUser(user);
  }

  /**
   * Cập nhật thông tin profile
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.avatar !== undefined && { avatar: dto.avatar }),
      },
    });
    return this.sanitizeUser(user);
  }

  /**
   * Xác thực JWT token
   */
  async verifyToken(token: string) {
    try {
      const payload = this.jwt.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) throw new UnauthorizedException();
      return this.sanitizeUser(user);
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn.');
    }
  }

  // ─── Private helpers ───────────────────────────────────

  private signToken(userId: string, email: string, role: string) {
    return this.jwt.sign({
      sub: userId,
      email,
      role,
    });
  }

  private sanitizeUser(user: any) {
    // Không bao giờ trả về password
    const { password, ...rest } = user;
    return rest;
  }
}
