import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
// import Express from "express";
import session from "express-session";

// type SessionWithUser = Session
// let sess = session;

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: typeof session & {userId: number} };
  // req: Request & { session: Session & {userId: number} };
  res: Response;
}