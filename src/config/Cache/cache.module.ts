import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

const { REDIS_HOST, REDIS_PORT, REDIS_TLS_CONFIG } = process.env;

/**
 * Configure Redis connection
 * @see Redis 
 * @description Redis connection configuration
 */
const redisClient = new Redis({
  host: String(REDIS_HOST),
  port: Number(REDIS_PORT),
  tls:  REDIS_TLS_CONFIG === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
});

redisClient.on('error', (err) => {
  console.error('❌ Error en Redis:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Conectado a Redis exitosamente');
});

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useValue: redisClient,
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class CacheConfigModule {}

export { redisClient };
