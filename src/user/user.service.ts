import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/core/constants';
import { User } from './schema/user.model';
import { Op } from 'sequelize';
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly UserModel: typeof User,
  ) {}

  async getAll(): Promise<User[]> {
    return this.UserModel.findAll();
  }

  async getByUserName(userName: string) {
    return this.UserModel.findOne({ where: { userName } });
  }

  async getById(id: string): Promise<User> {
    return await this.UserModel.findOne({
      where: { id },
    });
  }
  public async findBy({
    key,
    value,
  }: {
    key: keyof User;
    value: string | number;
  }): Promise<User> {
    return this.UserModel.findOne({
      where: { [key]: value },
    });
  }

  async create(data: Partial<User>): Promise<User> {
    return this.UserModel.create(data);
  }
  async update(id: string, data: Partial<User>) {
    return this.UserModel.update(data, { where: { id } });
  }
  async delete(id: string) {
    return this.UserModel.destroy({ where: { id } });
  }
}
