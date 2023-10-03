import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { User } from "src/source/entity/User";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userTable: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userTable.find();
    if (!users) {
      throw new Error("사용자 리스트를 찾을 수 없습니다.");
    }
    return users;
  }

  async findOne(mail: string): Promise<User> {
    const user = await this.userTable.findOne({ where: { mail } });
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
    return user;
  }

  async add(mail: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.mail = mail;
    user.password = hashedPassword;
    user.refreshToken = "";
    await this.userTable.save(user);
  }

  async remove(mail: string): Promise<void> {
    const user = await this.findOne(mail);
    await this.userTable.delete(user);
  }

  async checkPassword(user: User, password: string) {
    return bcrypt.compare(password, user.password);
  }

  async updateloginTime(user: User): Promise<void> {
    user.lastLogin = new Date();
    await this.userTable.save(user);
  }

  async updateRefreshToken(mail: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    const user = await this.findOne(mail);
    user.refreshToken = hash;
    await this.userTable.save(user);
  }

  async validRefreshToken(mail: string, refreshToken: string): Promise<User> {
    const user = await this.findOne(mail);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException("Access Denied");
    }

    if (!(await bcrypt.compare(refreshToken, user.refreshToken))) {
      throw new ForbiddenException("Access Denied");
    }

    return user;
  }
}
