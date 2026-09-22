import type { Request, Response } from 'express';

const ONEMAP_AUTH_URL = 'https://www.onemap.gov.sg/api/auth/post/getToken';
const ONEMAP_SEARCH_URL = 'https://www.onemap.gov.sg/api/common/elastic/search';
const ONEMAP_REVGEOCODE_URL = 'https://www.onemap.gov.sg/api/public/revgeocode';
const ONEMAP_ROUTE_URL = 'https://www.onemap.gov.sg/api/public/routingsvc/route';

interface CachedToken {
  token: string;
  expiresAt: number; // epoch timestamp in ms
}

// In-memory cache for OneMap token (lasts 3 days)
let cachedToken: CachedToken | null = null;

/**
 * Retrieves a valid OneMap token from cache, env, or mints a new one.
 */
export async function getOrMintOneMapToken(
  req?: Request,
  overrideEmail?: string,
  overridePassword?: string
): Promise<{ token: string | null; error?: string; source: 'env' | 'cache' | 'minted' | 'none' }> {
  // 1. Direct token in request header
  const authHeader = req?.headers['authorization'];
  if (authHeader && authHeader.trim() !== '') {
    const rawToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
    if (rawToken) {
      return { token: rawToken, source: 'env' };
    }
  }

  const customHeaderToken = (req?.headers['x-onemap-token'] as string)?.trim();
  if (customHeaderToken) {
    return { token: customHeaderToken, source: 'env' };
  }

  // 2. Direct token in environment variable
  const envToken = process.env.ONEMAP_TOKEN?.trim();
  if (envToken) {
    return { token: envToken, source: 'env' };
  }

  // 3. Check memory cache (valid if more than 5 minutes before expiry)
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 5 * 60 * 1000) {
    return { token: cachedToken.token, source: 'cache' };
  }

  // 4. Mint new token using email & password
  const email = overrideEmail || process.env.ONEMAP_EMAIL?.trim();
  const password = overridePassword || process.env.ONEMAP_PASSWORD?.trim();

  if (email && password) {
    try {
      const resp = await fetch(ONEMAP_AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await resp.json()) as {
        access_token?: string;
        expiry_timestamp?: string;
        error?: string;
      };

      if (!resp.ok || !data.access_token) {
        return {
          token: null,
          error: data.error || `Authentication failed with status ${resp.status}`,
          source: 'none',
        };
      }

      // OneMap tokens typically last 3 days (approx 72 hours)
      let expiresAtMs = now + 3 * 24 * 60 * 60 * 1000;
      if (data.expiry_timestamp) {
        const parsed = Date.parse(data.expiry_timestamp);
        if (!isNaN(parsed) && parsed > now) {
          expiresAtMs = parsed;
        }
      }

      cachedToken = {
        token: data.access_token,
        expiresAt: expiresAtMs,
      };

      return { token: data.access_token, source: 'minted' };
    } catch (err) {
      return {
        token: null,
        error: (err as Error).message || 'Failed to contact OneMap auth service',
        source: 'none',
      };
    }
  }

  return { token: null, source: 'none' };
}

/**
 * Token endpoint: POST /api/onemap/token (mints or checks token)
 */
export async function handleOneMapToken(req: Request, res: Response) {
  try {
    const { email, password } = req.body || {};
    const tokenResult = await getOrMintOneMapToken(req, email, password);

    if (!tokenResult.token) {
      return res.status(200).json({
        success: false,
        hasToken: false,
        source: tokenResult.source,
        message:
          tokenResult.error ||
          'No OneMap credentials found. Configure ONEMAP_EMAIL and ONEMAP_PASSWORD or ONEMAP_TOKEN in .env',
        docUrl: 'https://www.onemap.gov.sg/apidocs/',
      });
    }

    return res.status(200).json({
      success: true,
      hasToken: true,
      source: tokenResult.source,
      expiresAt: cachedToken ? new Date(cachedToken.expiresAt).toISOString() : null,
      message: 'OneMap token is active and ready for routing, search, and reverse geocoding.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to process OneMap token request',
      message: (error as Error).message,
    });
  }
}

/**
 * Search endpoint: GET /api/onemap/search?searchVal=...&pageNum=1
 */
export async function handleOneMapSearch(req: Request, res: Response) {
  try {
    const searchVal = (req.query.searchVal || req.query.q || '') as string;
    const pageNum = req.query.pageNum || '1';
    const returnGeom = req.query.returnGeom || 'Y';
    const getAddrDetails = req.query.getAddrDetails || 'Y';

    if (!searchVal || searchVal.trim() === '') {
      return res.status(200).json({
        success: true,
        found: 0,
        totalNumPages: 0,
        pageNum: 1,
        results: [],
      });
    }

    const { token } = await getOrMintOneMapToken(req);

    const url = new URL(ONEMAP_SEARCH_URL);
    url.searchParams.set('searchVal', searchVal.trim());
    url.searchParams.set('returnGeom', String(returnGeom));
    url.searchParams.set('getAddrDetails', String(getAddrDetails));
    url.searchParams.set('pageNum', String(pageNum));

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    return res.status(200).json({
      success: true,
      hasAuth: Boolean(token),
      found: data.found || 0,
      totalNumPages: data.totalNumPages || 0,
      pageNum: Number(pageNum),
      results: data.results || [],
      warning: data.error || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to search OneMap',
      message: (error as Error).message,
    });
  }
}

/**
 * Reverse Geocode endpoint: GET /api/onemap/revgeocode?location=1.3,103.8&buffer=40&addressType=All
 */
export async function handleOneMapRevGeocode(req: Request, res: Response) {
  try {
    let location = (req.query.location as string) || '';
    const lat = req.query.lat as string;
    const lng = req.query.lng as string;
    if (!location && lat && lng) {
      location = `${lat},${lng}`;
    }

    const buffer = req.query.buffer || '40';
    const addressType = req.query.addressType || 'All';

    if (!location || !location.includes(',')) {
      return res.status(400).json({
        success: false,
        error: 'Parameter location (lat,lng) is required. E.g. location=1.3048,103.8318',
      });
    }

    const { token, error } = await getOrMintOneMapToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'OneMap authentication token required for reverse geocoding.',
        details: error || 'Please configure ONEMAP_EMAIL and ONEMAP_PASSWORD or ONEMAP_TOKEN.',
        docUrl: 'https://www.onemap.gov.sg/apidocs/',
      });
    }

    const url = new URL(ONEMAP_REVGEOCODE_URL);
    url.searchParams.set('location', location);
    url.searchParams.set('buffer', String(buffer));
    url.searchParams.set('addressType', String(addressType));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: token,
        Accept: 'application/json',
      },
    });

    const data = await response.json();
    return res.status(response.status).json({
      success: response.ok,
      status: response.status,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to reverse geocode via OneMap',
      message: (error as Error).message,
    });
  }
}

/**
 * Routing endpoint: GET /api/onemap/route?start=1.320981,103.844150&end=1.326762,103.8559&routeType=drive
 */
export async function handleOneMapRoute(req: Request, res: Response) {
  try {
    const start = (req.query.start as string) || '';
    const end = (req.query.end as string) || '';
    const routeType = (req.query.routeType as string) || 'drive';

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        error: 'Parameters "start" and "end" are required (e.g. start=1.3048,103.8318&end=1.2834,103.8607)',
      });
    }

    const { token, error } = await getOrMintOneMapToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'OneMap authentication token required for routing service.',
        details: error || 'Please configure ONEMAP_EMAIL and ONEMAP_PASSWORD or ONEMAP_TOKEN.',
        docUrl: 'https://www.onemap.gov.sg/apidocs/',
      });
    }

    const url = new URL(ONEMAP_ROUTE_URL);
    url.searchParams.set('start', start);
    url.searchParams.set('end', end);
    url.searchParams.set('routeType', routeType);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: token,
        Accept: 'application/json',
      },
    });

    const data = await response.json();
    return res.status(response.status).json({
      success: response.ok,
      status: response.status,
      routeType,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate route via OneMap',
      message: (error as Error).message,
    });
  }
}
