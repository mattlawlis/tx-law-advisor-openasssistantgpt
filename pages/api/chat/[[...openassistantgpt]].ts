// pages/api/chat/[[...openassistantgpt]].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Request } from 'node-fetch';
import { TextDecoder } from 'util';
import { OpenAssistantGPT } from '@openassistantgpt/assistant';

// Instantiate the SDK handler for Pages API (req,res)
const sdkHandler = new OpenAssistantGPT('/api/chat/').handler;

// Cost estimator: 1 credit per 1 000 characters (adjust as needed)
function estimateCost(prompt: string): number {
  return Math.ceil(prompt.length / 1000);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1) Build Basic Auth header
  const user = process.env.WP_APP_USER!;
  const pass = process.env.WP_APP_PASS!;
  const auth = Buffer.from(`${user}:${pass}`).toString('base64');
  const headers = { Authorization: `Basic ${auth}` };

  // 2) Balance check
  const balRes = await fetch(`${process.env.WP_URL}/wp-json/tlas/v1/balance`, { headers });
  if (!balRes.ok) {
    return res.status(balRes.status).send('Balance check failed');
  }
  const { balance } = await balRes.json();

  // 3) Compute cost
  const body          = (req.body as any) || {};
  const messagesArray = Array.isArray(body.messages) ? body.messages : [];
  const promptText    = messagesArray.map((m: any) => m.content).join(' ');
  const cost          = estimateCost(promptText);
  if (balance < cost) {
    return res.status(402).json({ error: 'Insufficient credits' });
  }

  // 4) Make req.url absolute in both dev & prod
  let fullUrl: string;
  if (process.env.NODE_ENV === 'development' && process.env.BASE_URL) {
    fullUrl = new URL(req.url!, process.env.BASE_URL).toString();
  } else {
    const proto = (req.headers['x-forwarded-proto'] as string) ?? 'https';
    const host  = req.headers.host!;
    fullUrl      = `${proto}://${host}${req.url}`;
  }
  (req as any).url = fullUrl;

  // 5) Create a Web Request for the SDK
  const sdkRequest = new Request(fullUrl, {
    method: req.method,
    headers: req.headers as any,
    body: JSON.stringify(body),
  });

  // 6) Stream AI response via manual piping
  const aiResponse = await sdkHandler(sdkRequest, res);
  // Convert web Response headers to Node.js format and write head
  const headersObj: Record<string, string> = {};
  aiResponse.headers.forEach((value, key) => {
    headersObj[key] = value;
  });
  res.writeHead(aiResponse.status, headersObj);
  // Pipe the body stream
  const reader = aiResponse.body!.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    res.write(decoder.decode(value));
  }
  res.end();

  // 7) Fire‑and‑forget debit
  fetch(`${process.env.WP_URL}/wp-json/tlas/v1/debit`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Basic ${auth}`
    },
    body: JSON.stringify({ amount: cost })
  }).catch(console.error);
}