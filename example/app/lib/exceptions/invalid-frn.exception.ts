import { HttpStatus } from "../http-status.enum";
import { HttpException } from "./http.exception";

export class InvalidFrnException extends HttpException {
  constructor(frn?: string) {
    super(
      frn ? `INVALID_${frn.toUpperCase()}_FRN` : "INVALID_FRN",
      HttpStatus.BAD_REQUEST
    );
  }
}
