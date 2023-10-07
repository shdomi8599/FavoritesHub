import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { User } from "src/source/entity/User";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
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

  async findOneToId(userId: number): Promise<User> {
    const user = await this.userTable.findOne({ where: { id: userId } });
    return user;
  }

  async findOneToMail(mail: string): Promise<User> {
    const user = await this.userTable.findOne({ where: { mail } });
    return user;
  }

  async add(mail: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const isExistedUser = await this.findOneToMail(mail);
    if (isExistedUser) throw new Error("exist");
    const user = new User();
    user.mail = mail;
    user.password = hashedPassword;
    user.refreshToken = "";
    await this.userTable.save(user);
  }

  async remove(userId: number) {
    const user = await this.findOneToId(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
    await this.userTable.delete(user);
  }

  async checkPassword(user: User, password: string) {
    const isExactPassword = await bcrypt.compare(password, user.password);
    if (!isExactPassword) {
      throw new Error("not exact");
    }
  }

  async updateloginTime(user: User) {
    user.lastLogin = new Date();
    await this.userTable.save(user);
  }

  async updateRefreshToken(mail: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    const user = await this.findOneToMail(mail);
    user.refreshToken = hash;
    await this.userTable.save(user);
  }

  async validRefreshToken(mail: string, refreshToken: string): Promise<User> {
    const user = await this.findOneToMail(mail);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException("Access Denied");
    }

    if (!(await bcrypt.compare(refreshToken, user.refreshToken))) {
      throw new ForbiddenException("Access Denied");
    }

    return user;
  }

  async updateVerifyCode(user: User, verifyCode: number) {
    user.verifyCode = verifyCode;
    await this.userTable.save(user);
  }
}
