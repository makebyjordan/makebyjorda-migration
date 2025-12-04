/**
 * Servicios Prisma para PostgreSQL
 *
 * Este archivo exporta todos los servicios migrados de Firebase a Prisma.
 * Para usar estos servicios en lugar de los de Firebase, cambia las importaciones:
 *
 * Antes (Firebase):
 *   import { getResultados } from '@/services/resultados';
 *
 * Después (Prisma):
 *   import { getResultados } from '@/services/prisma/resultados';
 *
 * O puedes importar desde el índice:
 *   import { getResultados } from '@/services/prisma';
 */

// Resultados
export {
  getResultados,
  saveResultado,
  deleteResultado,
  type Resultado,
  type ResultadoInput,
} from './resultados';

// Projects
export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  type Project,
} from './projects';

// Images
export {
  getImages,
  uploadImage,
  addImageByUrl,
  deleteImage,
  type ImageData,
} from './images';

// Tools
export {
  getTools,
  createTool,
  updateTool,
  deleteTool,
  type Tool,
} from './tools';

// Protocols
export {
  getProtocols,
  getProtocolById,
  createProtocol,
  updateProtocol,
  deleteProtocol,
  type Protocol,
  type ProtocolStep,
} from './protocols';

// Team
export {
  getTeamItems,
  createTeamItem,
  updateTeamItem,
  deleteTeamItem,
  type TeamItem,
} from './team';

// Hero
export {
  getHeroContent,
  updateHeroContent,
  type HeroContentData,
  type HeroButton,
} from './hero';

// About
export {
  getAboutContent,
  updateAboutContent,
  type AboutContentData,
} from './about';

// Services
export {
  getServices,
  createService,
  updateService,
  deleteService,
  type Service,
} from './services';

// Notes
export {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  type Note,
} from './notes';

// Shorts
export {
  getShorts,
  createShort,
  updateShort,
  deleteShort,
  type Short,
} from './shorts';
