import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Product } from './product.model';

@Table({ tableName: 'category', timestamps: true })
export class Category extends Model<Category> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @HasMany(() => Product)
  products: Product[];

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;
}
