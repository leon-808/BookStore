import crypto from "node:crypto";

export const genRandomTokenUrl = (): string => {
  return encodeURIComponent(crypto.randomBytes(30).toString("hex"));
};
