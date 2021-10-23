import { Request, Response } from "express";
import session from "express-session";
import { Redis } from "ioredis";


export type MyContext = {
  req: Request & { session: typeof session & {userId: number} };
  res: Response;
  redis: Redis;
}