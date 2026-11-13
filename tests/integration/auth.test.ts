import { describe, expect, it } from "@jest/globals";
import request from "supertest";

import app from "@/app.js";

import { createToken, createUser, prisma } from "../support/db.js";
import { outbox } from "../support/nodemailer.js";

const PASSWORD = "correct-horse";

function tokenFromLastMail(): string {
  const token = outbox.at(-1)?.html.match(/token=([a-f0-9]+)/)?.[1];
  if (!token) throw new Error("No token found in the last captured email");
  return token;
}

describe("POST /auth/login", () => {
  it("returns a token and the user for valid credentials", async () => {
    const user = await createUser({
      email: "ana@test.local",
      password: PASSWORD,
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "ana@test.local", password: PASSWORD });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.user).toMatchObject({
      id: user.id,
      email: "ana@test.local",
    });
  });

  it("rejects a wrong password", async () => {
    await createUser({ email: "ana@test.local", password: PASSWORD });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "ana@test.local", password: "wrong-password" });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });

  it("rejects an unknown email with the same answer as a wrong password", async () => {
    await createUser({ email: "ana@test.local", password: PASSWORD });

    const unknown = await request(app)
      .post("/auth/login")
      .send({ email: "nobody@test.local", password: PASSWORD });
    const wrongPassword = await request(app)
      .post("/auth/login")
      .send({ email: "ana@test.local", password: "wrong-password" });

    expect(unknown.status).toBe(401);
    expect(unknown.body).toEqual(wrongPassword.body);
  });

  it("rejects an account that was never confirmed", async () => {
    await createUser({
      email: "ana@test.local",
      password: PASSWORD,
      confirmed: false,
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "ana@test.local", password: PASSWORD });

    expect(res.status).toBe(403);
    expect(res.body.token).toBeUndefined();
  });

  it("requires email and password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "ana@test.local" });

    expect(res.status).toBe(400);
  });
});

describe("POST /auth/password-reset", () => {
  it("answers registered and unregistered emails the same way, mailing only the registered one", async () => {
    await createUser({ email: "ana@test.local", password: PASSWORD });

    const registered = await request(app)
      .post("/auth/password-reset")
      .send({ email: "ana@test.local" });
    const unregistered = await request(app)
      .post("/auth/password-reset")
      .send({ email: "nobody@test.local" });

    expect(registered.status).toBe(200);
    expect(unregistered.status).toBe(registered.status);
    expect(unregistered.body).toEqual(registered.body);
    expect(outbox).toHaveLength(1);
    expect(outbox[0]?.to).toBe("ana@test.local");
  });
});

describe("POST /auth/password-reset/confirm", () => {
  async function login(password: string) {
    return request(app)
      .post("/auth/login")
      .send({ email: "ana@test.local", password });
  }

  it("changes the password with the token from the reset email", async () => {
    await createUser({ email: "ana@test.local", password: PASSWORD });
    await request(app)
      .post("/auth/password-reset")
      .send({ email: "ana@test.local" });

    const res = await request(app)
      .post("/auth/password-reset/confirm")
      .send({ token: tokenFromLastMail(), password: "brand-new-password" });

    expect(res.status).toBe(200);
    expect((await login("brand-new-password")).status).toBe(200);
    expect((await login(PASSWORD)).status).toBe(401);
  });

  it("rejects a token that was never issued", async () => {
    await createUser({ email: "ana@test.local", password: PASSWORD });

    const res = await request(app)
      .post("/auth/password-reset/confirm")
      .send({ token: "f".repeat(64), password: "brand-new-password" });

    expect(res.status).toBe(400);
    expect((await login(PASSWORD)).status).toBe(200);
  });

  it("rejects an expired token", async () => {
    const user = await createUser({
      email: "ana@test.local",
      password: PASSWORD,
    });
    const token = await createToken({
      userId: user.id,
      purpose: "PASSWORD_RESET",
      expiresAt: new Date(Date.now() - 1000),
    });

    const res = await request(app)
      .post("/auth/password-reset/confirm")
      .send({ token, password: "brand-new-password" });

    expect(res.status).toBe(400);
    expect((await login(PASSWORD)).status).toBe(200);
  });

  it("rejects a token that was already used", async () => {
    await createUser({ email: "ana@test.local", password: PASSWORD });
    await request(app)
      .post("/auth/password-reset")
      .send({ email: "ana@test.local" });
    const token = tokenFromLastMail();
    await request(app)
      .post("/auth/password-reset/confirm")
      .send({ token, password: "brand-new-password" });

    const res = await request(app)
      .post("/auth/password-reset/confirm")
      .send({ token, password: "another-password" });

    expect(res.status).toBe(400);
    expect((await login("brand-new-password")).status).toBe(200);
  });

  it("rejects an invitation token used as a reset token", async () => {
    const user = await createUser({
      email: "ana@test.local",
      password: PASSWORD,
    });
    const token = await createToken({ userId: user.id, purpose: "INVITATION" });

    const res = await request(app)
      .post("/auth/password-reset/confirm")
      .send({ token, password: "brand-new-password" });

    expect(res.status).toBe(400);
  });

  it("leaves the token usable when the new password is too short", async () => {
    const user = await createUser({
      email: "ana@test.local",
      password: PASSWORD,
    });
    const token = await createToken({
      userId: user.id,
      purpose: "PASSWORD_RESET",
    });

    const res = await request(app)
      .post("/auth/password-reset/confirm")
      .send({ token, password: "short" });

    expect(res.status).toBe(400);
    const stored = await prisma.userToken.findFirstOrThrow({
      where: { userId: user.id },
    });
    expect(stored.usedAt).toBeNull();
  });
});
