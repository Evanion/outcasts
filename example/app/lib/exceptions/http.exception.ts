import type { HttpStatus } from "../http-status.enum";

export class HttpException extends Error {
  constructor(message: string, public status: HttpStatus) {
    super(message);
  }
}
