import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    const hasKey = Boolean(process.env.LTA_ACCOUNT_KEY || req.headers['accountkey']);
    res.status(200).json({
      status: 'ok',
      service: 'LTA Singapore DataMall API Bridge',
      timestamp: new Date().toISOString(),
      ltaAccountKeyConfigured: hasKey,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: (error as Error).message,
    });
  }
}
