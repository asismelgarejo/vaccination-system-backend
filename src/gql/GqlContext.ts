import { Response, Request } from "express";
import { PubSub } from "apollo-server-express";
import { Session, SessionData } from "express-session";

interface ICustomRequest extends Omit<Request, "session"> {
  session: Session & Partial<SessionData> & { userId?: string };
}

export interface GqlContext {
  req: ICustomRequest;
  res: Response;
  pubsub: PubSub;
}
