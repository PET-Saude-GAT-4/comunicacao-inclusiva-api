import { ErrorBase } from "./base.error.js";

export class ForbiddenError extends ErrorBase {
    constructor(message = "Forbidden") {
        super(403, message);
    }
}
