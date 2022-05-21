import { Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Auditable } from "./Auditable";
import { Vaccine } from "./Vaccine";

@Entity({ name: "Citizens" })
export class Citizen extends Auditable {
  @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
  id: string;
  @Column("char", {
    name: "dni",
    length: 8,
    unique: true,
    nullable: false,
  })
  @Length(8, 8)
  dni: string;
  @Column("varchar", {
    name: "names",
    length: 255,
    nullable: false,
  })
  names: string;
  @Column("varchar", {
    name: "fr_lastname",
    nullable: false,
    length: 255,
  })
  fr_lastname: string;
  @Column("varchar", {
    name: "mr_lastname",
    nullable: false,
    length: 255,
  })
  mr_lastname: string;
  @Column("date", {
    name: "birthday",
    nullable: false,
  })
  birthday: Date;
  @Column("char", {
    name: "gender",
    nullable: false,
    length: 1,
  })
  gender: "M" | "F";
  @Column("varchar", {
    name: "address",
    nullable: false,
    length: 255,
  })
  address: string;
  // @Column("boolean", {
  //   name: "isDeceased",
  //   default: false,
  //   nullable: false,
  // })
  // isDeceased: boolean;
  @OneToMany(() => Vaccine, (vaccine) => vaccine.citizen)
  vaccines: Vaccine[];
}


