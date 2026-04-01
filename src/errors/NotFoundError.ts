import { ErrorBase } from "./base.error.js";

export class NotFoundError extends ErrorBase{
    constructor(message ="Route not found"){
        super(404, message);
    }
}