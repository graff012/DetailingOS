import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Yongoq-Secret, Authorization'
  );

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check / GET verification
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      service: 'DetailingOS Yong‘oq Webhook Gateway',
      message: 'Endpoint is active and ready to receive HTTP POST webhooks from Yong‘oq POS.',
      expected_headers: {
        'Content-Type': 'application/json',
        'X-Yongoq-Secret': 'yq_sec_tashkent_998'
      },
      timestamp: new Date().toISOString()
    });
  }

  // Only POST is accepted for incoming webhook payloads
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: `Method ${req.method} Not Allowed. Please send an HTTP POST request.`
    });
  }

  try {
    const secret = req.headers['x-yongoq-secret'];
    const expectedSecret = process.env.YONGOQ_WEBHOOK_SECRET || 'yq_sec_tashkent_998';

    // Optional secret verification (warns if mismatched, but stays flexible for onboarding)
    if (secret && secret !== expectedSecret) {
      console.warn(`[Yong‘oq Webhook] Secret mismatch: received "${secret}" vs expected "${expectedSecret}"`);
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Invalid X-Yongoq-Secret header.'
      });
    }

    const payload = req.body;

    // Log received webhook payload for debugging in Vercel runtime logs
    console.log('[YONG‘OQ WEBHOOK RECEIVED]', JSON.stringify(payload, null, 2));

    const event = payload?.event || (payload?.sale_id ? 'sale.created' : 'client.created');
    const data = payload?.data || payload;

    // Successfully processed
    return res.status(200).json({
      status: 'success',
      message: 'Webhook received and acknowledged successfully',
      event,
      data_summary: {
        client: data?.full_name || data?.client_name || 'N/A',
        phone: data?.phone || data?.client_phone || 'N/A',
        amount: data?.total_amount || data?.amount || 0,
        currency: data?.currency || 'UZS'
      },
      received_at: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[YONG‘OQ WEBHOOK ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error processing webhook payload',
      error: error?.message || 'Unknown error'
    });
  }
}
