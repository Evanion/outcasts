import { Container } from "typedi";
import { DATABASE_TOKEN } from "./constants";
import { appDataSource } from "./data-source";

await appDataSource.initialize();

if (!Container.has(DATABASE_TOKEN))
  Container.set(DATABASE_TOKEN, appDataSource);
