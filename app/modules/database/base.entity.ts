import { AfterLoad, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { URN } from "@evanion/urn";

@Entity()
export abstract class BaseEntity {
  abstract get id(): string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  urn!: string;

  @AfterLoad()
  setUrn() {
    this.urn = URN.stringify(
      this.id,
      this.constructor.name.toLocaleLowerCase()
    );
  }
}
