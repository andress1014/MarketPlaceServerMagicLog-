import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Default, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { Role } from './role.model';
import * as bcrypt from 'bcrypt';

@Table({ tableName: 'user', timestamps: true })
export class User extends Model<User> {
    @Column({ type: DataType.STRING, allowNull: false })
    username: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @ForeignKey(() => Role)
    @Column({ type: DataType.INTEGER })
    roleId: number;

    @BelongsTo(() => Role)
    role: Role;

    @Default(DataType.NOW)
    @Column({ type: DataType.DATE })
    createdAt: Date;

    @Default(DataType.NOW)
    @Column({ type: DataType.DATE })
    updatedAt: Date;

    // 🔐 Encripta la contraseña antes de guardar o actualizar el usuario
    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(user: User) {
        if (user.password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(user.password, saltRounds);
        }
    }

    // Método para validar la contraseña al hacer login
    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
