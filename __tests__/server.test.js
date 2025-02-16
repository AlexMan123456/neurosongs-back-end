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
                    expect(typeof user.artist_name).toBe("string");
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
                artist_name: "Test User",
                email: "testuser2@test.com"
            })
            .expect(201)
            .then((response) => {
                const {user} = response.body
                expect(user.username).toBe("TestUser123")
                expect(user.artist_name).toBe("Test User")
                expect(user.email).toBe("testuser2@test.com")
                expect(user.is_verified).toBe(false)
            })
        })
        test("201: Ignores any extra properties on request object", () => {
            return request(app)
            .post("/api/users")
            .send({
                username: "TestUser123",
                artist_name: "Test User",
                email: "testuser2@test.com",
                extraKey: "Extra property"
            })
            .expect(201)
            .then((response) => {
                const {user} = response.body
                expect(user.username).toBe("TestUser123");
                expect(user.artist_name).toBe("Test User");
                expect(user.email).toBe("testuser2@test.com");
                expect(user.is_verified).toBe(false);
                expect(user).not.toHaveProperty("extraKey");
            })
        })
        test("400: Responds with a bad request message if any required properties are missing", () => {
            return request(app)
            .post("/api/users")
            .send({
                artist_name: "Test User",
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
                artist_name: "Test User",
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
                artist_name: "Test User",
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
                artist_name: "Test User",
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
                artist_name: "Faker",
                email: "captain-kevin@thefarisland.com"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Unique constraint violation");
            })
        })
    })
})

describe("/api/users/:username", () => {
    describe("GET", () => {
        test("200: Responds with the user with the given username", () => {
            return request(app)
            .get("/api/users/AlexTheMan")
            .expect(200)
            .then((response) => {
                const {user} = response.body;
                expect(user.username).toBe("AlexTheMan");
                expect(user.artist_name).toBe("Alex The Man");
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

describe("/api/users/:username/albums", () => {
    describe("GET", () => {
        test("200: Responds with an array of all albums from a given user", () => {
            return request(app)
            .get("/api/users/AlexTheMan/albums")
            .expect(200)
            .then((response) => {
                expect(response.body.albums.length).not.toBe(0)
                response.body.albums.forEach((album) => {
                    expect(typeof album.album_id).toBe("number")
                    expect(album.username).toBe("AlexTheMan")
                    expect(typeof album.title).toBe("string")
                    expect(typeof album.front_cover_reference).toBe("string")
                    expect(album).toHaveProperty("back_cover_reference")
                })
            })
        })
        test("200: Responds with an empty array if user has no albums", () => {
            return request(app)
            .get("/api/users/Badstagram/albums")
            .expect(200)
            .then((response) => {
                expect(response.body.albums.length).toBe(0)
            })
        })
        test("404: Responds with a not found message if user does not exist", () => {
            return request(app)
            .get("/api/users/nonexistent_user/albums")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("User not found")
            })
        })
    })
    describe("POST", () => {
        test("201: Posts an album to the database and returns the created album", () => {
            return Promise.all([
                request(app)
                .post("/api/users/AlexTheMan/albums")
                .send({
                    title: "Neural Anthems",
                    front_cover_reference: "./neural-anthems.png"
                })
                .expect(201)
                .then((response) => {
                    const {album} = response.body;
                    expect(album.username).toBe("AlexTheMan")
                    expect(album.title).toBe("Neural Anthems")
                    expect(album.front_cover_reference).toBe("./neural-anthems.png")
                }),
                request(app)
                .post("/api/users/AlexGB231/albums")
                .send({
                    title: "Universal Expedition",
                    front_cover_reference: "./universal-expedition.png",
                    back_cover_reference: "./back-cover.png"
                })
                .expect(201)
                .then((response) => {
                    const {album} = response.body;
                    expect(album.username).toBe("AlexGB231")
                    expect(album.title).toBe("Universal Expedition")
                    expect(album.front_cover_reference).toBe("./universal-expedition.png")
                    expect(album.back_cover_reference).toBe("./back-cover.png")
                })
            ])
        })
        test("201: Ignores any extra keys on request object", () => {
            return request(app)
            .post("/api/users/AlexTheMan/albums")
            .send({
                title: "Extraordinary Escapade",
                front_cover_reference: "./extraordinary-escapade.png",
                back_cover_reference: "./back-cover.png",
                extraKey: "Extra property"
            })
            .expect(201)
            .then((response) => {
                const {album} = response.body;
                expect(album.username).toBe("AlexTheMan")
                expect(album.title).toBe("Extraordinary Escapade")
                expect(album.front_cover_reference).toBe("./extraordinary-escapade.png")
                expect(album.back_cover_reference).toBe("./back-cover.png")
            })
        })
        test("404: Responds with a not found message if user does not exist", () => {
            return request(app)
            .post("/api/users/nonexistent_user/albums")
            .send({
                title: "Test album",
                front_cover_reference: "./front-cover.png",
                back_cover_reference: "./back-cover.png"
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Related property not found")
            })
        })
    })
})

describe("/api/albums/:album_id", () => {
    describe("GET", () => {
        test("200: Responds with the album with the corresponding album ID, along with its songs", () => {
            return request(app)
            .get("/api/albums/1")
            .expect(200)
            .then((response) => {
                const {album} = response.body;
                expect(album.album_id).toBe(1)
                expect(album.username).toBe("AlexTheMan")
                expect(album.title).toBe("Identities")
                expect(album.front_cover_reference).toBe("./identities-front-cover.png")
                expect(album.back_cover_reference).toBe("./identities-back-cover.png")
                expect(album.songs.length).not.toBe(0)
                album.songs.forEach((song) => {
                    expect(typeof song.username).toBe("string")
                    expect(typeof song.title).toBe("string")
                    expect(typeof song.reference).toBe("string")
                    expect(song.album_id).toBe(1)
                })
            })
        })
        test("400: Responds with a bad request message when given an invalid album ID", () => {
            return request(app)
            .get("/api/albums/invalid_id")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message if album ID does not exist", () => {
            return request(app)
            .get("/api/albums/231")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Album not found");
            })
        })
    })
})

describe("/api/albums/:album_id/songs", () => {
    describe("POST", () => {
        test("201: Creates a song for the given album", () => {
            return request(app)
            .post("/api/albums/1/songs")
            .send({
                username: "AlexTheMan",
                title: "Highest Power",
                reference: "./highest-power.mp3",
            })
            .expect(201)
            .then((response) => {
                const {song} = response.body
                expect(typeof song.song_id).toBe("number")
                expect(song.album_id).toBe(1)
                expect(song.username).toBe("AlexTheMan")
                expect(song.title).toBe("Highest Power")
                expect(song.reference).toBe("./highest-power.mp3")
            })
        })
        test("400: Responds with a bad request message when missing required properties", () => {
            return request(app)
            .post("/api/albums/1/songs")
            .send({
                username: "AlexTheMan",
                title: "Highest Power"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message when given an invalid album ID", () => {
            return request(app)
            .post("/api/albums/invalid_id/songs")
            .send({
                username: "AlexTheMan",
                title: "Highest Power",
                reference: "./highest-power.mp3",
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("404: Responds with a not found message when given an album ID that does not exist", () => {
            return request(app)
            .post("/api/albums/231/songs")
            .send({
                username: "AlexTheMan",
                title: "Highest Power",
                reference: "./highest-power.mp3",
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Related property not found")
            })
        })
        test("404: Responds with a not found message when given a username that does not exist", () => {
            return request(app)
            .post("/api/albums/1/songs")
            .send({
                username: "InvalidUser",
                title: "Highest Power",
                reference: "./highest-power.mp3"
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Related property not found")
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