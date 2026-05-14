import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is required');
}

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const MODELS = {
  cheap: 'claude-haiku-4-5-20251001',
  smart: 'claude-sonnet-4-6',
} as const;

export interface AskJsonOpts {
  model: keyof typeof MODELS;
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}

function stripCodeFence(s: string): string {
  return s.replace(/^\s*```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
}

export async function askJson<T = unknown>(opts: AskJsonOpts): Promise<T> {
  const res = await anthropic.messages.create({
    model: MODELS[opts.model],
    max_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature ?? 0.4,
    system: opts.system,
    messages: [{ role: 'user', content: opts.user }],
  });
  const text = res.content
    .filter((c): c is Anthropic.TextBlock => c.type === 'text')
    .map(c => c.text)
    .join('');
  const cleaned = stripCodeFence(text);
  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    throw new Error(`Model did not return valid JSON. First 500 chars:\n${cleaned.slice(0, 500)}`);
  }
}
