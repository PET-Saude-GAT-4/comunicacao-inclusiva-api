import type { Request, Response } from 'express';

interface Icontroller<T>{
    findById?(request: Request, response: Response): Promise<Response | void>;
    findAll(request: Request, response: Response): Promise<Response | void>;
    create(request: Request, response: Response): Promise<Response | void>;
    update?(request: Request, response: Response): Promise<Response | void>;
    delete?(request: Request, response: Response): Promise<Response | void>;
}

export type {Icontroller};