import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import {
  initDb,
  getMaintenanceConfig,
  updateMaintenanceConfig,
  updateAllMaintenanceConfig,
} from './db';

const app = express();
const port = process.env.PORT || 3000;

// 🛡️ Sentinel: Disable Express framework leakage
app.disable('x-powered-by');

// 🛡️ Sentinel: Trust proxy to ensure correct IP extraction (e.g. req.ip) when deployed behind Vercel.
app.set('trust proxy', 1);

// 🛡️ Sentinel: Add security headers to protect against common web vulnerabilities
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'"
  );
  next();
});

// 🔒 Sentinel: Limit request body size
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Maintenance Mode Configuration
let MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true';
const EMERGENCY_LOCKDOWN = process.env.EMERGENCY_LOCKDOWN === 'true';

// Initialize DB and load maintenance state
initDb()
  .then(async () => {
    const config = await getMaintenanceConfig();
    if (config['global'] && process.env.MAINTENANCE_MODE === undefined) {
      MAINTENANCE_MODE = config['global'] === 'true';
    }
  })
  .catch((err) => {
    console.error('Failed to initialize database', err);
  });

// 🛡️ Sentinel: Emergency lockdown circuit breaker
app.use((req: Request, res: Response, next: NextFunction) => {
  if (EMERGENCY_LOCKDOWN) {
    res.status(503).type('text/plain').send('503 Service Unavailable: SYSTEM LOCKDOWN IN EFFECT.');
    return;
  }
  next();
});

// ⚡ Bolt: Pre-calculate static asset paths
const MAINTENANCE_PATH = path.join(__dirname, 'public', 'maintenance.html');
const NOT_FOUND_PATH = path.join(__dirname, 'public', '404.html');

// Serve Maintenance page if global maintenance mode is enabled
app.use((req: Request, res: Response, next: NextFunction) => {
  if (MAINTENANCE_MODE) {
    if (req.path.startsWith('/api/') || req.path === '/admin') {
      return next();
    }
    res.status(503).sendFile(MAINTENANCE_PATH, (err) => {
      if (err) {
        if (!res.headersSent) {
          res
            .status(503)
            .type('text/plain')
            .send('503 Service Unavailable: Site under maintenance.');
        } else {
          res.end();
        }
      }
    });
    return;
  }
  next();
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || crypto.randomBytes(32).toString('hex');
const adminAuthHash = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest();

const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest();
    if (crypto.timingSafeEqual(tokenHash, adminAuthHash)) {
      next();
      return;
    }
    res.status(401).json({ error: 'Unauthorized' });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// 🛡️ Sentinel: Rate limit admin login attempts globally
const loginAttempts = new Map<string, { count: number; lockUntil: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

const adminRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  // 🛡️ Sentinel: Secure memory leak prevention without bypassing rate limits
  if (loginAttempts.size > 1000) {
    for (const [key, value] of loginAttempts.entries()) {
      if (value.lockUntil > 0 && value.lockUntil <= now) {
        loginAttempts.delete(key);
      } else if (value.lockUntil === 0 && now - value.lastAttempt > LOCK_TIME_MS) {
        loginAttempts.delete(key);
      }
    }

    if (loginAttempts.size > 1000 && !loginAttempts.has(ip)) {
      res
        .status(503)
        .json({ success: false, error: 'Service temporarily unavailable due to high load' });
      return;
    }
  }

  const record = loginAttempts.get(ip) || { count: 0, lockUntil: 0, lastAttempt: now };
  record.lastAttempt = now;

  if (record.lockUntil > now) {
    res.status(429).json({ success: false, error: 'Too many attempts, please try again later' });
    return;
  }

  res.on('finish', () => {
    if (res.statusCode === 401) {
      record.count += 1;
      if (record.count >= MAX_LOGIN_ATTEMPTS) {
        record.lockUntil = Date.now() + LOCK_TIME_MS;
        record.count = 0; // reset count after applying lock
      }
      loginAttempts.set(ip, record);
    } else if (res.statusCode >= 200 && res.statusCode < 300) {
      loginAttempts.delete(ip);
    }
  });

  next();
};

app.use('/api/admin', adminRateLimiter);

app.post('/api/admin/verify', (req: Request, res: Response) => {
  let isSuccess = false;
  const { password } = req.body;
  if (typeof password === 'string') {
    const passwordHash = crypto.createHash('sha256').update(password).digest();
    if (crypto.timingSafeEqual(passwordHash, adminAuthHash)) {
      isSuccess = true;
    }
  }

  if (isSuccess) {
    res.json({ success: true, token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

app.get('/api/admin/maintenance-config', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const config = await getMaintenanceConfig();
    res.json(config);
  } catch {
    res.status(500).json({ error: 'Failed to fetch maintenance config' });
  }
});

app.post('/api/admin/maintenance-config', verifyAdminToken, async (req: Request, res: Response) => {
  const { key, value } = req.body;
  try {
    await updateMaintenanceConfig(key, value);
    if (key === 'global') MAINTENANCE_MODE = value;
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update maintenance config' });
  }
});

app.post(
  '/api/admin/maintenance-config/all',
  verifyAdminToken,
  async (req: Request, res: Response) => {
    const { value } = req.body;
    try {
      await updateAllMaintenanceConfig(value);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Failed to update all maintenance configs' });
    }
  }
);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req: Request, res: Response) => {
  res.status(404).sendFile(NOT_FOUND_PATH, (err) => {
    if (err) {
      if (!res.headersSent) {
        res.status(404).type('text/plain').send('404 Not Found');
      } else {
        res.end();
      }
    }
  });
});

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  if (err instanceof Error && 'status' in err) {
    const httpErr = err as Error & { status: number };
    const errorMsg =
      process.env.NODE_ENV === 'production' && httpErr.status >= 500
        ? 'An unexpected error occurred'
        : httpErr.message || 'Error';
    res.status(httpErr.status).json({ error: errorMsg });
    return;
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export = app;
