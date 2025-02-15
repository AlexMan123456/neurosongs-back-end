const seed = require("../database/seed")
const data = require("../database/test-data")

jest.setTimeout(60000);

beforeEach(async () => {
    await seed(data)
})

describe("Quick test to check on seeding", () => {
    test("1 is equal to 1.", () => {
        expect(1).toBe(1);
    }) 
})