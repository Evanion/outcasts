import {
  AfterLoad,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PersonaFRN } from "../frn/persona.frn";

@Entity()
export class Persona {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  frn: string;

  @AfterLoad()
  setFrn() {
    this.frn = PersonaFRN.stringify(this.id);
  }
}
