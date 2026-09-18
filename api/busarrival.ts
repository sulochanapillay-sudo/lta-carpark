import type { Request, Response } from 'express';

const LTA_BUS_ARRIVAL_API_URL = 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival';

export default async function handler(req: Request, res: Response) {
  try {
    const accountKey =
      process.env.LTA_ACCOUNT_KEY ||
      (req.headers['accountkey'] as string) ||
      (req.headers['x-account-key'] as string);

    if (!accountKey || accountKey.trim() === '') {
      return res.status(401).json({
        success: false,
        error: 'LTA_ACCOUNT_KEY is not configured.',
        message:
          'Please configure the LTA_ACCOUNT_KEY environment variable in your project settings, or pass the AccountKey header with your request.',
        docUrl: 'https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html',
        configured: false,
      });
    }

    const busStopCode = (req.query.BusStopCode || req.query.busStopCode || '83139') as string;
    const serviceNo = (req.query.ServiceNo || req.query.serviceNo) as string | undefined;

    const url = new URL(LTA_BUS_ARRIVAL_API_URL);
    url.searchParams.set('BusStopCode', busStopCode);
    if (serviceNo) {
      url.searchParams.set('ServiceNo', serviceNo);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        AccountKey: accountKey.trim(),
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        success: false,
        status: response.status,
        statusText: response.statusText,
        error: `LTA DataMall API responded with status ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      busStopCode,
      services: data.Services || [],
      rawData: data,
    });
  } catch (error) {
    console.error('Error fetching LTA bus arrival:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to connect to LTA DataMall bus arrival service',
      message: (error as Error).message,
    });
  }
}
