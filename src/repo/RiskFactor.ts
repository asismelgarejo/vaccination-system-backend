import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Auditable } from "./Auditable";

@Entity({ name: "RiskFactors" })
export class RiskFactor extends Auditable {
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
}
