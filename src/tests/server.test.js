import supertest from "supertest";
import { app } from "../server.js";

import {
  restoreDb,
  populateDb,
  getFixtures,
  ensureDbConnection,
  normalize,
  closeDbConnection,
} from "./utils.js";
import { getById } from "../stores/whisper.js";

let whispers;
let inventedId;
let existingId;
let firstUser;
let secondUser;

describe("Server", () => {
  beforeAll(ensureDbConnection);
  beforeEach(async () => {
    await restoreDb();
    await populateDb(whispers);
    const fixtures = await getFixtures();
    whispers = fixtures.whispers;
    inventedId = fixtures.inventedId;
    existingId = fixtures.existingId;
    firstUser = fixtures.firstUser;
    secondUser = fixtures.secondUser;
  });
  afterAll(() => closeDbConnection());

  describe("GET /api/v1/whisper", () => {
    it("Should return an empty array when there's no data", async () => {
      await restoreDb();
      const response = await supertest(app).get("/api/v1/whisper");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("Should return all the whispers", async () => {
      const response = await supertest(app).get("/api/v1/whisper");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(whispers);
    });
  });

  describe("GET /api/v1/whisper/:id", () => {
    it("Should return a 404 when the whisper doesn't exist", async () => {
      const response = await supertest(app).get(`/api/v1/whisper/${inventedId}`);
      expect(response.status).toBe(404);
    });

    it("Should return a whisper details", async () => {
      const response = await supertest(app).get(`/api/v1/whisper/${existingId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(whispers.find((w) => w.id === existingId));
    });
  });

  describe("POST /api/v1/whisper", () => {
    it("Should return a 400 when the body is empty", async () => {
      const response = await supertest(app)
        .post("/api/v1/whisper")
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({});
      expect(response.status).toBe(400);
    });

    it("Should return a 400 when the body is invalid", async () => {
      const response = await supertest(app)
        .post("/api/v1/whisper")
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({ invented: "This is a new whisper" });
      expect(response.status).toBe(400);
    });

    it("Should return a 201 when the whisper is created", async () => {
      const newWhisper = { message: "This is a new whisper" };
      const response = await supertest(app)
        .post("/api/v1/whisper")
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({ message: newWhisper.message });

      expect(response.status).toBe(201);
      expect(response.body.message).toEqual(newWhisper.message, firstUser);

      const storedWhisper = await getById(response.body.id);

      expect(normalize(storedWhisper).message).toStrictEqual(newWhisper.message);
    });
  });

  describe("PUT /api/v1/whisper/:id", () => {
    it("Should return a 400 when the body is empty", async () => {
      const response = await supertest(app)
        .put(`/api/v1/whisper/${existingId}`)
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({});
      expect(response.status).toBe(400);
    });

    it("Should return a 400 when the body is invalid", async () => {
      const response = await supertest(app)
        .put(`/api/v1/whisper/${existingId}`)
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({ invented: "This a new field" });
      expect(response.status).toBe(400);
    });

    it("Should return a 404 when the whisper doesn't exist", async () => {
      const response = await supertest(app)
        .put(`/api/v1/whisper/${inventedId}`)
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({ message: "Whisper updated" });
      expect(response.status).toBe(404);
    });

    it("Should return a 200 when the whisper is updated", async () => {
      const response = await supertest(app)
        .put(`/api/v1/whisper/${existingId}`)
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({ message: "Whisper updated" });
      expect(response.status).toBe(200);

      const storedWhisper = await getById(existingId);
      const normalizedWhisper = normalize(storedWhisper);
      expect(normalizedWhisper.id).toBe(existingId);
      expect(normalizedWhisper.message).toBe("Whisper updated");
    });
  });

  describe("DELETE /api/v1/whisper/:id", () => {
    it("Should return a 404 when the whisper doesn't exist", async () => {
      const response = await supertest(app)
        .delete(`/api/v1/whisper/${inventedId}`)
        .set("Authentication", `Bearer ${firstUser.token}`);
      expect(response.status).toBe(404);
    });
    it("Should return a 200 when the whisper is deleted", async () => {
      const response = await supertest(app)
        .delete(`/api/v1/whisper/${existingId}`)
        .set("Authentication", `Bearer ${firstUser.token}`);
      expect(response.status).toBe(200);
      const storedWhisper = await getById(existingId);
      expect(storedWhisper).toBe(null);
    });
  });
});
