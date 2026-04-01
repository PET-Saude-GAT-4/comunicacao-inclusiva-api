import { ErrorBase } from "./base.error.js";

export class BadRequestError extends ErrorBase {
    constructor(message = "Bad Request") {
        super(400, message);
    }
}
