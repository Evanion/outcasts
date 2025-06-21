import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Building } from "./building.entity";
import { AreaFRN } from "../frn/area.frn";
import { AreaStatus } from "../enums/area-status.enum";

@Entity()
export class Area {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  slug: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column({ type: "enum", enum: AreaStatus, default: AreaStatus.AVAILABLE })
  status: AreaStatus;

  buildings: Building[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  frn: string;

  @AfterLoad()
  setFrn() {
    this.frn = AreaFRN.stringify(this.id);
  }
}
