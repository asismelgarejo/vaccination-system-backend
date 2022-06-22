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
exports.getCitizenByDni = void 0;
const Citizen_1 = require("./Citizen");
const getCitizenByDni = ({ dni, birthday, }) => __awaiter(void 0, void 0, void 0, function* () {
    const citizen = yield Citizen_1.Citizen.findOne({
        where: {
            dni,
            birthday,
        },
        relations: [
            "vaccines",
            "vaccines.citizen",
            "vaccines.dose",
            "vaccines.vc",
            "vaccines.riskFactors",
        ],
    });
    if (!citizen) {
        return { messages: ["User not found for this data"] };
    }
    return { entity: citizen };
});
exports.getCitizenByDni = getCitizenByDni;
//# sourceMappingURL=CitizenRepo.js.map