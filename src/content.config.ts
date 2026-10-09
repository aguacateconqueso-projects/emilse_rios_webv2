import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Las entradas del newsletter: `/newsletter/` y `/en/newsletter/`.
 *
 * **Desde el 9 oct 2026.** Emi mandó las tres primeras —correos suyos que
 * quiere en la web, con el bloque del newsletter arriba y sus dos posdatas
 * abajo—. Un fichero Markdown por entrada y por idioma, en
 * `src/content/entradas/`: `<orden>-<nombre>.<idioma>.md`. Para publicar
 * otra basta con dejar caer sus dos ficheros: no hay que tocar código. Las
 * dos posdatas y los dos campos del newsletter los pone la página
 * (`src/components/Entrada.astro`), no el fichero.
 *
 * Hasta ese día esta colección era `correos`, el archivo de la Home con tres
 * correos de muestra que nunca se publicaron (salió de la Home el 21 sep).
 */
const entradas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entradas' }),
  schema: z.object({
    lang: z.enum(['es', 'en']),
    /** La misma entrada en el otro idioma lleva el mismo `par`. */
    par: z.string(),
    /** El orden en la portada del newsletter, de menor a mayor. */
    orden: z.number().int(),
    /** El final de su dirección: `/newsletter/<direccion>/`. */
    direccion: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    /** El título: lo que alguien escribiría en el buscador (pedido de Emi). */
    titulo: z.string(),
    /** Una línea: la de la portada del newsletter y la de los buscadores. */
    descripcion: z.string(),
    /** Traducida por nosotros, no escrita por Emi: que la revise. */
    traducida: z.boolean().default(false),
  }),
});

export const collections = { entradas };
