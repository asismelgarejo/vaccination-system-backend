import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Auditable } from "./Auditable";
import { Vaccine } from "./Vaccine";

@Entity({ name: "VaccinationCenters" })
export class VaccinationCenter extends Auditable {
  @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
  id: string;
  @Column("varchar", {
    name: "name",
    length: 255,
    nullable: false,
  })
  name: string;
  @Column("varchar", {
    name: "code",
    length: 150,
    nullable: false,
    unique: true,
  })
  code: string;
  @OneToMany(() => Vaccine, (vaccine) => vaccine.citizen)
  vaccines: Vaccine[];
}
