import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from 'src/core/database/schema/base.model';
import { ISchedules } from 'src/core/types/workhours';
@Table
export class Court extends BaseModel<Court> {
  @Column
  name: string;
  @Column({
    type: DataType.ARRAY(DataType.JSON),
    defaultValue: [],
  })
  schedules: ISchedules[];
}
