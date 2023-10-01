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

  findAll(): Promise<User[]> {
    return this.userTable.find();
  }

  findOne(mail: string): Promise<User> {
    return this.userTable.findOne({ where: { mail } });
  }

  async remove(mail: string): Promise<void> {
    await this.userTable.delete(mail);
  }

  async add(mail: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();

    user.mail = mail;
    user.password = hashedPassword;
    user.refreshToken = "";

    await this.userTable.save(user);

    return user;
  }

  async checkPassword(password: string, mail: string) {
    const user = await this.findOne(mail);
    return bcrypt.compare(password, user.password);
  }

  async updateloginTime(user: User): Promise<void> {
    user.lastLogin = new Date();
    await this.userTable.save(user);
  }

  async updateRefreshToken(mail: string, hash: string) {
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
