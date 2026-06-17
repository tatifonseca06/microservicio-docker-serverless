# Microservicio Docker vs Serverless

Comparativa práctica entre una API REST containerizada con Docker y la misma funcionalidad implementada como función Serverless local.

## Estructura del proyecto

```
├── docker-api/          # API REST con Node.js + Express
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── serverless-api/      # Función serverless con Serverless Framework
│   ├── handler.js
│   ├── package.json
│   └── serverless.yml
└── RESPUESTAS.md        # Análisis comparativo de ambas tecnologías
```

## Endpoint

Ambas implementaciones exponen el mismo endpoint:

```
GET /hello?name=Ana
→ { "message": "Hola Ana desde Docker" }
→ { "message": "Hola Ana desde Serverless" }
```

---

## Parte 1 — Docker

### Requisitos
- [Docker](https://www.docker.com/products/docker-desktop)

### Construir y ejecutar

```bash
cd docker-api

# Construir la imagen
docker build -t hello-docker-api .

# Ejecutar el contenedor
docker run -d --name hello-container -p 3000:3000 hello-docker-api

# Probar
curl "http://localhost:3000/hello?name=Ana"
```

### Subir a Docker Hub

```bash
docker tag hello-docker-api TU_USUARIO/hello-docker-api:latest
docker push TU_USUARIO/hello-docker-api:latest
```

---

## Parte 2 — Serverless (local)

Usa [Serverless Framework](https://www.serverless.com/) con el plugin `serverless-offline` para simular AWS Lambda localmente, sin necesidad de cuenta en la nube.

### Requisitos
- Node.js 18+

### Instalar y ejecutar

```bash
cd serverless-api

npm install

# Levantar servidor local en puerto 3001
npx serverless offline

# Probar (en otra terminal)
curl "http://localhost:3001/hello?name=Ana"
```

---

## Comparativa

| | Docker | Serverless (local) |
|---|---|---|
| Velocidad de implementación | Media | Alta |
| Escalado ante picos de tráfico | Manual (requiere orquestación) | Automático |
| Costo en reposo | Paga por servidor activo | Paga solo por ejecución |
| Estado en memoria | Si | No |
| Complejidad inicial | Baja | Baja |
| Complejidad en producción | Media | Alta (IAM, permisos, cold starts) |

Para el análisis completo ver [RESPUESTAS.md](./RESPUESTAS.md).
