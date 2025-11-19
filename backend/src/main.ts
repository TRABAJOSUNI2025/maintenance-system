import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Maintenance System API')
    .setDescription('API for vehicle maintenance system management')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Global prefix
  app.setGlobalPrefix('api');

  // Servir archivos estáticos del frontend
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.useStaticAssets(frontendPath);

  // Redirigir rutas desconocidas al index.html (SPA)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.url.startsWith('/api/') && req.url !== '/api/docs' && req.url !== '/api/docs-json') {
      // Si no es una ruta de API, servir index.html
      if (!req.url.includes('.')) {
        res.sendFile(path.join(frontendPath, 'index.html'));
      } else {
        next();
      }
    } else {
      next();
    }
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
