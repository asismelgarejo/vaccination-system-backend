"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaccine = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Citizen_1 = require("./Citizen");
const VaccinationCenter_1 = require("./VaccinationCenter");
const Dose_1 = require("./Dose");
const User_1 = require("./User");
const Auditable_1 = require("./Auditable");
const RiskFactor_1 = require("./RiskFactor");
let Vaccine = class Vaccine extends Auditable_1.Auditable {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "id", type: "bigint" }),
    __metadata("design:type", String)
], Vaccine.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("char", {
        name: "ref_cel_number",
        length: 9,
        nullable: false,
    }),
    (0, class_validator_1.Length)(9, 9),
    __metadata("design:type", String)
], Vaccine.prototype, "ref_cel_number", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "fc_dosis", nullable: false }),
    __metadata("design:type", Date)
], Vaccine.prototype, "fc_dosis", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Citizen_1.Citizen, (citizen) => citizen.vaccines),
    __metadata("design:type", Citizen_1.Citizen)
], Vaccine.prototype, "citizen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => VaccinationCenter_1.VaccinationCenter, (vc) => vc.vaccines),
    __metadata("design:type", VaccinationCenter_1.VaccinationCenter)
], Vaccine.prototype, "vc", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Dose_1.Dose, (vc) => vc.vaccines),
    __metadata("design:type", Dose_1.Dose)
], Vaccine.prototype, "dose", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.vaccines),
    __metadata("design:type", User_1.User)
], Vaccine.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => RiskFactor_1.RiskFactor),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Vaccine.prototype, "riskFactors", void 0);
Vaccine = __decorate([
    (0, typeorm_1.Entity)({ name: "Vaccines" })
], Vaccine);
exports.Vaccine = Vaccine;
//# sourceMappingURL=Vaccine.js.map