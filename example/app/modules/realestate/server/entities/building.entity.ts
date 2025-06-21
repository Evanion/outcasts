import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Apartment } from "./apartment.entity";
import type { Area } from "./area.entity";
import { BuildingFRN } from "../frn/building.frn";

@Entity()
export class Building {
  @PrimaryColumn()
  id: string;

  @Column()
  address: string;

  @Column()
  areaFrn: string;

  area: Area;

  apartments: Apartment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  frn: string;

  @AfterLoad()
  setFrn() {
    this.frn = BuildingFRN.stringify(this.id);
  }
}
