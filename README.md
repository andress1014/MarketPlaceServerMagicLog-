# MagicLog Marketplace

MagicLog Marketplace es una aplicación diseñada para la gestión de productos y vendedores. Incluye una API desarrollada en Node.js con NestJS y una interfaz en Vue.js.

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (v16 o superior)
- **Docker** (opcional, pero recomendado para Redis y PostgreSQL)
- **Redis**
- **PostgreSQL**

## Configuración del entorno

Antes de ejecutar la aplicación, crea un archivo **`.env`** en la raíz del backend con la siguiente configuración:

```env
JWT_SECRET=secret
PORT=3000

POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=magiclog
FRONTEND_URL=http://localhost:5173

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_USERNAME=redis
REDIS_PASSWORD=redis
REDIS_TLS_CONFIG=false
REDIS_KEY_PRODUCT=customer-products-all
REDIS_TTL=1000
```

## Instalación y Ejecución

### Backend

1. Clona el repositorio:

  ```sh
  git clone https://github.com/andress1014/MarketPlaceServerMagicLog-.git
  cd MarketPlaceServerMagicLog-
  ```

2. Instala las dependencias:

  ```sh
  npm install
  ```

3. Asegúrate de que PostgreSQL y Redis estén corriendo.

4. Ejecuta las migraciones de la base de datos:

  ```sh
  npm run migration:run
  ```

5. Inicia el servidor en modo desarrollo:

  ```sh
  npm run start:dev
  ```

El backend estará disponible en [http://localhost:3000](http://localhost:3000).

### Frontend

1. Clona el repositorio:

  ```sh
  git clone https://github.com/andress1014/MarketPlaceClientMagicLog.git
  cd MarketPlaceClientMagicLog
  ```

2. Instala las dependencias:

  ```sh
  npm install
  ```

3. Inicia el servidor:

  ```sh
  npm run dev
  ```

El frontend estará disponible en [http://localhost:5173](http://localhost:5173).

## Ejemplos de Consumo de API

A continuación, se presentan ejemplos de consumo de la API utilizando `curl`:

### Registro de usuario

```sh
curl -X POST http://localhost:3000/user/register \
   -H "Content-Type: application/json" \
   -d '{
       "username": "testuser",
       "email": "testuser@example.com",
       "password": "123456",
       "roleType": "seller"
     }'
```

### Inicio de sesión

```sh
curl -X POST http://localhost:3000/auth/login \
   -H "Content-Type: application/json" \
   -d '{
       "email": "seller@seller.com",
       "password": "123456"
     }'
```

La respuesta incluirá un token JWT que debes usar en las siguientes peticiones.

### Obtener lista de vendedores (requiere autenticación)

```sh
curl -X GET http://localhost:3000/user/sellers \
   -H "Authorization: Bearer <TOKEN_AQUÍ>"
```

### Crear un producto (requiere autenticación)

```sh
curl -X POST http://localhost:3000/product/create \
   -H "Authorization: Bearer <TOKEN_AQUÍ>" \
   -H "Content-Type: application/json" \
   -d '{
       "name": "Iphone",
       "quantity": 10,
       "price": 1599.99,
       "categoryId": 2
     }'
```

### Listar productos de un vendedor

```sh
curl -X GET http://localhost:3000/product/my-products \
   -H "Authorization: Bearer <TOKEN_AQUÍ>"
```

### Actualizar un producto (requiere autenticación)

```sh
curl -X PUT http://localhost:3000/product/update/6 \
   -H "Authorization: Bearer <TOKEN_AQUÍ>" \
   -H "Content-Type: application/json" \
   -d '{
       "name": "Nuevo Nombre",
       "price": 199.99,
       "quantity": 20
     }'
```

### Eliminar un producto (requiere autenticación)

```sh
curl -X DELETE http://localhost:3000/product/delete/8 \
   -H "Authorization: Bearer <TOKEN_AQUÍ>"
```

## Despliegue en Producción

### Backend

Para desplegar el backend en producción con Railway:

```sh
railway up
```

### Frontend

Para desplegar el frontend en Netlify:

```sh
netlify deploy --prod
```

## Credenciales de Prueba

Para probar la API, puedes usar las siguientes credenciales:

| Rol     | Correo            | Contraseña |
|---------|-------------------|------------|
| Admin   | admin@admin.com   | 123456     |
| Seller 1| seller@seller.com | 123456     |
| Seller 2| seller2@gmail.com | 123456     |

## Licencia

Este proyecto está bajo la licencia MIT.

---

Este README proporciona toda la información necesaria para instalar, ejecutar, probar y desplegar tu proyecto 🚀. Si necesitas modificaciones, dime. 😃