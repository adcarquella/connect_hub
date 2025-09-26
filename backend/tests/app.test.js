process.env.ENCRYPTION_KEY_BASE64 = Buffer.alloc(32, 0).toString("base64");

const request = require("supertest");
const { app, encryptPayload, decryptPayload } = require("../app");

// Provide a test encryption key
process.env.ENCRYPTION_KEY_BASE64 = Buffer.alloc(32, 0).toString("base64");

describe("API", () => {
    it("GET /api/hello returns Hello World", async () => {
        const res = await request(app).get("/api/hello");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Hello World" });
    });

    it("POST /api/data encrypts and decrypts payload correctly", async () => {
        const payload = { foo: "bar" };
        const encrypted = encryptPayload(JSON.stringify(payload));

        const res = await request(app)
            .post("/api/data")
            .send({ payload: encrypted });
        console.log(res.status);

        expect(res.statusCode).toBe(200);
        expect(res.body.payload).toBeDefined();

        // decrypt response
        const decrypted = decryptPayload(res.body.payload);
        const parsed = JSON.parse(decrypted);
        expect(parsed.received).toEqual(payload);
    });
});
