import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../errors/custom-api";

export class BadRequestError extends CustomAPIError {
  constructor(message) {
    // console.log("bad request");
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
