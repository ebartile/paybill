// get reading time
// returns :string
export const generateReadingTime = (text: string) => {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s/g).length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return `${readTime} minute read`;
};
// Helps with the TypeScript issue where filtering doesn't narrows undefined nor null types, check https://github.com/microsoft/TypeScript/issues/16069
export function isNotNullOrUndefined<T>(
  value: T | null | undefined,
): value is T {
  return value !== null && value !== undefined;
}

export const isBrowser = typeof window !== "undefined";

export const stripEmojis = (str: string) =>
  str
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();

export const detectBrowser = () => {
  if (!navigator) return undefined;

  if (navigator.userAgent.indexOf("Chrome") !== -1) {
    return "Chrome";
  } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
    return "Firefox";
  } else if (navigator.userAgent.indexOf("Safari") !== -1) {
    return "Safari";
  }
};

export const formatBytes = (
  bytes: any,
  decimals = 2,
  size?: 'bytes' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB'
) => {
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (bytes === 0 || bytes === undefined) return size !== undefined ? `0 ${size}` : '0 bytes'

  // Handle negative values
  const isNegative = bytes < 0
  const absBytes = Math.abs(bytes)

  const i = size !== undefined ? sizes.indexOf(size) : Math.floor(Math.log(absBytes) / Math.log(k))
  const formattedValue = parseFloat((absBytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]

  return isNegative ? '-' + formattedValue : formattedValue
}

const currencyFormatterDefault = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const currencyFormatterSmallValues = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
})

export const formatCurrency = (amount: number | undefined | null): string | null => {
  if (amount === undefined || amount === null) {
    return null
  } else if (amount > 0 && amount < 0.01) {
    return currencyFormatterSmallValues.format(amount)
  } else {
    return currencyFormatterDefault.format(amount)
  }
}

export const isValidHttpUrl = (value: string) => {
  let url: URL
  try {
    url = new URL(value)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}
