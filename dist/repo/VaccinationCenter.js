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
exports.VaccinationCenter = void 0;
const typeorm_1 = require("typeorm");
const Auditable_1 = require("./Auditable");
const Vaccine_1 = require("./Vaccine");
let VaccinationCenter = class VaccinationCenter extends Auditable_1.Auditable {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "id", type: "bigint" }),
    __metadata("design:type", String)
], VaccinationCenter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "name",
        length: 255,
        nullable: false,
    }),
    __metadata("design:type", String)
], VaccinationCenter.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "code",
        length: 150,
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], VaccinationCenter.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Vaccine_1.Vaccine, (vaccine) => vaccine.citizen),
    __metadata("design:type", Array)
], VaccinationCenter.prototype, "vaccines", void 0);
VaccinationCenter = __decorate([
    (0, typeorm_1.Entity)({ name: "VaccinationCenters" })
], VaccinationCenter);
exports.VaccinationCenter = VaccinationCenter;
//# sourceMappingURL=VaccinationCenter.js.map