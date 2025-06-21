import { HttpStatus } from "../http-status.enum";
import { HttpException } from "./http.exception";

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || "Not Found", HttpStatus.NOT_FOUND);
  }
}
