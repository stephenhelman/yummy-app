import type { ApplicationData } from '../form/types';
import type { Lang } from '../i18n/types';

const APP_VERSION = '1.0.0';

interface SubmitOptions {
  language: Lang;
  /** Value of the hidden honeypot input; real applicants leave it empty. */
  honeypot: string;
  /** Epoch ms when the applicant first pressed Start. */
  startedAt: number | null;
}

interface ScriptReply {
  ok?: boolean;
  error?: string;
}

/**
 * POSTs the application to the Apps Script web app.
 * text/plain keeps this a "simple" request, so the browser skips the CORS preflight Apps Script can't answer.
 * Resolves when the script confirms, or when the request went through but the reply can't be read.
 * Rejects on a network failure, an HTTP error, or an explicit { ok: false }.
 */
export async function submitApplication(data: ApplicationData, options: SubmitOptions): Promise<void> {
  const url = import.meta.env.VITE_APPS_SCRIPT_URL;
  if (!url) throw new Error('VITE_APPS_SCRIPT_URL is not set');

  const submittedAt = new Date();
  const body = JSON.stringify({
    ...data,
    signature: { ...data.signature, signedAt: submittedAt.toISOString() },
    meta: {
      language: options.language,
      submittedAt: submittedAt.toISOString(),
      appVersion: APP_VERSION,
      website: options.honeypot,
      elapsedMs: options.startedAt === null ? 0 : submittedAt.getTime() - options.startedAt,
    },
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
  });

  if (response.type === 'opaque') return;
  if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);

  let reply: ScriptReply;
  try {
    reply = (await response.json()) as ScriptReply;
  } catch {
    return;
  }
  if (reply.ok === false) throw new Error(reply.error ?? 'Submission rejected');
}
