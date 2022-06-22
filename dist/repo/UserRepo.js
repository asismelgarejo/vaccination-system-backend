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
exports.me = exports.logout = exports.login = exports.register = exports.UserResult = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const EmailValidator_1 = require("../common/validators/EmailValidator");
const PasswordValidator_1 = require("../common/validators/PasswordValidator");
const Citizen_1 = require("./Citizen");
const User_1 = require("./User");
const saltRounds = 10;
class UserResult {
    constructor(messages, user) {
        this.messages = messages;
        this.user = user;
    }
}
exports.UserResult = UserResult;
const register = ({ email, password, citizen_dni, }) => __awaiter(void 0, void 0, void 0, function* () {
    const citizen = yield Citizen_1.Citizen.findOne({ where: { dni: citizen_dni } });
    const result = (0, PasswordValidator_1.isPasswordValid)(password);
    if (!result.isValid) {
        return { messages: ["Invalid password"] };
    }
    const trimmedEmail = email.trim().toLowerCase();
    const emailErrMgs = (0, EmailValidator_1.isEmailValid)(trimmedEmail);
    if (emailErrMgs) {
        return { messages: [emailErrMgs] };
    }
    const salt = yield bcryptjs_1.default.genSalt(saltRounds);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    const userEntity = yield User_1.User.create({
        email: trimmedEmail,
        password: hashedPassword,
        citizen: citizen,
    }).save();
    userEntity.password = "";
    return { user: userEntity };
});
exports.register = register;
const login = ({ email, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ where: { email } });
    if (!user) {
        return { messages: [`User with email ${email} not found`] };
    }
    const passwordMatch = yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
    if (!passwordMatch) {
        return { messages: ["Password is invalid"] };
    }
    return { user };
});
exports.login = login;
const logout = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ where: { email } });
    if (!user) {
        return { messages: [`$User with email ${email} not found`] };
    }
    return { user };
});
exports.logout = logout;
const me = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ where: { id }, relations: ["citizen"] });
    if (!user) {
        return { messages: ["User not found"] };
    }
    return { user };
});
exports.me = me;
//# sourceMappingURL=UserRepo.js.map