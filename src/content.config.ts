import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * El archivo del newsletter. Un fichero Markdown por correo y por idioma,
 * nombrado `<numero>.<idioma>.md` — por ejemplo `042.es.md`.
 *
 * Para publicar un correo nuevo basta con dejar caer el fichero acá: no hay
 * que tocar código.
 */
const correos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/correos' }),
  schema: z.object({
    /** Número del correo. Ordena el archivo, de mayor a menor. */
    numero: z.number().int().positive(),
    lang: z.enum(['es', 'en']),
    /** Etiqueta que se ve en la ficha: «N.º 42» / «No. 42». */
    etiqueta: z.string(),
    asunto: z.string(),
    /** Primera línea que se lee en la ficha, antes de abrirlo. */
    adelanto: z.string(),
    fecha: z.coerce.date().optional(),
    /** Marca los correos de muestra, pendientes de sustituir por los reales. */
    borrador: z.boolean().default(false),
  }),
});

export const collections = { correos };
