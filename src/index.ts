import express from "express";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { createConnection } from "typeorm";
import { login } from "./repo/UserRepo";
import {
  getAllVaccines,
  getVaccinesByCitizenId,
  registerVaccine,
} from "./repo/VaccineRepo";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import typeDefs from "./gql/typeDefs";
import resolvers from "./gql/resolvers";
import { getCitizenByDni } from "./repo/CitizenRepo";
import cors from "cors";
dotenv.config();
const {
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_HOST,
  COOKIE_NAME,
  SESSION_SECRET,
  SERVER_PORT,
  CLIENT_URL,
} = process.env;

const main = async () => {
  const app = express();
  app.use(cors({ credentials: true, origin: CLIENT_URL }));
  const router = express.Router();
  await createConnection();
  const redis = new Redis({
    port: Number(REDIS_PORT),
    host: REDIS_HOST,
    password: REDIS_PASSWORD,
  });
  const RedisStore = connectRedis(session);
  const redisStore = new RedisStore({ client: redis });
  app.use(bodyParser.json());
  app.use(
    session({
      store: redisStore,
      name: COOKIE_NAME,
      sameSite: "Strict",
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
      },
    } as any)
  );

  app.use(router);
  router.post("/login", async (req: any, res, next) => {
    try {
      const userResult = await login({
        email: req.body.email,
        password: req.body.password,
      });
      if (userResult && userResult.user) {
        req.session!.userId = userResult.user.id;
        res.send(`User logged in with id ${req.session!.userId}`);
      } else if (userResult && userResult.messages) {
        res.send(userResult.messages[0]);
      } else {
        next();
      }
    } catch (error) {
      res.send(error.messages);
    }
  });

  router.post("/registervaccine", async (req: any, res, next) => {
    try {
      const msg = await registerVaccine({
        userId: req.session!.userId,
        citizenId: req.body.citizenId,
        doseId: req.body.doseId,
        vcId: req.body.vcId,
        ref_cel_number: req.body.ref_cel_number,
        fc_dosis: req.body.fc_dosis ?? new Date(),
        rFactorIds: req.body.rFactorIds,
      });
      res.send(msg);
    } catch (error) {
      res.send(error.messages);
    }
  });
  router.get("/vaccinesbycitizen", async (req: any, res, next) => {
    try {
      const vaccines = await getVaccinesByCitizenId({
        citizenId: req.body.citizenId,
      });
      if (vaccines && vaccines.entities) {
        res.send({
          data: vaccines.entities,
        });
      } else if (vaccines && vaccines.messages) {
        res.send(vaccines.messages[0]);
      } else {
        next();
      }
    } catch (error) {
      res.send(error.messages);
    }
  });
  router.get("/citizenbydni", async (req, res, next) => {
    try {
      const citizen = await getCitizenByDni({
        dni: req.body.dni,
        birthday: req.body.birthday,
      });
      if (citizen && citizen.entity) {
        res.send({ data: citizen.entity });
      } else if (citizen && citizen.messages) {
        res.send(citizen.messages[0]);
      } else {
        next();
      }
    } catch (error) {
      res.send(error.messages);
    }
  });
  router.get("/vaccines", async (req, res, next) => {
    try {
      const result = await getAllVaccines();
      if (result && result.entities) {
        res.send({ data: result.entities });
      } else if (result && result.messages) {
        res.send(result.messages[0]);
      } else {
        next();
      }
    } catch (error) {
      res.send(error.messages);
    }
  });
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen({ port: SERVER_PORT }, () => {
    console.log(`Server running on ${SERVER_PORT}`);
  });
};

main();
