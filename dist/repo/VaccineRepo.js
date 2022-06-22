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
exports.getVcdCtzsStats = exports.getAllVaccines = exports.getVaccinesByCitizenId = exports.registerVaccine = void 0;
const typeorm_1 = require("typeorm");
const Citizen_1 = require("./Citizen");
const Dose_1 = require("./Dose");
const RiskFactor_1 = require("./RiskFactor");
const User_1 = require("./User");
const VaccinationCenter_1 = require("./VaccinationCenter");
const Vaccine_1 = require("./Vaccine");
const registerVaccine = ({ userId, doseId, vcId, citizenId, ref_cel_number, fc_dosis, rFactorIds, }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ where: { id: userId } });
    if (!user) {
        return { messages: ["User not logged in."] };
    }
    const vc = yield VaccinationCenter_1.VaccinationCenter.findOne({ where: { id: vcId } });
    if (!vc) {
        return { messages: ["Vaccination center not found."] };
    }
    const dose = yield Dose_1.Dose.findOne({ where: { id: doseId } });
    if (!dose) {
        return { messages: ["Dose not found."] };
    }
    const citizen = yield Citizen_1.Citizen.findOne({ where: { id: citizenId } });
    if (!citizen) {
        return { messages: ["Citizen not found."] };
    }
    const riskFactors = yield RiskFactor_1.RiskFactor.find({
        where: { code: (0, typeorm_1.In)(rFactorIds) },
    });
    const vaccine = yield Vaccine_1.Vaccine.create({
        ref_cel_number,
        fc_dosis,
        user,
        vc,
        dose,
        citizen,
        riskFactors,
    }).save();
    if (!vaccine) {
        return { messages: ["Failed to register vaccine."] };
    }
    return { messages: ["Vaccine registered successfully."] };
});
exports.registerVaccine = registerVaccine;
const getVaccinesByCitizenId = ({ citizenId, }) => __awaiter(void 0, void 0, void 0, function* () {
    const vaccines = yield Vaccine_1.Vaccine.createQueryBuilder("vaccine")
        .where(`vaccine."citizenId" = :citizenId`, { citizenId })
        .leftJoinAndSelect("vaccine.citizen", "citizen")
        .orderBy("vaccine.fc_dosis", "ASC")
        .getMany();
    if (!vaccines) {
        return { messages: ["Vaccines of citizen not found"] };
    }
    return { entities: vaccines };
});
exports.getVaccinesByCitizenId = getVaccinesByCitizenId;
const getAllVaccines = () => __awaiter(void 0, void 0, void 0, function* () {
    const vaccines = yield Vaccine_1.Vaccine.createQueryBuilder("vaccine")
        .leftJoinAndSelect("vaccine.citizen", "citizen")
        .leftJoinAndSelect("vaccine.riskFactors", "riskFactors")
        .leftJoinAndSelect("vaccine.dose", "dose")
        .leftJoinAndSelect("vaccine.vc", "vc")
        .orderBy({ "citizen.dni": "ASC" })
        .getMany();
    if (!vaccines) {
        return { messages: ["An error occurred retrieving vaccines"] };
    }
    return { entities: vaccines };
});
exports.getAllVaccines = getAllVaccines;
const getVcdCtzsStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const eighteenAgo = () => {
        const currentDay = new Date();
        currentDay.setFullYear(currentDay.getFullYear() - 18);
        return currentDay;
    };
    function getUniqueListBy(arr, key) {
        const citizens = arr.map((vac) => vac.citizen);
        return [
            ...new Map(citizens.map((item) => [item[key], item])).values(),
        ];
    }
    let men_adult = yield Vaccine_1.Vaccine.createQueryBuilder("vaccine")
        .leftJoinAndSelect("vaccine.citizen", "citizen")
        .where("citizen.gender =:gender AND citizen.birthday <= :eighteenAgo", {
        gender: "M",
        eighteenAgo: eighteenAgo(),
    })
        .getMany();
    let men_minor = yield Vaccine_1.Vaccine.createQueryBuilder("vaccine")
        .leftJoinAndSelect("vaccine.citizen", "citizen")
        .where("citizen.gender =:gender AND citizen.birthday > :eighteenAgo", {
        gender: "M",
        eighteenAgo: eighteenAgo(),
    })
        .getMany();
    let women_adult = yield Vaccine_1.Vaccine.createQueryBuilder("vaccine")
        .leftJoinAndSelect("vaccine.citizen", "citizen")
        .where("citizen.gender =:gender AND citizen.birthday <= :eighteenAgo", {
        gender: "F",
        eighteenAgo: eighteenAgo(),
    })
        .getMany();
    let women_minor = yield Vaccine_1.Vaccine.createQueryBuilder("vaccine")
        .leftJoinAndSelect("vaccine.citizen", "citizen")
        .where("citizen.gender =:gender AND citizen.birthday > :eighteenAgo", {
        gender: "F",
        eighteenAgo: eighteenAgo(),
    })
        .getMany();
    if (!men_adult || !men_minor || !women_adult || !women_minor) {
        return {
            messages: "An error occurred retrieving vaccines",
            stats: {
                women: {
                    minors: 0,
                    adults: 0,
                },
                men: {
                    minors: 0,
                    adults: 0,
                },
            },
        };
    }
    men_adult = getUniqueListBy(men_adult, "dni");
    men_minor = getUniqueListBy(men_minor, "dni");
    women_adult = getUniqueListBy(women_adult, "dni");
    women_minor = getUniqueListBy(women_minor, "dni");
    return {
        stats: {
            women: { minors: women_minor.length, adults: women_adult.length },
            men: { minors: men_minor.length, adults: men_adult.length },
        },
    };
});
exports.getVcdCtzsStats = getVcdCtzsStats;
//# sourceMappingURL=VaccineRepo.js.map