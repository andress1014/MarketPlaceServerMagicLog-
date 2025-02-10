import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import * as dotenv from 'dotenv';
dotenv.config();

const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: POSTGRES_HOST ,
            port: Number(POSTGRES_PORT),
            username: String(POSTGRES_USER),
            password: String(POSTGRES_PASSWORD),
            database: POSTGRES_DB,
            models: [User, Role],
            autoLoadModels: true,
            synchronize: true,
            logging: console.log, // Agrega logging para depuración
        }),
    ],
})
export class DatabaseModule {}
