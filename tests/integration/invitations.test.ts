import { describe, expect, it } from "@jest/globals";
import request from "supertest";

import app from "@/app.js";

import { createToken, createUser, prisma } from "../support/db.js";
import { outbox } from "../support/nodemailer.js";
import { login, tokenFromLastMail } from "../support/requests.js";

const NEW_PASSWORD = "chosen-password";

describe("POST /invitations/accept", () => {
  it("confirms the account and sets the password", async () => {
    const user = await createUser({
      email: "bia@test.local",
      confirmed: false,
    });
    const token = await createToken({ userId: user.id, purpose: "INVITATION" });

    const res = await request(app)
      .post("/invitations/accept")
      .send({ token, password: NEW_PASSWORD });

    expect(res.status).toBe(200);
    const stored = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });
    expect(stored.confirmedAt).not.toBeNull();
    expect((await login("bia@test.local", NEW_PASSWORD)).status).toBe(200);
  });

  it("rejects a token that was never issued", async () => {
    await createUser({ email: "bia@test.local", confirmed: false });

    const res = await request(app)
      .post("/invitations/accept")
      .send({ token: "f".repeat(64), password: NEW_PASSWORD });

    expect(res.status).toBe(400);
  });

  it("rejects a token that was already used", async () => {
    const user = await createUser({
      email: "bia@test.local",
      confirmed: false,
    });
    const token = await createToken({ userId: user.id, purpose: "INVITATION" });
    await request(app)
      .post("/invitations/accept")
      .send({ token, password: NEW_PASSWORD });

    const res = await request(app)
      .post("/invitations/accept")
      .send({ token, password: "another-password" });

    expect(res.status).toBe(400);
    expect((await login("bia@test.local", NEW_PASSWORD)).status).toBe(200);
  });

  it("rejects an expired token and leaves the account unconfirmed", async () => {
    const user = await createUser({
      email: "bia@test.local",
      confirmed: false,
    });
    const token = await createToken({
      userId: user.id,
      purpose: "INVITATION",
      expiresAt: new Date(Date.now() - 1000),
    });

    const res = await request(app)
      .post("/invitations/accept")
      .send({ token, password: NEW_PASSWORD });

    expect(res.status).toBe(400);
    const stored = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });
    expect(stored.confirmedAt).toBeNull();
  });

  it("rejects a password-reset token used as an invitation", async () => {
    const user = await createUser({
      email: "bia@test.local",
      password: "old-password",
    });
    const resetToken = await createToken({
      userId: user.id,
      purpose: "PASSWORD_RESET",
    });
    const storedResetToken = await prisma.userToken.findFirstOrThrow({
      where: { userId: user.id },
    });

    // Reset tokens are stored hashed; neither the raw nor the stored value works here.
    for (const token of [resetToken, storedResetToken.token]) {
      const res = await request(app)
        .post("/invitations/accept")
        .send({ token, password: NEW_PASSWORD });
      expect(res.status).toBe(400);
    }
  });

  it("rejects a password shorter than the minimum", async () => {
    const user = await createUser({
      email: "bia@test.local",
      confirmed: false,
    });
    const token = await createToken({ userId: user.id, purpose: "INVITATION" });

    const res = await request(app)
      .post("/invitations/accept")
      .send({ token, password: "short" });

    expect(res.status).toBe(400);
    const stored = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });
    expect(stored.confirmedAt).toBeNull();
  });

  it("requires token and password", async () => {
    const res = await request(app)
      .post("/invitations/accept")
      .send({ token: "abc" });

    expect(res.status).toBe(400);
  });
});

describe("POST /invitations/resend", () => {
  it("mails a new invitation to a pending account and retires the previous one", async () => {
    const user = await createUser({
      email: "bia@test.local",
      confirmed: false,
    });
    const oldToken = await createToken({
      userId: user.id,
      purpose: "INVITATION",
    });

    const res = await request(app)
      .post("/invitations/resend")
      .send({ email: "bia@test.local" });

    expect(res.status).toBe(200);
    expect(outbox).toHaveLength(1);
    expect(outbox[0]?.to).toBe("bia@test.local");
    const newToken = tokenFromLastMail();
    expect(newToken).not.toBe(oldToken);

    const withOld = await request(app)
      .post("/invitations/accept")
      .send({ token: oldToken, password: NEW_PASSWORD });
    expect(withOld.status).toBe(400);

    const withNew = await request(app)
      .post("/invitations/accept")
      .send({ token: newToken, password: NEW_PASSWORD });
    expect(withNew.status).toBe(200);
  });

  it("answers a confirmed account and an unknown email like a pending one, without mailing", async () => {
    await createUser({ email: "bia@test.local", confirmed: false });
    await createUser({ email: "caio@test.local", password: "caio-password" });

    const pending = await request(app)
      .post("/invitations/resend")
      .send({ email: "bia@test.local" });
    const confirmed = await request(app)
      .post("/invitations/resend")
      .send({ email: "caio@test.local" });
    const unknown = await request(app)
      .post("/invitations/resend")
      .send({ email: "nobody@test.local" });

    for (const res of [confirmed, unknown]) {
      expect(res.status).toBe(pending.status);
      expect(res.body).toEqual(pending.body);
    }
    expect(outbox.map((mail) => mail.to)).toEqual(["bia@test.local"]);
  });

  it("requires an email", async () => {
    const res = await request(app).post("/invitations/resend").send({});

    expect(res.status).toBe(400);
  });
});
