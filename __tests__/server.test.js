const request = require("supertest");
const app = require("../server/app");
const { execSync } = require("node:child_process")

beforeEach(() => {
    execSync("dotenv -e ./.env.test -- yarn prisma db seed");
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
                    expect(typeof user.is_verified).toBe("boolean");
                })
            })
        })
    })
    describe("POST", () => {
        test("201: Posts a user to database and returns the created user", () => {
            return request(app)
            .post("/api/users")
            .send({
                username: "TestUser123",
                global_name: "Test User",
                email: "testuser2@test.com"
            })
            .expect(201)
            .then((response) => {
                const {user} = response.body
                expect(user.username).toBe("TestUser123")
                expect(user.global_name).toBe("Test User")
                expect(user.email).toBe("testuser2@test.com")
                expect(user.is_verified).toBe(false)
            })
        })
        test("201: Ignores any extra properties on request object", () => {
            return request(app)
            .post("/api/users")
            .send({
                username: "TestUser123",
                global_name: "Test User",
                email: "testuser2@test.com",
                extraKey: "Extra property"
            })
            .expect(201)
            .then((response) => {
                const {user} = response.body
                expect(user.username).toBe("TestUser123");
                expect(user.global_name).toBe("Test User");
                expect(user.email).toBe("testuser2@test.com");
                expect(user.is_verified).toBe(false);
                expect(user).not.toHaveProperty("extraKey");
            })
        })
        test("400: Responds with a bad request message if any required properties are missing", () => {
            return request(app)
            .post("/api/users")
            .send({
                global_name: "Test User",
                email: "test@test.com"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("400: Responds with a bad request message if username has spaces", () => {
            return request(app)
            .post("/api/users")
            .send({
                username: "Test User 123",
                global_name: "Test User",
                email: "test@test.com"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid username");
            })
        })
        test("400: Responds with a bad request message if email does not contain @ symbol", () => {
            return request(app)
            .post("/api/users")
            .send({
                username: "TestUser123",
                global_name: "Test User",
                email: "veryAwesomeTestUserEmail"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid email");
            })
        })
        test("400: Responds with a bad request message if username is not unique", () => {
            return request(app)
            .post("/api/users")
            .send({
                username: "AlexTheMan",
                global_name: "Test User",
                email: "test@test.com"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Unique constraint violation");
            })
        })
        test("400: Responds with a bad request message if email is not unique", () => {
            return request(app)
            .post("/api/users")
            .send({
                username: "FakeUser123",
                global_name: "Faker",
                email: "captain-kevin@thefarisland.com"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Unique constraint violation");
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
                expect(user.is_verified).toBe(true);
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

describe("/api/users/:username/songs", () => {
    describe("GET", () => {
        test("200: Responds with an array of all songs from a given user", () => {
            return request(app)
            .get("/api/users/AlexTheMan/songs")
            .expect(200)
            .then((response) => {
                expect(response.body.songs.length).not.toBe(0)
                response.body.songs.forEach((song) => {
                    expect(typeof song.song_id).toBe("number")
                    expect(song.username).toBe("AlexTheMan")
                    expect(typeof song.reference).toBe("string")
                    expect(typeof song.album_id).toBe("number")
                })
            })
        })
        test("200: Responds with an empty array if user exists but has no songs", () => {
            return request(app)
            .get("/api/users/Badstagram/songs")
            .expect(200)
            .then((response) => {
                expect(response.body.songs.length).toBe(0)
            })
        })
        test("404: Responds with a not found message if user does not exist", () => {
            return request(app)
            .get("/api/users/invalid_user/songs")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("User not found")
            })
        })
    })
    describe("POST", () => {
        test("201: Posts a song to the database and returns the new song", () => {
            return request(app)
            .post("/api/users/Kevin_SynthV/songs")
            .send({
                title: "Clowning Around",
                reference: "./clowning-around.mp3",
                album_id: 2
            })
            .expect(201)
            .then((response) => {
                const {song} = response.body
                expect(typeof song.song_id).toBe("number")
                expect(song.username).toBe("Kevin_SynthV")
                expect(song.title).toBe("Clowning Around")
                expect(song.reference).toBe("./clowning-around.mp3")
                expect(song.album_id).toBe(2)
            })
        })
        test("400: Responds with a bad request message if any required properties are missing", () => {
            return request(app)
            .post("/api/users/AlexTheMan/songs")
            .send({
                title: "Highest Power",
                reference: "./highest-power.mp3"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if album ID is invalid", () => {
            return request(app)
            .post("/api/users/AlexTheMan/songs")
            .send({
                title: "Highest Power",
                reference: "./highest-power.mp3",
                album_id: "Neural Anthems"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
    })
})

describe("/api/songs", () => {
    describe("GET", () => {
        test("200: Responds with an array of all songs", () => {
            return request(app)
            .get("/api/songs")
            .expect(200)
            .then((response) => {
                expect(response.body.songs.length).not.toBe(0);
                response.body.songs.forEach((song) => {
                    expect(typeof song.song_id).toBe("number")
                    expect(typeof song.username).toBe("string")
                    expect(typeof song.reference).toBe("string")
                    expect(typeof song.album_id).toBe("number")
                })
            })
        })
    })
})


describe("/api/songs/:song_id", () => {
    describe("GET", () => {
        test("200: Responds with the song with the given ID", () => {
            return request(app)
            .get("/api/songs/1")
            .expect(200)
            .then((response) => {
                const {song} = response.body
                expect(song.song_id).toBe(1)
                expect(song.title).toBe("Captain Kevin")
                expect(song.username).toBe("AlexTheMan")
                expect(song.reference).toBe("./captain-kevin.mp3")
                expect(song.album_id).toBe(1)
            })
        })
        test("400: Responds with a bad request message when given an invalid ID", () => {
            return request(app)
            .get("/api/songs/invalid_id")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("404: Responds with a not found message when ID does not exist", () => {
            return request(app)
            .get("/api/songs/231")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Song not found")
            })
        })
    })
})

describe("/*", () => {
    test("404: Responds with a not found message if endpoint does not exist", () => {
        return request(app)
        .get("/invalid_endpoint")
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe("Endpoint not found")
        })
    })
})