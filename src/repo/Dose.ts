import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Auditable } from "./Auditable";
import { Vaccine } from "./Vaccine";

@Entity({ name: "Doses" })
export class Dose extends Auditable {
  @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
  id: string;
  @Column("varchar", {
    name: "name",
    length: 120,
    nullable: false,
  })
  name: string;
  @OneToMany(() => Vaccine, (vaccine) => vaccine.citizen)
  vaccines: Vaccine[];
}
