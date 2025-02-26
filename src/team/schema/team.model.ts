import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from 'src/core/database/schema/base.model';
@Table
export class Team extends BaseModel<Team> {
  @Column
  name: string;
  @Column({ allowNull: true })
  category: string;
  @Column({ allowNull: true })
  shield: string;
  @Column({ allowNull: true })
  email: string;
  @Column({ allowNull: true })
  phone: string;
}
