import jsonwebtoken from "jsonwebtoken";

const JWT_SECRETKEY = process.env.JWT_SECRETKEY;
if (!JWT_SECRETKEY) {
  throw new Error("tidak ada jwt secret key");
}
export interface userPayload {
  id: Number;
  full_name: string;
  email: string;
}

export const signingToken = (payload: userPayload) => {
  return jsonwebtoken.sign(payload, JWT_SECRETKEY);
};

export const verifyToken = (token: string) => {
  return jsonwebtoken.verify(token, JWT_SECRETKEY);
};
