const request = require("supertest");
const app = require("../server/app");
const { execSync } = require("node:child_process")

jest.setTimeout(30000)

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
                    expect(typeof user.user_id).toBe("string");
                    expect(typeof user.username).toBe("string");
                    expect(typeof user.artist_name).toBe("string");
                    expect(typeof user.email).toBe("string");
                    expect(typeof user.profile_picture).toBe("string");
                    expect(user).toHaveProperty("description");
                })
            })
        })
    })
    describe("POST", () => {
        test("201: Posts a user to database and returns the created user", () => {
            return request(app)
            .post("/api/users")
            .send({
                user_id: "5",
                username: "TestUser123",
                artist_name: "Test User",
                email: "test@test.com",
                profile_picture: "test-profile-picture.jpg",
                description: "Test description"
            })
            .expect(201)
            .then((response) => {
                const {user} = response.body;
                expect(user.user_id).toBe("5");
                expect(user.username).toBe("TestUser123");
                expect(user.artist_name).toBe("Test User");
                expect(user.email).toBe("test@test.com");
                expect(user.profile_picture).toBe("test-profile-picture.jpg");
                expect(user.description).toBe("Test description");
            })
        })
        test("201: Any optional properties can be left out of request", () => {
            return request(app)
            .post("/api/users")
            .send({
                user_id: "5",
                username: "TestUser123",
                artist_name: "Test User",
                email: "test@test.com"
            })
            .expect(201)
            .then((response) => {
                const {user} = response.body;
                expect(user.user_id).toBe("5");
                expect(user.username).toBe("TestUser123");
                expect(user.artist_name).toBe("Test User");
                expect(user.email).toBe("test@test.com");
                expect(user.profile_picture).toBe("default-profile-picture.jpg");
                expect(user.description).toBe(null);
            })
        })
        test("201: Ignores any extra properties on request object", () => {
            return request(app)
            .post("/api/users")
            .send({
                user_id: "5",
                username: "TestUser123",
                artist_name: "Test User",
                email: "testuser2@test.com",
                extraKey: "Extra property"
            })
            .expect(201)
            .then((response) => {
                const {user} = response.body;
                expect(user.user_id).toBe("5");
                expect(user.username).toBe("TestUser123");
                expect(user.artist_name).toBe("Test User");
                expect(user.email).toBe("testuser2@test.com");
                expect(user.profile_picture).toBe("default-profile-picture.jpg");
                expect(user.description).toBe(null);
                expect(user).not.toHaveProperty("extraKey");
            })
        })
        test("400: Responds with a bad request message if user ID contains forward slash", () => {
            return request(app)
            .post("/api/users")
            .send({
                user_id: "5/e",
                username: "TestUser123",
                artist_name: "Test User",
                email: "test@test.com",
                profile_picture: "test-profile-picture.jpg",
                description: "Test description"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid user ID");
            })
        })
        test("400: Responds with a bad request message if profile picture is not a valid file name", () => {
            return request(app)
            .post("/api/users")
            .send({
                user_id: "5",
                username: "TestUser123",
                artist_name: "Test User",
                email: "test@test.com",
                profile_picture: "Test profile picture",
                description: "Test description"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid file name")
            })
        })
        test("400: Responds with a bad request message if profile picture is a file directory", () => {
            return request(app)
            .post("/api/users")
            .send({
                user_id: "5",
                username: "TestUser123",
                artist_name: "Test User",
                email: "test@test.com",
                profile_picture: "test-profile/picture.jpg",
                description: "Test description"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid file name")
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
                user_id: "5",
                username: "Test User 123",
                artist_name: "Test User",
                email: "test@test.com"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Username must not contain spaces.");
            })
        })
        test("400: Responds with a bad request message if username has @ symbol", () => {
            return request(app)
            .post("/api/users")
            .send({
                user_id: "5",
                username: "TestUser@123",
                artist_name: "Test User",
                email: "test@test.com"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Username must not contain @ symbol.");
            })
        })
        test("400: Responds with a bad request message if email does not contain @ symbol", () => {
            return request(app)
            .post("/api/users")
            .send({
                user_id: "5",
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
                user_id: "5",
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
                user_id: "5",
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

describe("/api/users/:user_id", () => {
    describe("GET", () => {
        test("200: Responds with the user with the given user ID", () => {
            return request(app)
            .get("/api/users/1")
            .expect(200)
            .then((response) => {
                const {user} = response.body;
                expect(user.user_id).toBe("1");
                expect(user.username).toBe("AlexTheMan");
                expect(user.artist_name).toBe("Alex The Man");
                expect(user.email).toBe("alextheman231231@gmail.com");
                expect(user.profile_picture).toBe("KoolAlex.png");
                expect(user.description).toBe("I am cool!");
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
    describe("PATCH", () => {
        test("200: Updates the given user with the new given properties", () => {
            return request(app)
            .patch("/api/users/1")
            .send({
                username: "Alex.Reborn",
                artist_name: "Alex Reborn",
                description: "And now I feel reborn!",
                email: "alexreborn@gmail.com",
                profile_picture: "i-feel-reborn.png"
            })
            .expect(200)
            .then((response) => {
                const {user} = response.body
                expect(user.user_id).toBe("1");
                expect(user.username).toBe("Alex.Reborn");
                expect(user.artist_name).toBe("Alex Reborn");
                expect(user.description).toBe("And now I feel reborn!");
                expect(user.email).toBe("alexreborn@gmail.com");
                expect(user.profile_picture).toBe("i-feel-reborn.png");
            })
        })
        test("200: Updates existing properties even if some are missing", () => {
            return request(app)
            .patch("/api/users/1")
            .send({
                username: "Alex.Reborn",
                artist_name: "Alex Reborn",
                profile_picture: "i-feel-reborn.png"
            })
            .expect(200)
            .then((response) => {
                const {user} = response.body
                expect(user.user_id).toBe("1");
                expect(user.username).toBe("Alex.Reborn");
                expect(user.artist_name).toBe("Alex Reborn");
                expect(user.description).toBe("I am cool!");
                expect(user.email).toBe("alextheman231231@gmail.com");
                expect(user.profile_picture).toBe("i-feel-reborn.png");
            })
        })
        test("200: Updates the given user with the new given properties", () => {
            return request(app)
            .patch("/api/users/1")
            .send({
                username: "Alex.Reborn",
                artist_name: "Alex Reborn",
                description: "And now I feel reborn!",
                email: "alexreborn@gmail.com",
                profile_picture: "i-feel-reborn.png",
                extraKey: "Extra property"
            })
            .expect(200)
            .then((response) => {
                const {user} = response.body
                expect(user.user_id).toBe("1");
                expect(user.username).toBe("Alex.Reborn");
                expect(user.artist_name).toBe("Alex Reborn");
                expect(user.description).toBe("And now I feel reborn!");
                expect(user.email).toBe("alexreborn@gmail.com");
                expect(user.profile_picture).toBe("i-feel-reborn.png");
            })
        })
        test("400: Does not allow user to update the user ID", () => {
            return request(app)
            .patch("/api/users/1")
            .send({
                user_id: "I'm feeling so reborn, I'm updating my ID!",
                username: "Alex.Reborn",
                artist_name: "Alex Reborn",
                description: "And now I feel reborn!",
                email: "alexreborn@gmail.com",
                profile_picture: "i-feel-reborn.png"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if profile picture reference is not a valid file name", () => {
            return request(app)
            .patch("/api/users/1")
            .send({
                username: "Alex.Reborn",
                artist_name: "Alex Reborn",
                description: "And now I feel reborn!",
                email: "alexreborn@gmail.com",
                profile_picture: "I feel reborn"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid file name")
            })
        })
        test("400: Responds with a bad request message if profile picture reference is a file directory", () => {
            return request(app)
            .patch("/api/users/1")
            .send({
                username: "Alex.Reborn",
                artist_name: "Alex Reborn",
                description: "And now I feel reborn!",
                email: "alexreborn@gmail.com",
                profile_picture: "i-feel/reborn.png"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid file name")
            })
        })
    })
})

describe("/api/users/:user_id/albums", () => {
    describe("GET", () => {
        test("200: Responds with an array of all albums from a given user", () => {
            return request(app)
            .get("/api/users/1/albums")
            .expect(200)
            .then((response) => {
                expect(response.body.albums.length).not.toBe(0)
                response.body.albums.forEach((album) => {
                    expect(typeof album.album_id).toBe("number")
                    expect(typeof album.user_id).toBe("string")
                    expect(album.artist.artist_name).toBe("Alex The Man")
                    expect(album.artist.username).toBe("AlexTheMan")
                    expect(typeof album.is_featured).toBe("boolean")
                    expect(typeof album.title).toBe("string")
                    expect(typeof album.front_cover_reference).toBe("string")
                    expect(album).toHaveProperty("back_cover_reference")
                })
            })
        })
        test("200: Responds with an empty array if user has no albums", () => {
            return request(app)
            .get("/api/users/4/albums")
            .expect(200)
            .then((response) => {
                expect(response.body.albums.length).toBe(0);
            })
        })
        test("404: Responds with a not found message if user does not exist", () => {
            return request(app)
            .get("/api/users/nonexistent_user/albums")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("User not found");
            })
        })
    })
    describe("POST", () => {
        test("201: Posts an album to the database and returns the created album", () => {
            return Promise.all([
                request(app)
                .post("/api/users/1/albums")
                .send({
                    title: "Neural Anthems",
                    front_cover_reference: "neural-anthems.png"
                })
                .expect(201)
                .then((response) => {
                    const {album} = response.body;
                    expect(album.user_id).toBe("1")
                    expect(album.artist.artist_name).toBe("Alex The Man")
                    expect(album.artist.username).toBe("AlexTheMan")
                    expect(album.title).toBe("Neural Anthems")
                    expect(album.front_cover_reference).toBe("neural-anthems.png")
                    expect(album.is_featured).toBe(false)
                }),
                request(app)
                .post("/api/users/2/albums")
                .send({
                    title: "Universal Expedition",
                    front_cover_reference: "universal-expedition.png",
                    back_cover_reference: "back-cover.png"
                })
                .expect(201)
                .then((response) => {
                    const {album} = response.body;
                    expect(typeof album.album_id).toBe("number");
                    expect(album.user_id).toBe("2");
                    expect(album.artist.artist_name).toBe("AlexGB231");
                    expect(album.artist.username).toBe("AlexGB231");
                    expect(album.title).toBe("Universal Expedition");
                    expect(album.front_cover_reference).toBe("universal-expedition.png");
                    expect(album.back_cover_reference).toBe("back-cover.png");
                    expect(album.is_featured).toBe(false);
                })
            ])
        })
        test("201: Ignores any extra keys on request object", () => {
            return request(app)
            .post("/api/users/1/albums")
            .send({
                title: "Extraordinary Escapade",
                front_cover_reference: "extraordinary-escapade.png",
                back_cover_reference: "back-cover.png",
                extraKey: "Extra property"
            })
            .expect(201)
            .then((response) => {
                const {album} = response.body;
                expect(typeof album.album_id).toBe("number");
                expect(album.user_id).toBe("1");
                expect(album.artist.artist_name).toBe("Alex The Man");
                expect(album.artist.username).toBe("AlexTheMan");
                expect(album.title).toBe("Extraordinary Escapade");
                expect(album.front_cover_reference).toBe("extraordinary-escapade.png");
                expect(album.back_cover_reference).toBe("back-cover.png");
                expect(album.is_featured).toBe(false);
            })
        })
        test("400: Responds with a bad request message if front cover reference is not a valid file name", () => {
            return request(app)
            .post("/api/users/1/albums")
            .send({
                title: "Universal Expedition",
                front_cover_reference: "Universal Expedition",
                back_cover_reference: "back-cover.png"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid file name")
            })
        })
        test("400: Responds with a bad request message if front cover reference is a file directory", () => {
            return request(app)
            .post("/api/users/1/albums")
            .send({
                title: "Universal Expedition",
                front_cover_reference: "universal/expedition.mp3",
                back_cover_reference: "back-cover.png"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid file name")
            })
        })
        test("400: Responds with a bad request message if back cover reference is not a valid file name", () => {
            return request(app)
            .post("/api/users/1/albums")
            .send({
                title: "Universal Expedition",
                front_cover_reference: "universal-expedition.mp3",
                back_cover_reference: "Back Cover"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid file name")
            })
        })
        test("400: Responds with a bad request message if back cover reference is a file directory", () => {
            return request(app)
            .post("/api/users/1/albums")
            .send({
                title: "Universal Expedition",
                front_cover_reference: "universal-expedition.mp3",
                back_cover_reference: "back/cover.png"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid file name")
            })
        })
        test("404: Responds with a not found message if user does not exist", () => {
            return request(app)
            .post("/api/users/nonexistent_user/albums")
            .send({
                title: "Test album",
                front_cover_reference: "front-cover.png",
                back_cover_reference: "back-cover.png"
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Related property not found");
            })
        })
    })
})

describe("/api/albums", () => {
    describe("GET", () => {
        test("200: Responds with an array of all albums", () => {
            return request(app)
            .get("/api/albums")
            .expect(200)
            .then((response) => {
                expect(response.body.albums.length).not.toBe(0);
                response.body.albums.forEach((album) => {
                    expect(typeof album.album_id).toBe("number");
                    expect(typeof album.user_id).toBe("string");
                    expect(typeof album.artist.username).toBe("string");
                    expect(typeof album.artist.artist_name).toBe("string");
                    expect(typeof album.is_featured).toBe("boolean");
                    expect(typeof album.title).toBe("string");
                    expect(typeof album.front_cover_reference).toBe("string");
                    expect(album).toHaveProperty("back_cover_reference");
                })
            })
        })
        describe("Queries: is_featured", () => {
            test("200: Responds with an array of all featured albums", () => {
                return request(app)
                .get("/api/albums?is_featured=true")
                .expect(200)
                .then((response) => {
                    expect(response.body.albums.length).not.toBe(0);
                    response.body.albums.forEach((album) => {
                        expect(typeof album.album_id).toBe("number");
                        expect(typeof album.user_id).toBe("string");
                        expect(typeof album.artist.username).toBe("string");
                        expect(typeof album.artist.artist_name).toBe("string");
                        expect(album.is_featured).toBe(true);
                        expect(typeof album.title).toBe("string");
                        expect(typeof album.front_cover_reference).toBe("string");
                        expect(album).toHaveProperty("back_cover_reference");
                    })
                })
            })
            test("400: Responds with a bad request message if is_featured is not a boolean", () => {
                return request(app)
                .get("/api/albums?is_featured=not_a_boolean")
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe("Bad request");
                })
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
                expect(album.album_id).toBe(1);
                expect(album.user_id).toBe("1");
                expect(album.artist.username).toBe("AlexTheMan");
                expect(album.artist.artist_name).toBe("Alex The Man");
                expect(album.title).toBe("Identities");
                expect(album.front_cover_reference).toBe("identities-front-cover.png");
                expect(album.back_cover_reference).toBe("identities-back-cover.png");
                expect(album.is_featured).toBe(false);
                expect(album.songs.length).not.toBe(0);
                album.songs.forEach((song) => {
                    expect(typeof song.song_id).toBe("number");
                    expect(typeof song.artist.username).toBe("string");
                    expect(typeof song.artist.artist_name).toBe("string");
                    expect(typeof song.title).toBe("string");
                    expect(typeof song.reference).toBe("string");
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
                user_id: "1",
                title: "Highest Power",
                reference: "highest-power.mp3"
            })
            .expect(201)
            .then((response) => {
                const {song} = response.body;
                expect(typeof song.song_id).toBe("number");
                expect(song.album_id).toBe(1);
                expect(song.user_id).toBe("1");
                expect(song.artist.username).toBe("AlexTheMan");
                expect(song.artist.artist_name).toBe("Alex The Man");
                expect(song.title).toBe("Highest Power");
                expect(song.reference).toBe("highest-power.mp3");
                expect(song.is_featured).toBe(false);
            })
        })
        test("400: Responds with a bad request message when missing required properties", () => {
            return request(app)
            .post("/api/albums/1/songs")
            .send({
                user_id: "1",
                title: "Highest Power"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("400: Responds with a bad request message if song reference is not a valid file name", () => {
            return request(app)
            .post("/api/albums/1/songs")
            .send({
                user_id: "1",
                title: "Highest Power",
                reference: "You think that I am at my HIIIIGHEST POOOOWER!"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid file name");
            })
        })
        test("400: Responds with a bad request message if song reference is a file directory", () => {
            return request(app)
            .post("/api/albums/1/songs")
            .send({
                user_id: "1",
                title: "Highest Power",
                reference: "highest/power.mp3"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid file name");
            })
        })
        test("400: Responds with a bad request message when given an invalid album ID", () => {
            return request(app)
            .post("/api/albums/invalid_id/songs")
            .send({
                user_id: "1",
                title: "Highest Power",
                reference: "highest-power.mp3"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message when given an album ID that does not exist", () => {
            return request(app)
            .post("/api/albums/231/songs")
            .send({
                user_id: "1",
                title: "Highest Power",
                reference: "highest-power.mp3"
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Related property not found");
            })
        })
        test("404: Responds with a not found message when given a username that does not exist", () => {
            return request(app)
            .post("/api/albums/1/songs")
            .send({
                user_id: "InvalidUser",
                title: "Highest Power",
                reference: "highest-power.mp3"
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Related property not found");
            })
        })
    })
})

describe("/api/users/:user_id/songs", () => {
    describe("GET", () => {
        test("200: Responds with an array of all songs from a given user", () => {
            return request(app)
            .get("/api/users/1/songs")
            .expect(200)
            .then((response) => {
                expect(response.body.songs.length).not.toBe(0);
                response.body.songs.forEach((song) => {
                    expect(typeof song.song_id).toBe("number");
                    expect(song.user_id).toBe("1");
                    expect(song.artist.username).toBe("AlexTheMan");
                    expect(song.artist.artist_name).toBe("Alex The Man");
                    expect(typeof song.reference).toBe("string");
                    expect(typeof song.album_id).toBe("number");
                    expect(typeof song.is_featured).toBe("boolean");
                })
            })
        })
        test("200: Responds with an empty array if user exists but has no songs", () => {
            return request(app)
            .get("/api/users/4/songs")
            .expect(200)
            .then((response) => {
                expect(response.body.songs.length).toBe(0);
            })
        })
        test("404: Responds with a not found message if user does not exist", () => {
            return request(app)
            .get("/api/users/invalid_user/songs")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("User not found");
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
                    expect(typeof song.song_id).toBe("number");
                    expect(typeof song.user_id).toBe("string");
                    expect(typeof song.artist.username).toBe("string");
                    expect(typeof song.artist.artist_name).toBe("string");
                    expect(typeof song.reference).toBe("string");
                    expect(typeof song.album_id).toBe("number");
                    expect(typeof song.is_featured).toBe("boolean");
                })
            })
        })
        describe("Queries: is_featured", () => {
            test("200: Responds with an array of all featured songs", () => {
                return request(app)
                .get("/api/songs?is_featured=true")
                .expect(200)
                .then((response) => {
                    expect(response.body.songs.length).not.toBe(0);
                    response.body.songs.forEach((song) => {
                        expect(typeof song.song_id).toBe("number");
                        expect(typeof song.user_id).toBe("string");
                        expect(typeof song.artist.username).toBe("string");
                        expect(typeof song.artist.artist_name).toBe("string");
                        expect(typeof song.reference).toBe("string");
                        expect(typeof song.album_id).toBe("number");
                        expect(song.is_featured).toBe(true);
                    })
                })
            })
            test("200: The query value is case insensitive", () => {
                return request(app)
                .get("/api/songs?is_featured=True")
                .expect(200)
                .then((response) => {
                    expect(response.body.songs.length).not.toBe(0);
                    response.body.songs.forEach((song) => {
                        expect(typeof song.song_id).toBe("number");
                        expect(typeof song.user_id).toBe("string");
                        expect(typeof song.artist.username).toBe("string");
                        expect(typeof song.artist.artist_name).toBe("string");
                        expect(typeof song.reference).toBe("string");
                        expect(typeof song.album_id).toBe("number");
                        expect(song.is_featured).toBe(true);
                    })
                })
            })
            test("400: Responds with a bad request message if is_featured is not a boolean", () => {
                return request(app)
                .get("/api/songs?is_featured=not_a_boolean")
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe("Bad request");
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
                const {song} = response.body;
                expect(song.song_id).toBe(1);
                expect(song.title).toBe("Captain Kevin");
                expect(song.user_id).toBe("1");
                expect(song.artist.username).toBe("AlexTheMan");
                expect(song.artist.artist_name).toBe("Alex The Man");
                expect(song.reference).toBe("captain-kevin.mp3");
                expect(song.album_id).toBe(1);
                expect(song.is_featured).toBe(true);
            })
        })
        test("400: Responds with a bad request message when given an invalid ID", () => {
            return request(app)
            .get("/api/songs/invalid_id")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message when ID does not exist", () => {
            return request(app)
            .get("/api/songs/231")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Song not found");
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
            expect(response.body.message).toBe("Endpoint not found");
        })
    })
})