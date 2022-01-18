export function base64Encode(str: string) {
  return Buffer.from(str, 'utf-8').toString('base64');
}

export const currency = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(number);
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const imageExtRegex = /(jpg|jpeg|png|gif|svg)$/;
export const isImage = (url: string) => {
  return imageExtRegex.test(url);
};