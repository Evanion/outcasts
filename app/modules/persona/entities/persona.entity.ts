import {
  AfterLoad,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PersonaURN } from "../urn/persona.urn";

@Entity()
export class Persona {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  urn!: string;

  @AfterLoad()
  setUrn() {
    this.urn = PersonaURN.stringify(this.id);
  }
}
