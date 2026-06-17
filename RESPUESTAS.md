# Respuestas — Comparativa Docker vs Serverless

## 1. ¿Qué fue más rápido de implementar y desplegar?

**Serverless Framework (local)** fue más rápido de implementar.

- **Docker**: escribir el Dockerfile, hacer `npm install` dentro de la imagen, buildear, tagear, correr el contenedor y luego hacer push a Docker Hub son 5–6 pasos manuales. Cualquier cambio exige re-buildear la imagen.
- **Serverless**: un solo archivo `handler.js` + `serverless.yml`, instalar dependencias una vez y levantar con `npx serverless offline`. El ciclo de cambio-prueba es inmediato.

---

## 2. ¿Qué complejidad encontraste en cada tecnología?

### Docker
| Aspecto | Detalle |
|---|---|
| Concepto nuevo | Entender capas de imagen, WORKDIR, EXPOSE, CMD |
| Networking | Mapeo de puertos `-p 3000:3000` |
| Registro | Crear cuenta en Docker Hub, `docker login`, `docker tag`, `docker push` |
| Estado | El contenedor es efímero pero el proceso vive mientras esté corriendo |
| Curva | Baja-media: una vez que entiendes el Dockerfile, es repetible |

### Serverless Framework (local)
| Aspecto | Detalle |
|---|---|
| Concepto nuevo | Event-driven: la función recibe un `event` en vez de `req/res` |
| Configuración | El `serverless.yml` define todo: runtime, rutas, permisos |
| Limitaciones | Sin estado, sin sesiones, timeout máximo (en AWS: 15 min) |
| Cold start | En producción real puede haber latencia al "despertar" la función |
| Curva | Baja en local; sube considerablemente al desplegar en cloud real (IAM, permisos, etc.) |

---

## 3. ¿Qué arquitectura recomendarías para picos de alto volumen de tráfico?

**Recomendación: Serverless (FaaS)**

### Por qué Serverless gana en picos de tráfico

```
Tráfico normal:  [---]          → pocas instancias activas, costo mínimo
Pico de tráfico: [==========]   → escala automáticamente a miles de instancias en segundos
Fin del pico:    [---]          → vuelve a escala mínima, dejas de pagar
```

- **Escalado automático sin intervención**: AWS Lambda o Google Cloud Functions escalan a miles de ejecuciones paralelas sin configuración extra.
- **Pago por uso**: solo se cobra por el tiempo de ejecución real (milisegundos), no por servidores idle.
- **Sin gestión de infraestructura**: no hay que provisionar clusters, load balancers ni auto-scaling groups.

### Cuándo Docker/Kubernetes sería mejor

- Si la aplicación mantiene **estado en memoria** (websockets, caché local).
- Si el proceso necesita correr **continuamente** (workers, cron jobs pesados).
- Si tienes **latencia ultra-baja** como requisito y no puedes tolerar cold starts.
- Si ya tienes un equipo con madurez en Kubernetes y el tráfico es **predecible y constante**.

### Arquitectura híbrida recomendada para producción real

```
                  ┌─────────────────────────────┐
Usuario ──────▶   │  CDN / Load Balancer         │
                  └──────────────┬──────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                   ▼
       [Serverless FaaS]   [Docker/K8s]        [Base de datos]
       GET /hello           Websockets          PostgreSQL / Redis
       APIs stateless       Procesos largos     (siempre activa)
       (escala infinita)    Estado en memoria
```

**Conclusión**: Para APIs sin estado con picos de tráfico impredecibles → **Serverless**. Para servicios con estado o latencia crítica → **Docker/Kubernetes**.
