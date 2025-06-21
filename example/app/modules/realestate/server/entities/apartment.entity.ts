import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Building } from "./building.entity";
import { IsInt, Min } from "class-validator";
import { ApartmentFRN } from "../frn/apartment.frn";

@Entity()
export class Apartment {
  @PrimaryColumn()
  id: string;

  @Column()
  buildingFrn: string;

  building: Building;

  @IsInt()
  @Column({ type: "int" })
  floor: number;

  @IsInt()
  @Min(1)
  @Column({ type: "int" })
  rooms: number;

  @IsInt()
  @Column({ type: "int" })
  rent: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  frn: string;

  @AfterLoad()
  setFrn() {
    this.frn = ApartmentFRN.stringify(this.id);
  }
}
