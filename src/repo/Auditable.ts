import { Column, BaseEntity } from "typeorm";

export class Auditable extends BaseEntity {
  @Column("varchar", {
    name: "createdBy",
    length: 60,
    default: () => `getpgusername()`,
    nullable: false,
  })
  createdBy: string;
  @Column("time with time zone", {
    name: "createdOn",
    default: () => `now()`,
    nullable: false,
  })
  createdOn: Date;
  @Column("varchar", {
    name: "lastModifiedBy",
    length: 60,
    default: () => `getpgusername()`,
    nullable: false,
  })
  lastModifiedBy: string;
  @Column("time with time zone", {
    name: "lastModifiedOn",
    default: () => `now()`,
    nullable: false,
  })
  lastModifiedOn: Date;
}
