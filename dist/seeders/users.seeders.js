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
exports.insertUsers = void 0;
const UserRepo_1 = require("../repo/UserRepo");
const USERS = [
    {
        email: "user01@gmail.com",
        password: "password",
        citizen_dni: "75958735",
    },
    {
        email: "user02@gmail.com",
        password: "password",
        citizen_dni: "75958736",
    },
    {
        email: "user03@gmail.com",
        password: "password",
        citizen_dni: "75958737",
    },
    {
        email: "user04@gmail.com",
        password: "password",
        citizen_dni: "75958738",
    },
    {
        email: "user05@gmail.com",
        password: "password",
        citizen_dni: "75958739",
    },
    {
        email: "user06@gmail.com",
        password: "password",
        citizen_dni: "75958743",
    },
];
const insertUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const promises = USERS.map(({ email, password, citizen_dni }) => {
        return (0, UserRepo_1.register)({ email, password, citizen_dni });
    });
    yield Promise.all(promises);
    console.log("Users inserted successfully!");
});
exports.insertUsers = insertUsers;
//# sourceMappingURL=users.seeders.js.map