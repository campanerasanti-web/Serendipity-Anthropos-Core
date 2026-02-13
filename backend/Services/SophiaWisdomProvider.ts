/**
 * SOPHIA WISDOM PROVIDER
 * Backend service que lee la carpeta /sofia y expone sabiduría
 * 
 * Este servicio transforma textos psicológicos y espirituales
 * en vectores de intención que guían el comportamiento del sistema.
 */

import fs from 'fs';
import path from 'path';
import type { WisdomChunk, PillarName, IntentionVector } from '../types/sophia';

const SOFIA_DIR = path.join(process.cwd(), 'sofia');

export class SophiaWisdomProvider {
  /**
   * Carga todos los archivos de /sofia como WisdomChunks
   * @returns Array de fragmentos de sabiduría con metadatos
   */
  static loadAll(): WisdomChunk[] {
    if (!fs.existsSync(SOFIA_DIR)) {
      console.warn('⚠️ Carpeta /sofia no encontrada. Sistema operará sin brújula moral.');
      return [];
    }

    const files = fs.readdirSync(SOFIA_DIR).filter(f => 
      f.endsWith('.md') || f.endsWith('.txt') || f.endsWith('.json')
    );

    const chunks: WisdomChunk[] = [];

    for (const file of files) {
      try {
        const fullPath = path.join(SOFIA_DIR, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Detectar pilar basado en nombre del archivo or contenido
        const pillar = this.detectPillar(file, content);
        
        // Extraer keywords
        const keywords = this.extractKeywords(content);
        
        // Primer párrafo como excerpt
        const excerpt = this.extractExcerpt(content);

        chunks.push({
          source: file,
          content,
          pillar,
          keywords,
          excerpt
        });
      } catch (err) {
        console.error(`Error leyendo ${file}:`, err);
      }
    }

    return chunks;
  }

  /**
   * Búsqueda semántica por palabra clave en /sofia
   * @param query - Término a buscar
   * @param limit - Máximo de resultados
   * @returns Chunks que coinciden, ordenados por relevancia
   */
  static semanticSearch(query: string, limit = 3): WisdomChunk[] {
    const all = this.loadAll();
    const q = query.toLowerCase().split(/\s+/);

    const scored = all.map(chunk => {
      const text = chunk.content.toLowerCase();
      const matches = q.reduce((acc, word) => {
        const count = (text.match(new RegExp(word, 'g')) || []).length;
        return acc + count;
      }, 0);

      // Bonus si está en keywords
      const keywordBonus = chunk.keywords.some(k => 
        q.some(qword => k.includes(qword))
      ) ? 5 : 0;

      return {
        ...chunk,
        score: matches + keywordBonus
      };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit) as WisdomChunk[];
  }

  /**
   * Buscar por pilar específico
   * @param pillar - PillarName
   * @returns Todos los chunks para ese pilar
   */
  static searchByPillar(pillar: PillarName): WisdomChunk[] {
    return this.loadAll().filter(c => c.pillar === pillar);
  }

  /**
   * Guardar reflexión diaria en /sofia/aprendizaje_diario.md
   * @param reflection - Texto de reflexión
   * @param pillar - Pilar asociado
   * @param source - Fuente (nombre del agente)
   */
  static appendDailyLearning(reflection: string, pillar: PillarName, source?: string) {
    const file = path.join(SOFIA_DIR, 'aprendizaje_diario.md');
    const timestamp = new Date().toISOString();
    const sourceLine = source ? ` [${source}]` : '';
    const entry = `- ${timestamp} — **${pillar.toUpperCase()}**${sourceLine}
  > ${reflection}\n\n`;

    fs.appendFileSync(file, entry, { encoding: 'utf8' });
  }

  /**
   * Obtener estadísticas de sabiduría
   * @returns Resumen de cobertura de pilares
   */
  static getStatistics() {
    const all = this.loadAll();
    const byPillar = all.reduce((acc, c) => {
      if (!acc[c.pillar]) acc[c.pillar] = 0;
      acc[c.pillar]++;
      return acc;
    }, {} as Record<string, number>);

    return {
      total_documents: all.length,
      pillars_covered: Object.keys(byPillar),
      documents_by_pillar: byPillar
    };
  }

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  private static detectPillar(filename: string, content: string): PillarName {
    // Mapear extensión/nombre de archivo a pilar
    const pillarMap: Record<string, PillarName> = {
      'presencia': 'presencia',
      'resiliencia': 'resiliencia',
      'claridad': 'claridad',
      'compasión': 'compasión',
      'compasion': 'compasión',
      'discernimiento': 'discernimiento',
      'paciencia': 'paciencia',
      'integridad': 'integridad',
      'humildad': 'humildad',
      'coherencia': 'coherencia',
      'servicio': 'servicio',
    };

    for (const [key, pillar] of Object.entries(pillarMap)) {
      if (filename.toLowerCase().includes(key)) return pillar;
    }

    // Segunda pasada: buscar en contenido
    for (const [key, pillar] of Object.entries(pillarMap)) {
      if (content.toLowerCase().includes(key)) return pillar;
    }

    // Default: asignar al pilar más frecuente en el sistema
    return 'presencia';
  }

  private static extractKeywords(content: string): string[] {
    // Palabras relevantes (omitiendo stopwords)
    const stopwords = new Set(['el', 'la', 'de', 'a', 'en', 'y', 'o', 'es', 'son', 'una', 'un', 'por', 'para', 'con', 'del']);
    const words = content
      .toLowerCase()
      .split(/[\s\n.,;:!?]+/)
      .filter(w => w.length > 3 && !stopwords.has(w));

    // Frecuencia: palabras más repetidas son más importantes
    const freq: Record<string, number> = {};
    for (const w of words) {
      freq[w] = (freq[w] || 0) + 1;
    }

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([w]) => w);
  }

  private static extractExcerpt(content: string): string {
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    const firstPara = lines.slice(0, 3).join(' ');
    return firstPara.length > 200 ? firstPara.slice(0, 200) + '...' : firstPara;
  }
}

/**
 * SOPHIA ENGINE - Genera insights aligned con la sabiduría
 */
export interface SophiaEngineContext {
  type: PillarName;
  signal: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export class SophiaEngine {
  /**
   * Generar un insight contextual basado en sabiduría
   * @param context - Tipo de problema + señal
   * @returns Insight con mensaje del archivo /sofia
   */
  static generateInsight(context: SophiaEngineContext) {
    const matches = SophiaWisdomProvider.semanticSearch(`${context.type} ${context.signal}`, 3);

    if (!matches || matches.length === 0) {
      return {
        category: context.type,
        message: '🌱 No encontré una conexión directa en tu sabiduría guardada, pero recuerda: ya has atravesado momentos así antes. Respira y continúa.',
        sources: [],
        pillar: context.type,
        confidence: 0.3
      };
    }

    // El mejor match es nuestra fuente de verdad
    const best = matches[0];
    const snippet = best.excerpt || best.content.slice(0, 240);

    // Opcional: agregar contexto de severidad
    let enhancedMessage = snippet;
    if (context.severity === 'critical') {
      enhancedMessage = `🔴 **MOMENTO DE PRUEBA**\n${snippet}`;
    }

    return {
      category: context.type,
      message: enhancedMessage.trim(),
      sources: matches.map(m => m.source),
      pillar: context.type,
      confidence: Math.min(0.95, 0.3 + (matches.length * 0.2)),
      signal_acknowledged: context.signal
    };
  }

  /**
   * Crear vector de intención: transformar pregunta → sabiduría → acción
   */
  static createIntentionVector(query: string): IntentionVector {
    // Detectar cuál pilar necesitamos
    const matches = SophiaWisdomProvider.semanticSearch(query, 5);
    
    if (!matches.length) {
      return {
        query,
        detected_pillar: 'presencia',
        matched_wisdom: [],
        recommended_frequency: 417,
        aligned_message: 'Vuelve al presente. Aquí es donde tienes poder.',
      };
    }

    // El pilar más representado en los matches
    const pillarCounts: Record<string, number> = {};
    for (const m of matches) {
      pillarCounts[m.pillar] = (pillarCounts[m.pillar] || 0) + 1;
    }
    const detected_pillar = Object.entries(pillarCounts)
      .sort((a, b) => b[1] - a[1])[0][0] as PillarName;

    return {
      query,
      detected_pillar,
      matched_wisdom: matches,
      recommended_frequency: 0, // Será asignado desde PillarMetadata
      aligned_message: matches[0].excerpt || matches[0].content.slice(0, 150),
      action_guidance: `Actúa desde el Pilar de la ${detected_pillar.toLowerCase()}.`
    };
  }
}

console.log('🧠 Sophia Wisdom Provider inicializado');
