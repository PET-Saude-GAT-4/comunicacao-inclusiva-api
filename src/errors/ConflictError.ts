import { ErrorBase } from "./base.error.js";

export class ConflictError extends ErrorBase {
    constructor(message = "Conflict") {
        super(409, message);
    }
}
