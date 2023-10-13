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
    user.verify = false;
    await this.userTable.save(user);
    return user;
  }

  async remove(userId: number) {
    const user = await this.findOneToId(userId);
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

  async updateRefreshToken(user: User, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hash;
    await this.userTable.save(user);
  }

  async validRefreshToken(id: number, refreshToken: string): Promise<User> {
    const user = await this.findOneToId(id);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException("Access Denied");
    }

    if (!(await bcrypt.compare(refreshToken, user.refreshToken))) {
      throw new ForbiddenException("Access Denied");
    }

    return user;
  }

  async updateVerify(user: User) {
    user.verify = true;
    await this.userTable.save(user);
  }

  async updatePassword(user: User, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userTable.save(user);
  }
}
