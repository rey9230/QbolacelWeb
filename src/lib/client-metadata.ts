const DEFAULT_APP_VERSION = import.meta.env.VITE_APP_VERSION || "web-dev";
const DEFAULT_APP_COUNTRY = import.meta.env.VITE_APP_COUNTRY;

const isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined";

const parsePlatform = (ua: string): "web" | "mobile-web" => {
  if (!isBrowser) return "web";
  const uaData = (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData;
  const isMobile = uaData?.mobile ?? /Mobi|Android|iPhone|iPad|Mobile/i.test(ua);
  return isMobile ? "mobile-web" : "web";
};

const parseWindowsVersion = (platformVersion?: string, ua?: string) => {
  const major = platformVersion ? parseInt(platformVersion.split(".")[0] || "0", 10) : NaN;
  if (!Number.isNaN(major)) {
    if (major >= 15) return "11";
    if (major >= 10) return "10";
    return String(major);
  }

  if (ua?.includes("Windows NT 10.0")) return "10+";
  if (ua?.includes("Windows NT 6.3")) return "8.1";
  if (ua?.includes("Windows NT 6.2")) return "8";
  if (ua?.includes("Windows NT 6.1")) return "7";
  return "unknown";
};

const parseOS = (ua: string): string => {
  if (!isBrowser) return "unknown/0";
  const uaData = (navigator as Navigator & { userAgentData?: { platform?: string; platformVersion?: string } }).userAgentData;
  const platform = uaData?.platform || "";
  const platformVersion = uaData?.platformVersion;

  const androidMatch = ua.match(/Android\s([\d.]+)/i);
  if (androidMatch) return `android/${androidMatch[1]}`;

  const iosMatch = ua.match(/(iPhone|iPad|CPU) OS (\d+[_\d]*)/i);
  if (iosMatch) return `ios/${iosMatch[2].replace(/_/g, ".")}`;

  const macMatch = ua.match(/Mac OS X (\d+[_\d]*)/i);
  if (macMatch) return `macos/${macMatch[1].replace(/_/g, ".")}`;

  if (platform.toLowerCase().includes("windows") || ua.includes("Windows")) {
    return `windows/${parseWindowsVersion(platformVersion, ua)}`;
  }

  if (ua.toLowerCase().includes("linux")) return "linux/unknown";

  return "unknown/0";
};

const getRegionFromStorage = () => {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem("qbolacel-location");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const province = parsed?.state?.province || parsed?.state?.municipality;
    return typeof province === "string" && province.trim().length > 0 ? province : null;
  } catch {
    return null;
  }
};

export const getAuditHeaders = (): Record<string, string> => {
  const ua = isBrowser ? navigator.userAgent : "";
  const headers: Record<string, string> = {
    "X-Platform": parsePlatform(ua),
    "X-OS": parseOS(ua),
    "X-App-Version": DEFAULT_APP_VERSION,
  };

  if (DEFAULT_APP_COUNTRY) {
    headers["X-App-Country"] = DEFAULT_APP_COUNTRY;
  }

  const region = getRegionFromStorage();
  if (region) {
    headers["X-App-Region"] = region;
  }

  return headers;
};
