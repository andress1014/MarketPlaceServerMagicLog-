import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import { User } from './user.model';
import { Category } from './category.model';

@Table({ tableName: 'product', timestamps: true })
export class Product extends Model<Product> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  sku: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  @Column({ type: DataType.DOUBLE, allowNull: false })
  price: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true }) // 🔥 Nueva columna
  isActive: boolean;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
