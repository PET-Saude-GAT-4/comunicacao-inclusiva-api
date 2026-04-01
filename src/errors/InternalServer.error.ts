import { ErrorBase } from "./base.error.js";

export class InternalServerError extends ErrorBase{
    constructor(message ="Internal server error"){
        super(500, message);
    }
}