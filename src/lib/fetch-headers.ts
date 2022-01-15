import fetch from 'isomorphic-unfetch';

export const fetchHeaders = async ({ url }: { url: string }) => {
  const response = await fetch(url, { method: 'HEAD' });
  if (response) {
    const mediaType = response.headers.get('Content-Type');
    return mediaType;
  }
};
