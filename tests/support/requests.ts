import request from "supertest";

import app from "@/app.js";

import { outbox } from "./nodemailer.js";

export function login(email: string, password: string) {
  return request(app).post("/auth/login").send({ email, password });
}

/** The token in the link of the most recent captured email (invitation or reset). */
export function tokenFromLastMail(): string {
  const token = outbox.at(-1)?.html.match(/token=([a-f0-9]+)/)?.[1];
  if (!token) throw new Error("No token found in the last captured email");
  return token;
}
