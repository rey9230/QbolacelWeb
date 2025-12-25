import * as Sentry from "@sentry/react";

// Filter sensitive data from error events
function filterSensitiveData(event: Sentry.ErrorEvent): Sentry.ErrorEvent | null {
  // Filter out sensitive fields from request data
  if (event.request?.data) {
    const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret', 'apiKey', 'authorization'];
    const data = event.request.data;
    
    if (typeof data === 'object' && data !== null) {
      for (const field of sensitiveFields) {
        if (field in data) {
          (data as Record<string, unknown>)[field] = '[FILTERED]';
        }
      }
    }
  }

  // Filter out sensitive headers
  if (event.request?.headers) {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    for (const header of sensitiveHeaders) {
      if (header in event.request.headers) {
        event.request.headers[header] = '[FILTERED]';
      }
    }
  }

  return event;
}

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN || "https://1184650552d601e6d47a8b9a9b4e05c4@o4510588167061504.ingest.us.sentry.io/4510588174270464";
  
  Sentry.init({
    dsn,
    sendDefaultPii: false, // Disabled for privacy compliance
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Mask all text content for privacy
        maskAllText: true,
        // Block all media for privacy
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend: filterSensitiveData,
  });
}

export { Sentry };
