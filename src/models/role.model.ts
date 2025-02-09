import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';

@Table({ tableName: 'role' })
export class Role extends Model<Role> {
    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    code: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    status: boolean;

    @Default(DataType.NOW)
    @Column({ type: DataType.DATE })
      createdAt: Date;
  
    @Default(DataType.NOW)
    @Column({ type: DataType.DATE })
      updatedAt: Date;
}
