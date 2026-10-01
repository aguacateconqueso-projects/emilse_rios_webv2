/**
 * Los correos que manda el sitio, por Resend. **Solo de servidor.**
 *
 * Trasplantado de `emilse_rios_membresias` (`src/lib/email.ts`) el 27 sep
 * 2026, el día que la membresía se mudó entera a esta casa. Manda tres: la
 * bienvenida de quien acaba de pagar la membresía, con el enlace para poner su
 * contraseña (ver `bienvenida.ts`), y desde el 1 oct 2026 los dos avisos de
 * las preguntas —a Emi cuando alguien pregunta, al alumno cuando Emi
 * responde— (ver `/api/avisos`).
 *
 * **El remitente sigue siendo `info@emilseriosacademy.com`**, y no es un
 * olvido: Resend solo manda desde un dominio verificado por DNS, y el
 * verificado es el de la academia. Verificarlo depende de los registros del
 * dominio, no de dónde viva la web, así que sigue sirviendo aunque
 * `emilseriosacademy.com` ya solo redirija. El buzón de verdad de Emi,
 * `info@emilserios.com`, va como `reply_to`: si alguien contesta, le llega a
 * ella. El día que `emilserios.com` esté verificado en Resend, se cambia
 * `RESEND_FROM` en Vercel y listo.
 *
 * Variables (se copian del proyecto de la academia): `RESEND_API_KEY` y,
 * opcional, `RESEND_FROM`. Sin la clave no se manda nada por acá y el webhook
 * cae al correo estándar de Supabase.
 */
const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
const RESEND_FROM = process.env.RESEND_FROM?.trim() || 'Emilse Rios <info@emilseriosacademy.com>';

export const hayResend = Boolean(RESEND_API_KEY);

/** El buzón real de Emi, para las respuestas. */
export const RESPONDER_A = 'info@emilserios.com';

/**
 * Adónde le llega a Emi el aviso de una pregunta nueva. Por defecto, su buzón
 * de siempre; si un día lo quiere en otro, `AVISOS_A` en Vercel (Production).
 */
export const AVISOS_A = process.env.AVISOS_A?.trim() || RESPONDER_A;

/** Manda un correo. No lanza: devuelve `{ error }` si algo falla. */
export async function mandarCorreo(o: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<{ error: Error | null }> {
  if (!RESEND_API_KEY) return { error: new Error('Falta RESEND_API_KEY') };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: o.to,
        subject: o.subject,
        html: o.html,
        text: o.text,
        ...(o.replyTo ? { reply_to: o.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const detalle = await res.text().catch(() => '');
      return { error: new Error(`Resend HTTP ${res.status}: ${detalle}`) };
    }
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
}

/**
 * La bienvenida a la membresía. **El copy es el definitivo de Emi**, el mismo
 * que mandaba la academia, palabra por palabra. Lo único que cambió el 27 sep
 * 2026 son las direcciones —la del texto del enlace, que era
 * `emilseriosacademy.com/entrar/`— y la ropa, que pasó a la del sitio: papel y
 * tinta, a escuadra, en serif. Sigue siendo una carta, sin botón.
 *
 * `enlace` es el de un solo uso que lleva a poner la contraseña; `rotulo` es
 * lo que se lee, la puerta del aula.
 */
export function correoBienvenida(
  lang: 'es' | 'en',
  enlace: string,
  rotulo: string,
): { subject: string; html: string; text: string } {
  const en = lang === 'en';
  const t = en
    ? {
        subject: 'Your access to the membership',
        preheader: 'Save this email — your key lives here.',
        p: ['Welcome.', 'This is your link to the platform:'],
        p2: 'There you create your username and password. That access is personal — keep it safe, like your bass.',
        p3: 'Every Thursday a new exercise is waiting for you.',
        p4: 'But you can enter any time: to review the exercise, watch the core concept of the month, or leave me your questions in the chat. I answer them personally.',
        p5: 'See you inside.',
        sign: 'Emilse',
        ps1: 'PS: If something doesn’t work or you have any question, write to info@emilserios.com and it comes straight to me.',
        ps2: 'PS2: A gift is waiting for you on the platform. A bonus I recorded so you can get more out of each exercise. I hope you enjoy it.',
      }
    : {
        subject: 'Tu acceso a la membresía',
        preheader: 'Guarda este correo — aquí vive tu entrada.',
        p: ['Bienvenido/a.', 'Este es tu link de acceso a la plataforma:'],
        p2: 'Ahí creas tu usuario y contraseña. Ese acceso es personal, cuídalo como tu contrabajo.',
        p3: 'Cada jueves te espera el ejercicio nuevo.',
        p4: 'Pero puedes entrar cuando quieras: para repasar el ejercicio, ver el concepto base del mes o dejarme tus preguntas en el chat. Las respondo personalmente.',
        p5: 'Nos vemos dentro.',
        sign: 'Emilse',
        ps1: 'PD: Si algo no funciona o tienes cualquier duda, escribe a info@emilserios.com y me llega directo a mí.',
        ps2: 'PD2: En la plataforma te espera un regalo. Un bonus que grabé para que le saques más jugo a cada ejercicio. Espero que lo disfrutes.',
      };

  const P = 'margin:0 0 16px;font-size:17px;line-height:1.6;color:#0d0d0d;';
  const PD = 'margin:0 0 8px;font-size:14px;line-height:1.55;color:#5c5c5b;font-style:italic;';

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;background:#fafaf8;color:#0d0d0d;font-family:Georgia,'Times New Roman',serif;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${t.preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fafaf8;border:1px solid #0d0d0d;">
        <tr><td style="padding:40px;">
          <p style="margin:0 0 32px;font-family:'Courier New',monospace;letter-spacing:0.12em;text-transform:uppercase;font-size:12px;color:#5c5c5b;">Emilse Rios · ${en ? 'Membership' : 'Membresía'}</p>
          <p style="${P}">${t.p[0]}</p>
          <p style="${P}margin-bottom:8px;">${t.p[1]}</p>
          <p style="${P}margin-bottom:24px;"><a href="${enlace}" style="color:#0d0d0d;text-decoration:underline;">${rotulo}</a></p>
          <p style="${P}margin-bottom:24px;">${t.p2}</p>
          <p style="${P}">${t.p3}</p>
          <p style="${P}margin-bottom:24px;">${t.p4}</p>
          <p style="${P}margin-bottom:4px;">${t.p5}</p>
          <p style="${P}margin-bottom:32px;font-style:italic;">${t.sign}</p>
          <p style="${PD}">${t.ps1}</p>
          <p style="${PD}margin-bottom:0;">${t.ps2}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `${t.p[0]}
${t.p[1]}
${enlace}

${t.p2}

${t.p3}
${t.p4}

${t.p5}
${t.sign}

${t.ps1}
${t.ps2}`;

  return { subject: t.subject, html, text };
}

/* ==========================================================================
   Los avisos de las preguntas (1 oct 2026)

   Pedido de Adrián: «cuando alguien haga una pregunta, que le llegue un mail
   a Emi, y cuando Emi responda, que le llegue un aviso a quien preguntó». Los
   manda `/api/avisos`. Llevan la misma ropa que la bienvenida: papel, tinta,
   a escuadra y en serif.

   **El copy es provisional**, escrito acá en la voz de Emi —en primera
   persona, como todo lo que le habla al alumno—. Si Emi manda el suyo, se
   cambia en estas dos funciones y nada más.
   ========================================================================== */

/** Lo que escribe un alumno entra como texto, nunca como HTML. */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Los párrafos de un texto largo, con sus saltos de línea. */
const parrafos = (s: string, estilo: string) =>
  s
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="${estilo}">${esc(p).replace(/\n/g, '<br />')}</p>`)
    .join('\n          ');

const recorta = (s: string, n: number) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);

/** El marco común: la carta de papel con su rótulo arriba. */
function carta(lang: 'es' | 'en', rotulo: string, preheader: string, cuerpo: string): string {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;background:#fafaf8;color:#0d0d0d;font-family:Georgia,'Times New Roman',serif;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fafaf8;border:1px solid #0d0d0d;">
        <tr><td style="padding:40px;">
          <p style="margin:0 0 32px;font-family:'Courier New',monospace;letter-spacing:0.12em;text-transform:uppercase;font-size:12px;color:#5c5c5b;">${esc(rotulo)}</p>
          ${cuerpo}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const P = 'margin:0 0 16px;font-size:17px;line-height:1.6;color:#0d0d0d;';
const CITA = 'margin:0 0 16px;font-size:17px;line-height:1.6;color:#0d0d0d;font-style:italic;';
const DATO = "margin:0 0 4px;font-family:'Courier New',monospace;font-size:13px;line-height:1.5;color:#5c5c5b;";

/**
 * A Emi: alguien le dejó una pregunta. **Siempre en español**, como el panel.
 * No es Emi la que habla, es el aula avisándole a ella: por eso el «te».
 *
 * `enlace` lleva a la conversación con esa persona en el panel
 * (`/panel/#mensajes/<id>`), que es donde se responde. El correo no tiene
 * `reply_to` del alumno a propósito: si Emi contestara desde el correo, la
 * respuesta no quedaría en el aula y el alumno no la vería ahí.
 */
export function correoPreguntaNueva(o: {
  nombre: string;
  correo: string | null;
  donde: string;
  detalle: string[];
  pregunta: string;
  enlace: string;
}): { subject: string; html: string; text: string } {
  const quien = o.correo && o.correo !== o.nombre ? `${o.nombre} (${o.correo})` : o.nombre;
  const subject = `Nueva pregunta de ${o.nombre} · ${o.donde}`;
  const cuerpo = `<p style="${P}">${esc(quien)} te dejó una pregunta.</p>
          <p style="${DATO}">${esc(o.donde)}</p>
          ${o.detalle.map((d) => `<p style="${DATO}">${esc(d)}</p>`).join('\n          ')}
          <div style="margin:24px 0;padding-left:16px;border-left:2px solid #0d0d0d;">
          ${parrafos(o.pregunta, CITA)}
          </div>
          <p style="${P}margin-bottom:0;"><a href="${o.enlace}" style="color:#0d0d0d;text-decoration:underline;">Responder en el panel →</a></p>`;
  const html = carta('es', 'Emilse Rios · Aviso del aula', `${o.nombre}: ${recorta(o.pregunta, 90)}`, cuerpo);
  const text = `${quien} te dejó una pregunta.

${[o.donde, ...o.detalle].join('\n')}

${o.pregunta}

Responder en el panel: ${o.enlace}`;
  return { subject, html, text };
}

/**
 * Al alumno: Emi le respondió. En su idioma y **en primera persona**: la que
 * escribe es Emi. Cita la pregunta, para que sepa cuál, y no la respuesta: la
 * respuesta vive en el aula —puede ser un audio o un video— y ahí se lee.
 */
export function correoRespuesta(
  lang: 'es' | 'en',
  o: { nombre: string | null; donde: 'membresia' | 'curso'; curso?: string; pregunta: string; enlace: string },
): { subject: string; html: string; text: string } {
  const en = lang === 'en';
  const donde = en
    ? o.donde === 'membresia'
      ? 'the membership'
      : `the course “${o.curso ?? ''}”`
    : o.donde === 'membresia'
      ? 'la membresía'
      : `el curso «${o.curso ?? ''}»`;
  const t = en
    ? {
        subject: 'I answered your question',
        rotulo: o.donde === 'membresia' ? 'Emilse Rios · Membership' : 'Emilse Rios · Classroom',
        hola: o.nombre ? `Hi, ${o.nombre}:` : 'Hi:',
        p1: `I answered the question you left me in ${donde}:`,
        p2: 'My answer is waiting for you in the classroom:',
        boton: 'Read my answer',
        p3: 'If something is still unclear, ask me right there.',
        sign: 'Emilse',
      }
    : {
        subject: 'Ya te respondí',
        rotulo: o.donde === 'membresia' ? 'Emilse Rios · Membresía' : 'Emilse Rios · Aula',
        hola: o.nombre ? `Hola, ${o.nombre}:` : 'Hola:',
        p1: `Ya te respondí la pregunta que me dejaste en ${donde}:`,
        p2: 'Mi respuesta te espera en el aula:',
        boton: 'Ver mi respuesta',
        p3: 'Si algo te sigue sin quedar claro, pregúntame por ahí mismo.',
        sign: 'Emilse',
      };
  const cita = recorta(o.pregunta, 400);
  const cuerpo = `<p style="${P}">${esc(t.hola)}</p>
          <p style="${P}">${esc(t.p1)}</p>
          <div style="margin:0 0 24px;padding-left:16px;border-left:2px solid #0d0d0d;">
          ${parrafos(cita, CITA)}
          </div>
          <p style="${P}margin-bottom:8px;">${esc(t.p2)}</p>
          <p style="${P}margin-bottom:24px;"><a href="${o.enlace}" style="color:#0d0d0d;text-decoration:underline;">${esc(t.boton)} →</a></p>
          <p style="${P}">${esc(t.p3)}</p>
          <p style="${P}margin-bottom:0;font-style:italic;">${t.sign}</p>`;
  const html = carta(lang, t.rotulo, t.p1, cuerpo);
  const text = `${t.hola}

${t.p1}

${cita}

${t.p2}
${o.enlace}

${t.p3}

${t.sign}`;
  return { subject: t.subject, html, text };
}
