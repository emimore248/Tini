import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { processUserQuery, ChatMessage } from './server/geminiService.ts';
import { OFFICIAL_DOCUMENTATION, STRICT_NEGATIVE_RESPONSE } from './server/knowledgeBase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = express();
app.use(express.json());

// Endpoint de estado del servicio
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    mode: 'strict_documentary_consultant',
    databaseLoaded: true,
    totalSections: OFFICIAL_DOCUMENTATION.length,
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

// Endpoint con resumen de temas y preguntas frecuentes autorizadas
// NOTA: No entrega el texto completo ni el archivo fuente (política estricta)
app.get('/api/topics', (_req, res) => {
  const topics = [
    {
      id: 'origenes',
      title: 'Raíces y Formación Temprana (1997–2011)',
      description: 'Familia Stoessel, educación bilingüe, estudios técnicos y primeros pasos en TV.',
      sampleQuestions: [
        '¿Quiénes son los padres de Martina Stoessel y qué formación académica tuvo?',
        '¿En qué programa infantil debutó en 2007?',
        '¿Por qué Disney consideró a Martina como un "activo diversificado"?',
      ],
    },
    {
      id: 'violetta',
      title: 'Franquicia Violetta y Consagración (2012–2015)',
      description: 'Ventas mundiales de IP, cifras de taquilla y giras de estadios.',
      sampleQuestions: [
        '¿Cuántas copias de bandas sonoras y libros se vendieron globalmente en Violetta?',
        '¿Cuánto recaudó la gira Violetta Live 2015 y en qué puesto mundial quedó?',
        '¿A cuántos idiomas fue doblada la serie Violetta y en cuántos países se emitió?',
      ],
    },
    {
      id: 'solista',
      title: 'Transición a TINI y Género Urbano (2016–2020)',
      description: 'Firma histórica con Hollywood Records, discografía y giras solistas iniciales.',
      sampleQuestions: [
        '¿Qué hito marcó la firma de Martina con Hollywood Records en 2015?',
        '¿Qué certificación comercial obtuvo el álbum Tini Tini Tini (2020) en Argentina?',
        '¿Qué récord de conciertos consecutivos logró en el Estadio Luna Park?',
      ],
    },
    {
      id: 'cupido',
      title: 'Era Cupido y Récords Digitales (2021–2023)',
      description: 'Alianza con Sony Music Latin, éxitos en Billboard y presentaciones masivas.',
      sampleQuestions: [
        '¿Qué récord histórico alcanzó el álbum Cupido en Billboard Latin Pop Albums?',
        '¿Cuántas semanas consecutivas estuvo "Miénteme" en el #1 del Billboard Argentina?',
        '¿Qué impacto económico y de audiencia generó su concierto en Posadas, Misiones?',
      ],
    },
    {
      id: 'mechon-pelo',
      title: 'Un Mechón de Pelo y Salud Mental (2024)',
      description: 'Giro introspectivo, decisiones de catálogo y la trilogía Pa, Posta y Buenos Aires.',
      sampleQuestions: [
        '¿Por qué decidió engavetar un álbum urbano para grabar Un Mechón de Pelo?',
        '¿Qué medida operativa tomó Tini en sus giras para gestionar su salud mental?',
        '¿De qué trata la canción "Pa" y qué posición alcanzó en Argentina?',
      ],
    },
    {
      id: 'coldplay-futuro',
      title: 'Hitos Globales, Coldplay y Actuación (2024–2027)',
      description: 'Participación en "We Pray", debut en SNL, serie Breakdown y gira Futttura.',
      sampleQuestions: [
        '¿Qué hito histórico representó "We Pray" con Coldplay en el Billboard Hot 100?',
        '¿Qué personaje interpreta Tini en la serie Breakdown de Disney+ y qué nominación recibió?',
        '¿Cuáles son las proyecciones de fechas y ciudades para el Futttura World Tour?',
      ],
    },
    {
      id: 'gestion-emilia',
      title: 'Gestión, Stoessel-Tinelli y Emilia Mernes',
      description: 'El conflicto legal de Alejandro Stoessel, autonomía y la alianza en "La Original".',
      sampleQuestions: [
        '¿Qué resultados y certificaciones obtuvo la colaboración "La Original" con Emilia Mernes?',
        '¿Cómo afectó el litigio Stoessel-Tinelli a la imagen familiar y cómo se procesó en su música?',
        '¿Cuál es la postura documentada frente a las supuestas rivalidades mediáticas?',
      ],
    },
  ];

  res.json({ topics, strictPolicyText: STRICT_NEGATIVE_RESPONSE });
});

// Endpoint principal de chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'El mensaje es requerido y debe ser texto.' });
      return;
    }

    const chatHistory: ChatMessage[] = Array.isArray(history) ? history : [];
    const response = await processUserQuery(message, chatHistory);

    res.json(response);
  } catch (err: any) {
    console.error('Error procesando consulta:', err);
    res.status(500).json({
      reply: STRICT_NEGATIVE_RESPONSE,
      grounded: false,
      error: err.message,
    });
  }
});

// Bloqueo explícito de intentos de descarga directa del archivo de base de datos
app.all(['/api/database', '/api/download', '/api/export', '/api/raw-docs'], (_req, res) => {
  res.status(403).json({
    error: 'Acceso denegado: El usuario no debe tener acceso directo al archivo de base de datos.',
    policy: 'Solo se permiten consultas interactivas a través del Asistente Virtual.',
  });
});

// Montaje de Vite en dev o archivos estáticos en prod
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Servidor Asistente Virtual] Activo en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fallo al iniciar el servidor:', err);
  process.exit(1);
});
