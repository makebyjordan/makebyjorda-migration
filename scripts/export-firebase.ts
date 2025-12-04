/**
 * Script de exportación de datos de Firebase Firestore
 *
 * Este script exporta todos los datos de las colecciones de Firebase
 * a un archivo JSON que luego puede ser importado a PostgreSQL.
 *
 * Uso: npx ts-node scripts/export-firebase.ts
 *
 * IMPORTANTE: Asegúrate de tener las credenciales de Firebase configuradas
 * en el archivo .env antes de ejecutar este script.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Configuración de Firebase
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'mbj-ddbb');

// Colecciones a exportar
const COLLECTIONS = [
  'resultados',
  'projects',
  'images',
  'tools',
  'toolCategories',
  'protocols',
  'teamItems',
  'sajorItems',
  'aprendePages',
  'formations',
  'n8nServers',
  'n8nTemplates',
  'links',
  'linkCards',
  'prompts',
  'notes',
  'designs',
  'htmls',
  'shorts',
  'gitProtocols',
  'services',
  'blogCategories',
];

// Documentos singulares a exportar
const SINGLETON_DOCS = [
  { collection: 'heroContent', docId: 'main' },
  { collection: 'aboutContent', docId: 'main' },
];

interface ExportData {
  exportedAt: string;
  collections: Record<string, any[]>;
  singletons: Record<string, any>;
}

async function exportCollection(collectionName: string): Promise<any[]> {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    const documents = snapshot.docs.map(doc => {
      const data = doc.data();
      // Convertir Timestamps a ISO strings
      const processedData = processTimestamps(data);
      return {
        id: doc.id,
        ...processedData,
      };
    });

    console.log(`  ✓ ${collectionName}: ${documents.length} documentos`);
    return documents;
  } catch (error) {
    console.error(`  ✗ Error exportando ${collectionName}:`, error);
    return [];
  }
}

async function exportSingleton(collectionName: string, docId: string): Promise<any | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const processedData = processTimestamps(data);
      console.log(`  ✓ ${collectionName}/${docId}: documento encontrado`);
      return {
        id: docSnap.id,
        ...processedData,
      };
    } else {
      console.log(`  - ${collectionName}/${docId}: no existe`);
      return null;
    }
  } catch (error) {
    console.error(`  ✗ Error exportando ${collectionName}/${docId}:`, error);
    return null;
  }
}

function processTimestamps(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  // Verificar si es un Timestamp de Firebase
  if (obj.toDate && typeof obj.toDate === 'function') {
    return obj.toDate().toISOString();
  }

  // Verificar si tiene seconds y nanoseconds (estructura de Timestamp)
  if (obj.seconds !== undefined && obj.nanoseconds !== undefined) {
    return new Date(obj.seconds * 1000 + obj.nanoseconds / 1000000).toISOString();
  }

  // Si es un array, procesar cada elemento
  if (Array.isArray(obj)) {
    return obj.map(item => processTimestamps(item));
  }

  // Si es un objeto, procesar cada propiedad
  const processed: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    processed[key] = processTimestamps(obj[key]);
  }
  return processed;
}

async function main() {
  console.log('========================================');
  console.log('EXPORTACIÓN DE DATOS DE FIREBASE');
  console.log('========================================\n');

  // Verificar configuración
  if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
    console.error('❌ Error: Faltan las credenciales de Firebase en .env');
    console.error('   Asegúrate de configurar:');
    console.error('   - NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    console.error('   - NEXT_PUBLIC_FIREBASE_API_KEY');
    console.error('   - NEXT_PUBLIC_FIREBASE_APP_ID');
    process.exit(1);
  }

  console.log(`📦 Proyecto Firebase: ${firebaseConfig.projectId}`);
  console.log(`📂 Base de datos: mbj-ddbb\n`);

  const exportData: ExportData = {
    exportedAt: new Date().toISOString(),
    collections: {},
    singletons: {},
  };

  // Exportar colecciones
  console.log('Exportando colecciones...\n');
  for (const collectionName of COLLECTIONS) {
    exportData.collections[collectionName] = await exportCollection(collectionName);
  }

  // Exportar documentos singulares
  console.log('\nExportando documentos singulares...\n');
  for (const { collection: collName, docId } of SINGLETON_DOCS) {
    const data = await exportSingleton(collName, docId);
    if (data) {
      exportData.singletons[`${collName}_${docId}`] = data;
    }
  }

  // Guardar archivo JSON
  const outputPath = path.join(__dirname, 'firebase-export.json');
  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

  // Estadísticas
  console.log('\n========================================');
  console.log('RESUMEN DE EXPORTACIÓN');
  console.log('========================================\n');

  let totalDocuments = 0;
  for (const [name, docs] of Object.entries(exportData.collections)) {
    if (docs.length > 0) {
      console.log(`  ${name}: ${docs.length} documentos`);
      totalDocuments += docs.length;
    }
  }

  const singletonsCount = Object.keys(exportData.singletons).length;
  console.log(`\n  📊 Total: ${totalDocuments} documentos + ${singletonsCount} singletons`);
  console.log(`  📁 Archivo guardado: ${outputPath}`);
  console.log('\n✅ Exportación completada!\n');
}

main().catch(console.error);
