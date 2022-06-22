"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const ioredis_1 = __importDefault(require("ioredis"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const typeorm_1 = require("typeorm");
const UserRepo_1 = require("./repo/UserRepo");
const VaccineRepo_1 = require("./repo/VaccineRepo");
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs_1 = __importDefault(require("./gql/typeDefs"));
const resolvers_1 = __importDefault(require("./gql/resolvers"));
const CitizenRepo_1 = require("./repo/CitizenRepo");
const cors_1 = __importDefault(require("cors"));
const envLoader_1 = require("./common/envLoader");
const users_seeders_1 = require("./seeders/users.seeders");
(0, envLoader_1.loadEnv)();
dotenv_1.default.config();
const { REDIS_PASSWORD, REDIS_PORT, REDIS_HOST, COOKIE_NAME, SESSION_SECRET, SERVER_PORT, CLIENT_URL, } = process.env;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ credentials: true, origin: CLIENT_URL }));
    const router = express_1.default.Router();
    yield (0, typeorm_1.createConnection)();
    const redis = new ioredis_1.default({
        port: Number(REDIS_PORT),
        host: REDIS_HOST,
        password: REDIS_PASSWORD,
    });
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redisStore = new RedisStore({ client: redis });
    app.use(body_parser_1.default.json());
    app.use((0, express_session_1.default)({
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
    }));
    app.use(router);
    router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userResult = yield (0, UserRepo_1.login)({
                email: req.body.email,
                password: req.body.password,
            });
            if (userResult && userResult.user) {
                req.session.userId = userResult.user.id;
                res.send(`User logged in with id ${req.session.userId}`);
            }
            else if (userResult && userResult.messages) {
                res.send(userResult.messages[0]);
            }
            else {
                next();
            }
        }
        catch (error) {
            res.send(error.messages);
        }
    }));
    router.get("/secretseeder", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, users_seeders_1.insertUsers)();
        }
        catch (error) {
            res.send(error.messages);
        }
    }));
    router.post("/registervaccine", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const msg = yield (0, VaccineRepo_1.registerVaccine)({
                userId: req.session.userId,
                citizenId: req.body.citizenId,
                doseId: req.body.doseId,
                vcId: req.body.vcId,
                ref_cel_number: req.body.ref_cel_number,
                fc_dosis: (_a = req.body.fc_dosis) !== null && _a !== void 0 ? _a : new Date(),
                rFactorIds: req.body.rFactorIds,
            });
            res.send(msg);
        }
        catch (error) {
            res.send(error.messages);
        }
    }));
    router.get("/vaccinesbycitizen", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vaccines = yield (0, VaccineRepo_1.getVaccinesByCitizenId)({
                citizenId: req.body.citizenId,
            });
            if (vaccines && vaccines.entities) {
                res.send({
                    data: vaccines.entities,
                });
            }
            else if (vaccines && vaccines.messages) {
                res.send(vaccines.messages[0]);
            }
            else {
                next();
            }
        }
        catch (error) {
            res.send(error.messages);
        }
    }));
    router.get("/citizenbydni", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const citizen = yield (0, CitizenRepo_1.getCitizenByDni)({
                dni: req.body.dni,
                birthday: req.body.birthday,
            });
            if (citizen && citizen.entity) {
                res.send({ data: citizen.entity });
            }
            else if (citizen && citizen.messages) {
                res.send(citizen.messages[0]);
            }
            else {
                next();
            }
        }
        catch (error) {
            res.send(error.messages);
        }
    }));
    router.get("/vaccines", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield (0, VaccineRepo_1.getAllVaccines)();
            if (result && result.entities) {
                res.send({ data: result.entities });
            }
            else if (result && result.messages) {
                res.send(result.messages[0]);
            }
            else {
                next();
            }
        }
        catch (error) {
            res.send(error.messages);
        }
    }));
    const schema = (0, apollo_server_express_1.makeExecutableSchema)({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
    });
    apolloServer.applyMiddleware({ app, cors: false });
    app.listen({ port: SERVER_PORT }, () => {
        console.log(`Server running on ${SERVER_PORT}`);
    });
});
main();
//# sourceMappingURL=index.js.map