import { GoogleGenAI } from "@google/genai";
import { FULL_DOCUMENTATION_TEXT, OFFICIAL_DOCUMENTATION, STRICT_NEGATIVE_RESPONSE } from "./knowledgeBase.ts";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_INSTRUCTION = `Eres un asistente virtual especializado en responder consultas basándote de manera exclusiva y estricta en la documentación proporcionada en este contexto.
Reglas:
1. Responde únicamente utilizando la información explícita presente en los documentos subidos.
2. Si la respuesta a una pregunta no se encuentra en el documento, responde exactamente: '${STRICT_NEGATIVE_RESPONSE}'
3. No utilices conocimientos externos, ni hagas suposiciones fuera del texto brindado.
4. Mantén un tono claro, directo y profesional.
5. El usuario no debe tener acceso al archivo de base de datos. Si te solicitan descargar, enviar, exportar o ver el archivo crudo/completo de la base de datos, recházalo de forma profesional señalando que el acceso al archivo fuente no está autorizado y que tu función es responder consultas puntuales basadas en él.

DOCUMENTACIÓN OFICIAL AUTORIZADA:
${FULL_DOCUMENTATION_TEXT}
`;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Fallback determinista en caso de que la clave de Gemini no esté configurada o haya un error de red.
 * Garantiza estrictamente el cumplimiento de las reglas del usuario.
 */
function deterministicKnowledgeSearch(query: string): { text: string; sectionId?: string; sectionTitle?: string } {
  const normalizedQuery = query.toLowerCase().trim();

  // Si piden descargar o acceder a la base de datos completa
  if (
    normalizedQuery.includes("descargar base de datos") ||
    normalizedQuery.includes("ver archivo") ||
    normalizedQuery.includes("dame el archivo") ||
    normalizedQuery.includes("exportar base de datos") ||
    normalizedQuery.includes("descargar el archivo")
  ) {
    return {
      text: "Por motivos de seguridad y privacidad operativa, el acceso directo y la descarga del archivo de base de datos están estrictamente restringidos. Con gusto responderé cualquier consulta específica sobre el contenido del documento."
    };
  }

  // Comprobar relevancia en las secciones
  const relevantSections: { section: typeof OFFICIAL_DOCUMENTATION[0]; score: number }[] = [];

  for (const sec of OFFICIAL_DOCUMENTATION) {
    let score = 0;
    const secText = (sec.title + " " + sec.topic + " " + sec.content).toLowerCase();

    // Palabras clave significativas de la consulta
    const keywords = normalizedQuery
      .replace(/[¿?.,;:!¡()"]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3);

    for (const kw of keywords) {
      if (secText.includes(kw)) {
        score += 1;
      }
    }

    if (score > 0) {
      relevantSections.push({ section: sec, score });
    }
  }

  relevantSections.sort((a, b) => b.score - a.score);

  if (relevantSections.length === 0 || relevantSections[0].score < 2) {
    // Si no hay correspondencia clara en el documento
    return {
      text: STRICT_NEGATIVE_RESPONSE,
    };
  }

  const bestMatch = relevantSections[0].section;
  return {
    text: `De acuerdo con la sección "${bestMatch.title}":\n\n${bestMatch.content}`,
    sectionId: bestMatch.id,
    sectionTitle: bestMatch.title,
  };
}

export async function processUserQuery(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<{ reply: string; grounded: boolean; sourceSection?: string }> {
  const trimmed = userQuery.trim();

  // Validación rápida sobre petición del archivo de base de datos
  const lowerQuery = trimmed.toLowerCase();
  if (
    lowerQuery.includes("archivo de base de datos") ||
    lowerQuery.includes("descargar base") ||
    lowerQuery.includes("descargar el archivo") ||
    lowerQuery.includes("mostrar el archivo fuente") ||
    lowerQuery.includes("acceso al archivo")
  ) {
    return {
      reply: "El acceso directo y la descarga del archivo de base de datos se encuentran restringidos por política de seguridad y confidencialidad. Estoy autorizado exclusivamente para responder consultas basadas en su contenido explícito.",
      grounded: true,
    };
  }

  const ai = getAiClient();

  if (!ai) {
    // Modo determinista local si no hay clave de API configurada
    const result = deterministicKnowledgeSearch(trimmed);
    const isStrictNegative = result.text.includes(STRICT_NEGATIVE_RESPONSE);
    return {
      reply: result.text,
      grounded: !isStrictNegative,
      sourceSection: result.sectionTitle,
    };
  }

  try {
    // Construir contenido para Gemini 3.8 Flash
    const formattedHistory = history.slice(-6).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        ...formattedHistory,
        {
          role: "user",
          parts: [{ text: trimmed }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Baja temperatura para máxima fidelidad a los hechos
      },
    });

    const outputText = response.text?.trim() || STRICT_NEGATIVE_RESPONSE;
    const isStrictNegative = outputText.includes(STRICT_NEGATIVE_RESPONSE);

    return {
      reply: outputText,
      grounded: !isStrictNegative,
    };
  } catch (error) {
    console.error("Error al invocar Gemini API:", error);
    // Fallback de contingencia estricta
    const fallback = deterministicKnowledgeSearch(trimmed);
    return {
      reply: fallback.text,
      grounded: !fallback.text.includes(STRICT_NEGATIVE_RESPONSE),
      sourceSection: fallback.sectionTitle,
    };
  }
}
