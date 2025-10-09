import { Injectable, ConflictException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users: UserEntity[] = [];
  private nextUserId = 1;

  async create(username: string, password: string): Promise<UserEntity> {
    // 중복 체크
    const existingUser = this.users.find(u => u.username === username);
    if (existingUser) {
      throw new ConflictException('Error!: 이미 존재하는 사용자 이름입니다.');
    }

    // 비밀번호 강도 검증
    this.validatePasswordStrength(password);

    // 비밀번호 암호화 (bcrypt - salt rounds 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: UserEntity = {
      id: `user-${this.nextUserId++}`,
      username,
      password: hashedPassword,
      createdAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async findByUsername(username: string): Promise<UserEntity | undefined> {
    return this.users.find(u => u.username === username);
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    return this.users.find(u => u.id === id);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // 비밀번호 강도 검증 메서드
  private validatePasswordStrength(password: string): void {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isLengthValid = password.length >= 8;

    if (!isLengthValid || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      throw new ConflictException(
        'Error!: 비밀번호는 최소 8자 이상이며, 영문 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.'
      );
    }
  }
}