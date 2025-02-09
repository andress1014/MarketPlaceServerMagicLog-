import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: '127.0.0.1',
            port: 5432,
            username: 'postgres',
            password: '1014',
            database: 'magiclog',
            models: [User, Role],
            autoLoadModels: true,
            synchronize: true,
            logging: console.log, // Agrega logging para depuración
        }),
    ],
})
export class DatabaseModule {}
