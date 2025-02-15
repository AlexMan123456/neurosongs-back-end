const seed = require("../database/seed")
const data = require("../database/test-data")
const request = require("supertest");
const app = require("../server/app");

jest.setTimeout(60000);

beforeEach(async () => {
    await seed(data)
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