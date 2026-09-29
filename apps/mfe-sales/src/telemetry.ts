/**
 * BNI eLO Konsumer - Frontend OpenTelemetry & W3C Distributed Tracing
 * Compliant with OpenTelemetry W3C traceparent standard.
 * Invisible, lightweight background tracer for Microfrontend (MFE).
 * 100% Dynamic: Resolves logged-in Officer, Branch, and API Endpoint dynamically.
 */

// Resolusi dinamis endpoint backend (environment-aware)
const getBackendTraceEndpoint = (): string => {
  try {
    const envUrl = (import.meta as any)?.env?.VITE_API_URL;
    if (envUrl) return `${envUrl}/api/fe-traces`;
  } catch {}
  return 'http://localhost:5139/api/fe-traces';
};

const BACKEND_TRACE_ENDPOINT = getBackendTraceEndpoint();

function generateHex(len: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * Dinamis mengekstrak identitas Officer (NIP/Nama) dan Cabang
 * dari sesi aktif pengguna di browser storage (bni-auth Zustand store).
 */
export function getCurrentAuth(): { officer: string; branch: string } {
  if (typeof window === 'undefined') {
    return { officer: 'Sales Konsumer', branch: '046 - SERANG' };
  }
  try {
    // 1. Cek sesi utama dari 'bni-auth' (Zustand persistent store)
    const raw = localStorage.getItem('bni-auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      const user = parsed.state?.user || parsed.user;
      if (user) {
        const name = user.name || user.fullName || user.userName || '';
        const id = user.userId || user.id || '';
        const officerStr = name && id ? `${name} (${id})` : (name || id || 'Sales Konsumer');
        const branchStr = user.branch || user.branchCode || '046 - SERANG';
        return { officer: officerStr, branch: branchStr };
      }
    }

    // 2. Fallback cek session storage / alternate keys
    const fallbackRaw = localStorage.getItem('bni_user') || sessionStorage.getItem('bni_user');
    if (fallbackRaw) {
      const u = JSON.parse(fallbackRaw);
      if (u) {
        const name = u.name || u.fullName || '';
        const id = u.userId || u.id || '';
        return {
          officer: name && id ? `${name} (${id})` : (name || id || 'Sales Konsumer'),
          branch: u.branch || u.branchCode || '046 - SERANG'
        };
      }
    }
  } catch {
    // Fallback default jika storage corrupt / SSR
  }
  return { officer: 'Sales Konsumer', branch: '046 - SERANG' };
}

export interface FeTracePayload {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  timestamp: string;
  officer?: string;
  branch?: string;
  url?: string;
  details?: any;
}

const traceBuffer: FeTracePayload[] = [];
let flushTimeout: any = null;

function sendTraces(traces: FeTracePayload[]) {
  if (!traces.length) return;
  try {
    const body = JSON.stringify(traces);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(BACKEND_TRACE_ENDPOINT, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(BACKEND_TRACE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
      }).catch(() => {});
    }
  } catch (e) {
    // Ignore background trace sending errors
  }
}

function queueTrace(trace: FeTracePayload) {
  traceBuffer.push(trace);
  if (!flushTimeout) {
    flushTimeout = setTimeout(() => {
      flushTimeout = null;
      const batch = traceBuffer.splice(0, traceBuffer.length);
      sendTraces(batch);
    }, 800);
  }
}

export function initTelemetry() {
  if (typeof window === 'undefined' || (window as any).__bni_telemetry_initialized) return;
  (window as any).__bni_telemetry_initialized = true;

  console.log('[OTel] Frontend Enterprise Tracing Active (W3C Standard, Dynamic Session Aware)');

  // 1. Initial Page Load Trace
  window.addEventListener('load', () => {
    const timing = performance.timing;
    const loadDuration = timing ? Math.max(1, timing.loadEventEnd - timing.navigationStart) : 50;
    const auth = getCurrentAuth();
    queueTrace({
      traceId: generateHex(32),
      spanId: generateHex(16),
      name: 'Initial Page Load',
      method: 'LOAD',
      path: window.location.pathname || '/',
      statusCode: 200,
      durationMs: loadDuration,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
      officer: auth.officer,
      branch: auth.branch,
      url: window.location.href,
      details: {
        screen: window.innerWidth + 'x' + window.innerHeight
      }
    });
  });

  // 2. W3C Distributed Tracing Fetch Interceptor
  const originalFetch = window.fetch;
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    // Do not intercept trace sending itself to avoid infinite loops
    if (urlStr.includes('/api/fe-traces') || urlStr.includes('/traces-feed')) {
      return originalFetch.apply(this, arguments as any);
    }

    const traceId = generateHex(32);
    const spanId = generateHex(16);
    const traceParent = `00-${traceId}-${spanId}-01`;

    const modifiedInit: RequestInit = init ? { ...init } : {};
    const headers = new Headers(modifiedInit.headers || {});
    headers.set('traceparent', traceParent);
    headers.set('X-Trace-ID', traceId);
    modifiedInit.headers = headers;

    const method = (modifiedInit.method || 'GET').toUpperCase();
    const startTime = performance.now();

    try {
      const response = await originalFetch(input, modifiedInit);
      const durationMs = Math.round(performance.now() - startTime);

      if (urlStr.includes('/api/')) {
        let path = urlStr;
        try {
          const parsed = new URL(urlStr, window.location.origin);
          path = parsed.pathname;
        } catch {}

        const auth = getCurrentAuth();
        queueTrace({
          traceId,
          spanId,
          name: `Fetch ${method} ${path}`,
          method,
          path,
          statusCode: response.status,
          durationMs,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
          officer: auth.officer,
          branch: auth.branch,
          url: window.location.href
        });
      }

      return response;
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime);
      const auth = getCurrentAuth();
      queueTrace({
        traceId,
        spanId,
        name: `Fetch Failed ${method}`,
        method,
        path: urlStr,
        statusCode: 0,
        durationMs,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
        officer: auth.officer,
        branch: auth.branch,
        url: window.location.href,
        details: { error: err?.message || 'Network error' }
      });
      throw err;
    }
  };

  // 3. User Interaction Tracking
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button');
    if (button) {
      const btnText = (button.innerText || button.getAttribute('aria-label') || 'Button').trim().substring(0, 40);
      if (btnText && btnText !== 'Refresh') {
        const auth = getCurrentAuth();
        queueTrace({
          traceId: generateHex(32),
          spanId: generateHex(16),
          name: `User Click [${btnText}]`,
          method: 'CLICK',
          path: window.location.pathname + ' #' + btnText,
          statusCode: 200,
          durationMs: 12,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
          officer: auth.officer,
          branch: auth.branch,
          url: window.location.href
        });
      }
    }
  }, { passive: true });
}
