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
