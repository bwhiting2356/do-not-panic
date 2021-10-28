export const padUrlWithHttp = (url: string) => {
  if (url.startsWith("http")) return url;
  return `http://${url}`;
};
