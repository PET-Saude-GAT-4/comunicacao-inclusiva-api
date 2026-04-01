import { ErrorBase } from "./base.error.js";

export class UnauthorizedError extends ErrorBase {
    constructor(message = "Unauthorized") {
        super(401, message);
    }
}
