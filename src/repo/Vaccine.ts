import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Length } from "class-validator";
import { Citizen } from "./Citizen";
import { VaccinationCenter } from "./VaccinationCenter";
import { Dose } from "./Dose";
import { User } from "./User";
import { Auditable } from "./Auditable";
import { RiskFactor } from "./RiskFactor";

@Entity({ name: "Vaccines" })
export class Vaccine extends Auditable {
  @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
  id: string;
  @Column("char", {
    name: "ref_cel_number",
    length: 9,
    nullable: false,
  })
  @Length(9, 9)
  ref_cel_number: string;
  @Column("date", { name: "fc_dosis", nullable: false })
  fc_dosis: Date;
  @ManyToOne(() => Citizen, (citizen) => citizen.vaccines)
  citizen: Citizen;
  @ManyToOne(() => VaccinationCenter, (vc) => vc.vaccines)
  vc: VaccinationCenter;
  @ManyToOne(() => Dose, (vc) => vc.vaccines)
  dose: Dose;
  @ManyToOne(() => User, (user) => user.vaccines)
  user: User;
  @ManyToMany(() => RiskFactor)
  @JoinTable()
  riskFactors: RiskFactor[];
}
