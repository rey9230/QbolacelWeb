import * as Sentry from "@sentry/react";

export function initSentry() {
  Sentry.init({
    dsn: "https://1184650552d601e6d47a8b9a9b4e05c4@o4510588167061504.ingest.us.sentry.io/4510588174270464",
    sendDefaultPii: true,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export { Sentry };
