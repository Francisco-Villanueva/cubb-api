import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from 'src/core/database/schema/base.model';
import { Role, ROLES_VALUES } from 'src/core/types/role';
@Table
export class User extends BaseModel<User> {
  @Column
  name: string;
  @Column({
    type: DataType.ENUM(...Object.values(ROLES_VALUES)),
    allowNull: false,
  })
  role: Role;
  @Column
  fullName: string;
  @Column
  email: string;
  @Column
  userName: string;
  @Column
  phone: string;
  @Column
  password: string;
  @Column({ allowNull: true })
  lastName: string;
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  emailConfirmed: boolean;
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  confirmedAccont: boolean;
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  membership_status: boolean;
  @Column({ allowNull: true })
  confirmationToken: string;
  @Column({ allowNull: true })
  confirmationTokenExpiresAt: Date;
  @Column({
    type: DataType.UUID,
  })
  TeamId: string;
}
