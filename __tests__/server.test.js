const seed = require("../database/seed");
const data = require("../database/test-data");
const request = require("supertest");
const app = require("../server/app");
const { execSync } = require("node:child_process")

jest.setTimeout(60000);

beforeEach(async () => {
    execSync("dotenv -e ./.env.test -- yarn prisma migrate reset --force");
    await seed(data);
})

describe("/api/users", () => {
    describe("GET", () => {
        test("200: Responds with an array of all users", () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then((response) => {
                expect(response.body.users.length).not.toBe(0)
                response.body.users.forEach((user) => {
                    expect(typeof user.username).toBe("string");
                    expect(typeof user.global_name).toBe("string");
                    expect(typeof user.email).toBe("string");
                    expect(typeof user.is_artist).toBe("boolean");
                })
            })
        })
    })
})

describe("/api/user/:username", () => {
    describe("GET", () => {
        test("200: Responds with the user with the given username", () => {
            return request(app)
            .get("/api/users/AlexTheMan")
            .expect(200)
            .then((response) => {
                const {user} = response.body;
                expect(user.username).toBe("AlexTheMan");
                expect(user.global_name).toBe("Alex The Man");
                expect(user.email).toBe("alextheman231231@gmail.com");
                expect(user.is_artist).toBe(true);
            })
        })
        test("404: Responds with a not found message if user not found in database", () => {
            return request(app)
            .get("/api/users/nonexistent_user")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("User not found")
            })
        })
    })
})