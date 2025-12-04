# Migración de Firebase a PostgreSQL con Prisma

Este documento describe el proceso de migración de Firebase Firestore a PostgreSQL usando Prisma.

## Estructura de la migración

```
├── prisma/
│   └── schema.prisma          # Esquema de base de datos Prisma
├── scripts/
│   ├── export-firebase.ts     # Script para exportar datos de Firebase
│   └── import-to-postgres.ts  # Script para importar datos a PostgreSQL
├── src/
│   ├── lib/
│   │   ├── firebase.ts        # Configuración de Firebase (original)
│   │   └── prisma.ts          # Cliente de Prisma
│   └── services/
│       ├── *.ts               # Servicios originales (Firebase)
│       └── prisma/            # Servicios migrados (Prisma)
│           ├── index.ts       # Exportaciones
│           ├── resultados.ts
│           ├── projects.ts
│           ├── images.ts
│           ├── tools.ts
│           ├── protocols.ts
│           ├── team.ts
│           ├── hero.ts
│           ├── about.ts
│           ├── services.ts
│           ├── notes.ts
│           └── shorts.ts
```

## Pasos para la migración

### 1. Configurar PostgreSQL

Asegúrate de tener PostgreSQL instalado y crea una base de datos:

```bash
createdb makebyjordan
```

Actualiza la variable `DATABASE_URL` en `.env`:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/makebyjordan?schema=public"
```

### 2. Configurar credenciales de Firebase

Para exportar los datos, necesitas las credenciales de Firebase en `.env`:

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-7212735275-82dc4
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studio-7212735275-82dc4.firebasestorage.app
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-7212735275-82dc4.firebaseapp.com
```

### 3. Generar el cliente de Prisma

```bash
npx prisma generate
```

### 4. Crear las tablas en PostgreSQL

```bash
npx prisma db push
```

### 5. Exportar datos de Firebase

```bash
npx ts-node scripts/export-firebase.ts
```

Esto creará un archivo `scripts/firebase-export.json` con todos los datos.

### 6. Importar datos a PostgreSQL

```bash
npx ts-node scripts/import-to-postgres.ts
```

### 7. Verificar la migración

Puedes usar Prisma Studio para ver los datos:

```bash
npx prisma studio
```

## Cambiar de Firebase a Prisma en el código

Para migrar un componente o página de Firebase a Prisma, cambia las importaciones:

### Antes (Firebase):
```typescript
import { getResultados, saveResultado } from '@/services/resultados';
```

### Después (Prisma):
```typescript
import { getResultados, saveResultado } from '@/services/prisma/resultados';
```

O importa desde el índice:
```typescript
import { getResultados, saveResultado } from '@/services/prisma';
```

## Modelos migrados

| Colección Firebase | Modelo Prisma | Estado |
|-------------------|---------------|--------|
| resultados | Resultado | ✅ Migrado |
| projects | Project | ✅ Migrado |
| images | Image | ✅ Migrado |
| tools | Tool | ✅ Migrado |
| protocols | Protocol + ProtocolStep | ✅ Migrado |
| teamItems | TeamItem | ✅ Migrado |
| sajorItems | SajorItem | ✅ Schema listo |
| aprendePages | AprendePage + relaciones | ✅ Schema listo |
| formations | Formation | ✅ Schema listo |
| n8nServers | N8NServer | ✅ Schema listo |
| n8nTemplates | N8NTemplate | ✅ Schema listo |
| links | Link | ✅ Schema listo |
| linkCards | LinkCard | ✅ Schema listo |
| prompts | Prompt | ✅ Schema listo |
| notes | Note | ✅ Migrado |
| designs | Design | ✅ Schema listo |
| htmls | HtmlPage | ✅ Schema listo |
| shorts | Short | ✅ Migrado |
| gitProtocols | GitProtocol + GitStep | ✅ Schema listo |
| services | Service | ✅ Migrado |
| heroContent | HeroContent + HeroButton | ✅ Migrado |
| aboutContent | AboutContent | ✅ Migrado |
| blogCategories | BlogCategory | ✅ Schema listo |
| toolCategories | ToolCategory | ✅ Schema listo |

## Notas importantes

1. **Firebase Storage**: Las imágenes siguen almacenándose en Firebase Storage. Solo los metadatos se migran a PostgreSQL.

2. **IDs**: Se preservan los IDs originales de Firebase para mantener la compatibilidad.

3. **Timestamps**: Los timestamps de Firebase se convierten a objetos Date de JavaScript/PostgreSQL.

4. **Arrays anidados**: En Firebase, los arrays como `steps` o `buttons` están dentro del documento. En PostgreSQL, se normalizan en tablas separadas con relaciones.

## Rollback

Si necesitas volver a Firebase, simplemente cambia las importaciones de vuelta a los servicios originales en `@/services/`.
