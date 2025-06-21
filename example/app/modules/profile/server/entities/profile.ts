import {
  AfterLoad,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProfileFRN } from "../frn/profile.frn";
import { v5 as uuidv5 } from "uuid";

@Entity()
export class Profile {
  @PrimaryColumn({ type: "uuid", update: false })
  id: string;

  @Column()
  givenName: string;

  @Column()
  surname: string;

  name: string;

  @Index({ unique: true })
  @Column()
  nid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  frn: string;

  @BeforeInsert()
  setId() {
    this.id = this.generateId(this.nid);
  }

  @AfterLoad()
  setFrnAndName() {
    this.frn = ProfileFRN.stringify(this.id);
    this.name = `${this.givenName} ${this.surname}`;
  }

  private generateId(identifier: string) {
    return uuidv5(identifier, this.NAMESPACE);
  }

  private readonly NAMESPACE =
    process.env.PROFILE_NAMESPACE || "7a633c3b-6c5b-4b73-8f1b-06744b120544";
}
