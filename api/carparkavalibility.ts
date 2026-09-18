import type { Request, Response } from 'express';

const LTA_CARPARK_API_URL = 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';

export default async function handler(req: Request, res: Response) {
  try {
    // Retrieve API key from server environment variable or request headers (never hardcoded)
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

    // Support pagination if $skip or skip is requested
    const skip = req.query.$skip || req.query.skip;
    const url = new URL(LTA_CARPARK_API_URL);
    if (skip) {
      url.searchParams.set('$skip', String(skip));
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
      odataMetadata: data['odata.metadata'],
      totalFetched: Array.isArray(data.value) ? data.value.length : 0,
      value: data.value || [],
    });
  } catch (error) {
    console.error('Error fetching LTA carpark availability:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to connect to LTA DataMall service',
      message: (error as Error).message,
    });
  }
}
