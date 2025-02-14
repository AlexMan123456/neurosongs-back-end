const seed = require("../database/seed")
const data = require("../database/test-data")

beforeEach(() => {
    return seed(data)
})

describe("Quick test to check on seeding", () => {
    test("1 is equal to 1.", () => {
        expect(1).toBe(1);
    }) 
})