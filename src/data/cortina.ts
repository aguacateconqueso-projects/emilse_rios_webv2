import type { Lang } from '../i18n/ui';

/**
 * Los textos de la cortina. Salen los dos idiomas a la vez: el de la dirección
 * en grande y el otro debajo, pequeño, porque la cortina no tiene conmutador
 * de idioma — ni nada que pulsar.
 */
export type CortinaCopy = {
  title: string;
  description: string;
  heading: string;
  line: string;
};

export const cortina: Record<Lang, CortinaCopy> = {
  es: {
    title: 'Emilse Ríos · Estamos trabajando en la web',
    description: 'Estamos trabajando en la web de Emilse Ríos. Volvemos muy pronto.',
    heading: 'Estamos trabajando en la web.',
    line: 'Volvemos muy pronto',
  },
  en: {
    title: 'Emilse Ríos · We’re working on the site',
    description: 'We’re working on Emilse Ríos’s website. Back very soon.',
    heading: 'We’re working on the site.',
    line: 'Back very soon',
  },
};
