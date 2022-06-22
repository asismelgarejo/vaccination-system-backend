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
Object.defineProperty(exports, "__esModule", { value: true });
const CitizenRepo_1 = require("../repo/CitizenRepo");
const DoseRepo_1 = require("../repo/DoseRepo");
const RiskFactorRepo_1 = require("../repo/RiskFactorRepo");
const UserRepo_1 = require("../repo/UserRepo");
const VaccinationCenterRepo_1 = require("../repo/VaccinationCenterRepo");
const VaccineRepo_1 = require("../repo/VaccineRepo");
const resolvers = {
    CitizenResult: {
        __resolveType(obj, context, info) {
            if (obj === null || obj === void 0 ? void 0 : obj.messages) {
                return "EntityResult";
            }
            return "Citizen";
        },
    },
    UserResult: {
        __resolveType(obj, context, info) {
            if (obj === null || obj === void 0 ? void 0 : obj.messages) {
                return "UserResult";
            }
            return "User";
        },
    },
    VaccineArrayResult: {
        __resolveType(obj, context, info) {
            if (obj === null || obj === void 0 ? void 0 : obj.messages) {
                return "EntityResult";
            }
            return "VaccineArray";
        },
    },
    Query: {
        getAllVaccines: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let vaccines;
            try {
                vaccines = yield (0, VaccineRepo_1.getAllVaccines)();
                if (vaccines.entities) {
                    return vaccines.entities;
                }
                return { messages: (_a = vaccines === null || vaccines === void 0 ? void 0 : vaccines.messages) !== null && _a !== void 0 ? _a : [""] };
            }
            catch (error) {
                throw error;
            }
        }),
        me: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            let user;
            try {
                if (!ctx.req.session.userId) {
                    return { messages: ["User not logged in."] };
                }
                user = yield (0, UserRepo_1.me)(ctx.req.session.userId);
                if (user && user.user) {
                    return user.user;
                }
                return {
                    messages: (_b = user.messages) !== null && _b !== void 0 ? _b : ["Error when logging"],
                };
            }
            catch (e) {
                throw e;
            }
        }),
        getAllRFs: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { rfs } = yield (0, RiskFactorRepo_1.getAllRFs)();
                return rfs;
            }
            catch (error) {
                throw error;
            }
        }),
        getAllVCs: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { vcs } = yield (0, VaccinationCenterRepo_1.getAllVCs)();
                return vcs;
            }
            catch (error) {
                throw error;
            }
        }),
        getAllDoses: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { doses } = yield (0, DoseRepo_1.getAllDoses)();
                return doses;
            }
            catch (error) {
                throw error;
            }
        }),
        getVcdCtzsStats: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const result = yield (0, VaccineRepo_1.getVcdCtzsStats)();
                return result.stats;
            }
            catch (error) {
                throw error;
            }
        }),
    },
    Mutation: {
        registerVaccine: (parent, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            let result;
            try {
                result = yield (0, VaccineRepo_1.registerVaccine)({
                    userId: input.userId,
                    doseId: input.doseId,
                    vcId: input.vcId,
                    citizenId: input.citizenId,
                    ref_cel_number: input.ref_cel_number,
                    fc_dosis: (_c = input === null || input === void 0 ? void 0 : input.fc_dosis) !== null && _c !== void 0 ? _c : new Date(),
                    rFactorIds: input.rFactorIds,
                });
                return { messages: (_d = result.messages) !== null && _d !== void 0 ? _d : ["An error ocurred!"] };
            }
            catch (error) {
                throw error;
            }
        }),
        login: (parent, { input }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const user = yield (0, UserRepo_1.login)({
                    email: input.email,
                    password: input.password,
                });
                if (user && (user === null || user === void 0 ? void 0 : user.user)) {
                    ctx.req.session.userId = user.user.id;
                    return {
                        message: `User logged in with id ${ctx.req.session.userId}`,
                        status: "success",
                    };
                }
                return {
                    message: user.messages ? user.messages[0] : "Error when loggin",
                    status: "failure",
                };
            }
            catch (error) {
                throw error;
            }
        }),
        logout: (parent, { email }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _e;
            try {
                const result = yield (0, UserRepo_1.logout)(email);
                if (result === null || result === void 0 ? void 0 : result.user) {
                    (_e = ctx.req.session) === null || _e === void 0 ? void 0 : _e.destroy((err) => {
                        if (err) {
                            return {
                                status: "failure",
                                message: "Destroy session failed",
                            };
                        }
                        else {
                            return {
                                status: "success",
                                message: "Session of the user was destroyed successfully.",
                            };
                        }
                    });
                    return {
                        status: "success",
                        message: "Session of the user was destroyed successfully.",
                    };
                }
                else {
                    return {
                        status: "failure",
                        message: "Failure logout",
                    };
                }
            }
            catch (error) {
                throw error;
            }
        }),
        getCitizenByDni: (parent, { input: { birthday, dni } }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _f;
            let citizen;
            try {
                citizen = yield (0, CitizenRepo_1.getCitizenByDni)({ birthday, dni });
                if (citizen.entity) {
                    return citizen.entity;
                }
                else {
                    return { messages: (_f = citizen.messages) !== null && _f !== void 0 ? _f : ["Not found"] };
                }
            }
            catch (err) {
                throw err;
            }
        }),
    },
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map