const chars =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function encodeBase62(num: bigint): string {

  let result = "";

  while (num > 0n) {
    const remainder = num % 62n;
    result = chars[Number(remainder)] + result;
    num = num / 62n;
  }

  return result;
}