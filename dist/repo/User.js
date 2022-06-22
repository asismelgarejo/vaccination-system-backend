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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Vaccine_1 = require("./Vaccine");
const Citizen_1 = require("./Citizen");
const Auditable_1 = require("./Auditable");
let User = class User extends Auditable_1.Auditable {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: "id", type: "bigint" }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "email",
        length: "120",
        unique: true,
        nullable: false,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "password",
        nullable: false,
        length: 100,
    }),
    (0, class_validator_1.Length)(8, 100),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", {
        name: "isDisabled",
        default: false,
        nullable: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isDisabled", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Vaccine_1.Vaccine, (vaccine) => vaccine.citizen),
    __metadata("design:type", Array)
], User.prototype, "vaccines", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Citizen_1.Citizen),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Citizen_1.Citizen)
], User.prototype, "citizen", void 0);
User = __decorate([
    (0, typeorm_1.Entity)({ name: "Users" })
], User);
exports.User = User;
//# sourceMappingURL=User.js.map