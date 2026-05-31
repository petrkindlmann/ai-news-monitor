'use client';

import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SubscribeForm() {
  const [value, setValue] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (!v) return fail('Enter an email address to subscribe.');
    if (!EMAIL_RE.test(v)) return fail('That doesn’t look like a valid email — check and try again.');
    setInvalid(false);
    setMsg({ text: `You’re on the list. A confirmation is on its way to ${v}.`, ok: true });
    setValue('');
  }
  function fail(text: string) {
    setInvalid(true);
    setMsg({ text, ok: false });
  }

  return (
    <>
      <form className="sub-form" onSubmit={submit} noValidate>
        <input
          type="email"
          placeholder="you@company.com"
          aria-label="Email address"
          autoComplete="email"
          className={invalid ? 'invalid' : undefined}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setInvalid(false);
            if (msg && !msg.ok) setMsg(null);
          }}
        />
        <button className="btn" type="submit">Subscribe</button>
      </form>
      <div className={`sub-msg${msg ? (msg.ok ? ' ok' : ' err') : ''}`} role="status" aria-live="polite">
        {msg?.text ?? ''}
      </div>
    </>
  );
}
