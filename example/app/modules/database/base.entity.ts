import { AfterLoad, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { FRN } from "../../lib/frn";

export abstract class BaseEntity {
  abstract get id(): string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  frn!: string;

  @AfterLoad()
  setFrn() {
    this.frn = FRN.stringify(
      this.id,
      this.constructor.name.toLocaleLowerCase()
    );
  }
}
