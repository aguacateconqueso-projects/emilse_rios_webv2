/**
 * Escribe la siembra de `supabase/migrations/0013_newsletters.sql` —las seis
 * entradas del anexo del pedido de SEO de Emi— a partir de
 * `src/data/newsletters-anexo.ts`, para que la migración y lo que enseña la
 * web sin ella digan lo mismo.
 *
 *   npx tsx scripts/semilla-newsletters.mts > /tmp/semilla.sql
 *
 * Solo hizo falta una vez (11 oct 2026); se queda por si hay que rehacerla.
 */
import { ANEXO } from '../src/data/newsletters-anexo.ts';

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
const arr = (xs: string[], tipo: 'uuid' | 'text') => (xs.length ? `array[${xs.map(q).join(', ')}]::${tipo}[]` : `'{}'::${tipo}[]`);

/* Mismo día —el de pegar la migración, en Madrid— y, dentro del día, la 1
   creada antes que la 2 y la 2 antes que la 3: el índice las pone 3, 2, 1. */
const filas = ANEXO.map((n) => {
  const orden = Number(n.id.slice(-1));
  return `  (${[
    q(n.id),
    q(n.lang),
    q(n.slug),
    q(n.titulo),
    q(n.cuerpo),
    q(n.firma),
    q(n.pd),
    q(n.pd2),
    q(n.pd3),
    arr(n.relacionadas, 'uuid'),
    n.traduccion ? `${q(n.traduccion)}::uuid` : 'null',
    q(n.titulo_google),
    q(n.meta),
    q(n.extracto),
    `(now() at time zone 'Europe/Madrid')::date`,
    arr(n.slugs_anteriores, 'text'),
    `now() - interval '${4 - orden} seconds'`,
  ].join(',\n    ')})`;
});

console.log(`insert into public.newsletters
  (id, lang, slug, titulo, cuerpo, firma, pd, pd2, pd3, relacionadas, traduccion,
   titulo_google, meta, extracto, fecha, slugs_anteriores, created_at)
values
${filas.join(',\n')}
on conflict (id) do nothing;`);
