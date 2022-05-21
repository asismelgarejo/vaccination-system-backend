import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Length } from "class-validator";
import { Vaccine } from "./Vaccine";
import { Citizen } from "./Citizen";
import { Auditable } from "./Auditable";

@Entity({ name: "Users" })
export class User extends Auditable {
  @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
  id: string;
  @Column("varchar", {
    name: "email",
    length: "120",
    unique: true,
    nullable: false,
  })
  email: string;
  @Column("varchar", {
    name: "password",
    nullable: false,
    length: 100,
  })
  @Length(8, 100)
  password: string;
  @Column("boolean", {
    name: "isDisabled",
    default: false,
    nullable: false,
  })
  isDisabled: boolean;
  @OneToMany(() => Vaccine, (vaccine) => vaccine.citizen)
  vaccines: Vaccine[];
  @OneToOne(() => Citizen)
  @JoinColumn()
  citizen: Citizen;
}
