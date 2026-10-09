import { getCollection, type CollectionEntry } from 'astro:content';
import { type Lang, routePath } from '../i18n/ui';

/**
 * Las entradas del newsletter (`src/content/entradas/`), por idioma y en su
 * orden. Ver `src/content.config.ts`.
 */
export type Entrada = CollectionEntry<'entradas'>;

export async function entradasDe(lang: Lang): Promise<Entrada[]> {
  const todas = await getCollection('entradas', ({ data }) => data.lang === lang);
  return todas.sort((a, b) => a.data.orden - b.data.orden);
}

/** La dirección de una entrada: `/newsletter/<direccion>/`. */
export const entradaPath = (e: Entrada): string => `${routePath('newsletter', e.data.lang)}${e.data.direccion}/`;

/**
 * La misma entrada en el otro idioma, para el conmutador y los `hreflang`.
 * Sin traducción, la portada del newsletter en ese idioma.
 */
export async function gemela(e: Entrada): Promise<string> {
  const otro: Lang = e.data.lang === 'es' ? 'en' : 'es';
  const par = (await entradasDe(otro)).find((x) => x.data.par === e.data.par);
  return par ? entradaPath(par) : routePath('newsletter', otro);
}
