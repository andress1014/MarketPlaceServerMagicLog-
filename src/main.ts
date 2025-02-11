import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const { FRONTEND_URL, PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: '*', // Permitir todas las solicitudes temporalmente
    methods: '*', // Permitir todos los métodos
    credentials: true,
  });
  

  // 📌 Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('This is the API documentation for the MagicLog backend.')
    .setVersion('1.0')
    .addBearerAuth() // 🔐 Soporte para autenticación con JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // 📝 Swagger estará en /api/docs

  await app.listen(Number(PORT));
}

bootstrap();
