const request = require("supertest");
const app = require("../server/app");
require("jest-sorted")
const data = require("../prisma/test-data");
const seed = require("../prisma/seed");
const endpoints = require("../server/endpoints.json");

jest.setTimeout(30000)

beforeEach(() => {
    return seed(data);
})

describe("/api", () => {
    test("200: Responds with a list of all endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
            expect(response.body.endpoints).toEqual(endpoints);
        })
    })
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
                description: "Test description",
                date_of_birth: new Date("2003-02-22T00:00:00.000Z")
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
                expect(user.date_of_birth).toBe("2003-02-22T00:00:00.000Z");
            })
        })
        test("201: Any optional properties can be left out of request", () => {
            return request(app)
            .post("/api/users")
            .send({
                user_id: "5",
                username: "TestUser123",
                artist_name: "Test User",
                email: "test@test.com",
                date_of_birth: new Date("2003-02-22T00:00:00.000Z")
            })
            .expect(201)
            .then((response) => {
                const {user} = response.body;
                expect(user.user_id).toBe("5");
                expect(user.username).toBe("TestUser123");
                expect(user.artist_name).toBe("Test User");
                expect(user.email).toBe("test@test.com");
                expect(user.profile_picture).toBe("Default");
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
                date_of_birth: new Date("2003-02-22T00:00:00.000Z"),
                extraKey: "Extra property"
            })
            .expect(201)
            .then((response) => {
                const {user} = response.body;
                expect(user.user_id).toBe("5");
                expect(user.username).toBe("TestUser123");
                expect(user.artist_name).toBe("Test User");
                expect(user.email).toBe("testuser2@test.com");
                expect(user.profile_picture).toBe("Default");
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
                date_of_birth: new Date("2003-02-22T00:00:00.000Z"),
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
                date_of_birth: new Date("2003-02-22T00:00:00.000Z"),
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
                date_of_birth: new Date("2003-02-22T00:00:00.000Z"),
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
                email: "test@test.com",
                date_of_birth: new Date("2003-02-22T00:00:00.000Z")
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
                email: "test@test.com",
                date_of_birth: new Date("2003-02-22T00:00:00.000Z")
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
                email: "veryAwesomeTestUserEmail",
                date_of_birth: new Date("2003-02-22T00:00:00.000Z")
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
                email: "test@test.com",
                date_of_birth: new Date("2003-02-22T00:00:00.000Z")
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
                email: "captain-kevin@thefarisland.com",
                date_of_birth: new Date("2003-02-22T00:00:00.000Z")
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
        test("200: Responds with the user with the given user_id", () => {
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
                expect(user.date_of_birth).toBe("2003-07-16T00:00:00.000Z");
                expect(user.member_since).toBe("2024-02-15T00:00:00.000Z");
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
                profile_picture: "i-feel-reborn.png",
                date_of_birth: new Date("2002-07-16T00:00:00Z")
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
                expect(user.date_of_birth).toBe("2002-07-16T00:00:00.000Z");
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
        test("200: Ignores any extra keys on request object", () => {
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
                expect(user).not.toHaveProperty("extraKey");
            })
        })
        test("200: Can change back to a default profile picture", () => {
            return request(app)
            .patch("/api/users/1")
            .send({
                profile_picture: "Default",
            })
            .expect(200)
            .then((response) => {
                const {user} = response.body
                expect(user.profile_picture).toBe("Default");
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
                    expect(album).toHaveProperty("created_at");
                    expect(album).not.toHaveProperty("description");
                })
            })
        })
        describe("Queries: user_id", () => {
            test("200: Responds with an array of all albums from a given user", () => {
                return request(app)
                .get("/api/albums?user_id=1")
                .expect(200)
                .then((response) => {
                    expect(response.body.albums.length).not.toBe(0)
                    response.body.albums.forEach((album) => {
                        expect(typeof album.album_id).toBe("number")
                        expect(album.user_id).toBe("1")
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
                .get("/api/albums?user_id=4")
                .expect(200)
                .then((response) => {
                    expect(response.body.albums.length).toBe(0);
                })
            })
            test("404: Responds with a not found message if user does not exist", () => {
                return request(app)
                .get("/api/albums?user_id=nonexistent_user")
                .expect(404)
                .then((response) => {
                    expect(response.body.message).toBe("User not found");
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
    describe("POST", () => {
        test("201: Posts an album to the database and returns the created album", () => {
            return Promise.all([
                request(app)
                .post("/api/albums")
                .send({
                    user_id: "1",
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
                .post("/api/albums")
                .send({
                    user_id: "2",
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
            .post("/api/albums")
            .send({
                user_id: "1",
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
        test("201: If left out, front_cover_reference defaults to Default", () => {
            return request(app)
            .post("/api/albums")
            .send({
                user_id: "1",
                title: "Neural Anthems"
            })
            .expect(201)
            .then((response) => {
                const {album} = response.body;
                expect(album.user_id).toBe("1")
                expect(album.artist.artist_name).toBe("Alex The Man")
                expect(album.artist.username).toBe("AlexTheMan")
                expect(album.title).toBe("Neural Anthems")
                expect(album.front_cover_reference).toBe("Default")
                expect(album.is_featured).toBe(false)
            })
        })
        test("400: Responds with a bad request message if front cover reference is not a valid file name", () => {
            return request(app)
            .post("/api/albums")
            .send({
                user_id: "1",
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
            .post("/api/albums")
            .send({
                user_id: "1",
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
            .post("/api/albums")
            .send({
                user_id: "1",
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
            .post("/api/albums")
            .send({
                user_id: "1",
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
            .post("/api/albums")
            .send({
                user_id: "nonexistent_user",
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

describe("/api/albums/:album_id", () => {
    describe("GET", () => {
        test("200: Responds with the album with the corresponding album ID, along with its songs", () => {
            return request(app)
            .get("/api/albums/3")
            .expect(200)
            .then((response) => {
                const {album} = response.body;
                expect(album.album_id).toBe(3);
                expect(album.user_id).toBe("3");
                expect(album.artist.username).toBe("Kevin_SynthV");
                expect(album.artist.artist_name).toBe("Kevin");
                expect(album.title).toBe("Kevin's Greatest Hits");
                expect(album.front_cover_reference).toBe("captain-kevin.png");
                expect(album.back_cover_reference).toBe("clown-kevin.png");
                expect(album.is_featured).toBe(false);
                expect(album.description).toBe("CAPTAIN KEVIN, SEARCHING FOR TREASURE FAR AND WIDE!");
                expect(album.songs.length).not.toBe(0);
                expect(album).toHaveProperty("created_at");
                expect(album.songs).toBeSortedBy("created_at", {ascending: true});
                album.songs.forEach((song) => {
                    expect(typeof song.song_id).toBe("number");
                    expect(typeof song.artist.username).toBe("string");
                    expect(typeof song.artist.artist_name).toBe("string");
                    expect(typeof song.title).toBe("string");
                    expect(typeof song.reference).toBe("string");
                })
            })
        })
        test("200: Average rating is rounded to one decimal place", () => {
            return request(app)
            .get("/api/albums/3")
            .expect(200)
            .then((response) => {
                expect((response.body.album.average_rating*10)%1).toBe(0)
            })
        })
        test("200: Average rating is null if album has not been rated yet", () => {
            return request(app)
            .get("/api/albums/1")
            .expect(200)
            .then((response) => {
                expect(response.body.album.average_rating).toBe(null)
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
    describe("PATCH", () => {
        test("200: Updates the album with the given ID and responds with the updated album", () => {
            return request(app)
            .patch("/api/albums/3")
            .send({
                title: "Never Gonna Give You Up",
                front_cover_reference: "rickroll.png",
                back_cover_reference: "kevinroll.png",
                description: "Never gonna give you up, never gonna let you down!"
            })
            .expect(200)
            .then((response) => {
                const {album} = response.body;
                expect(typeof album.album_id).toBe("number");
                expect(album.title).toBe("Never Gonna Give You Up");
                expect(album.front_cover_reference).toBe("rickroll.png");
                expect(album.back_cover_reference).toBe("kevinroll.png");
                expect(album.description).toBe("Never gonna give you up, never gonna let you down!")
            })
        })
        test("200: Ignores any extra keys on request body", () => {
            return request(app)
            .patch("/api/albums/3")
            .send({
                title: "Never Gonna Give You Up",
                front_cover_reference: "rickroll.png",
                back_cover_reference: "kevinroll.png",
                description: "Never gonna give you up, never gonna let you down!",
                extraKey: "Extra property"
            })
            .expect(200)
            .then((response) => {
                const {album} = response.body;
                expect(typeof album.album_id).toBe("number");
                expect(album.title).toBe("Never Gonna Give You Up");
                expect(album.front_cover_reference).toBe("rickroll.png");
                expect(album.back_cover_reference).toBe("kevinroll.png");
                expect(album.description).toBe("Never gonna give you up, never gonna let you down!")
            })
        })
        test("400: Does not allow user_id to be edited", () => {
            return request(app)
            .patch("/api/albums/3")
            .send({
                user_id: "1",
                title: "Never Gonna Give You Up",
                front_cover_reference: "rickroll.png",
                back_cover_reference: "kevinroll.png",
                description: "Never gonna give you up, never gonna let you down!"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if album_id is in request body", () => {
            return request(app)
            .patch("/api/albums/3")
            .send({
                album_id: 1,
                title: "Never Gonna Give You Up",
                front_cover_reference: "rickroll.png",
                back_cover_reference: "kevinroll.png",
                description: "Never gonna give you up, never gonna let you down!"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if album_id parameter is invalid", () => {
            return request(app)
            .patch("/api/albums/invalid_id")
            .send({
                title: "Never Gonna Give You Up",
                front_cover_reference: "rickroll.png",
                back_cover_reference: "kevinroll.png",
                description: "Never gonna give you up, never gonna let you down!"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message if album does not exist", () => {
            return request(app)
            .patch("/api/albums/231")
            .send({
                title: "Never Gonna Give You Up",
                front_cover_reference: "rickroll.png",
                back_cover_reference: "kevinroll.png",
                description: "Never gonna give you up, never gonna let you down!"
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Album not found")
            })
        })
    })
    describe("DELETE", () => {
        test("204: Deletes the given album from the database", () => {
            return request(app)
            .delete("/api/albums/1")
            .expect(204)
        })
        test("400: Responds with a bad request message if album_id is invalid", () => {
            return request(app)
            .delete("/api/albums/invalid_id")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message if album_id does not exist", () => {
            return request(app)
            .delete("/api/albums/231")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Album not found")
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
                description: "You think that I am at my highest power!",
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
                expect(song.description).toBe("You think that I am at my highest power!");
                expect(song.reference).toBe("highest-power.mp3");
                expect(song.is_featured).toBe(false);
                expect(song).toHaveProperty("created_at");
            })
        })
        test("201: Ignores any extra properties on request body", () => {
            return request(app)
            .post("/api/albums/1/songs")
            .send({
                user_id: "1",
                title: "Highest Power",
                description: "You think that I am at my highest power!",
                reference: "highest-power.mp3",
                extraKey: "Extra property"

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
                expect(song.description).toBe("You think that I am at my highest power!");
                expect(song.reference).toBe("highest-power.mp3");
                expect(song.is_featured).toBe(false);
                expect(song).toHaveProperty("created_at");
            })
        })
        test("201: Optional properties can be left out", () => {
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
                expect(song).toHaveProperty("created_at");
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
        test("400: Responds with a bad request message if request body contains album_id", () => {
            return request(app)
            .post("/api/albums/1/songs")
            .send({
                album_id: 1,
                user_id: "1",
                title: "Highest Power",
                description: "You think that I am at my highest power!",
                reference: "highest-power.mp3"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message when given an invalid album_id", () => {
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
        test("404: Responds with a not found message when given an album_id that does not exist", () => {
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
        test("404: Responds with a not found message when given a user_id that does not exist", () => {
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

describe("/api/albums/:album_id/comments", () => {
    describe("GET", () => {
        test("200: Responds with an array of all comments associated with a given album", () => {
            return request(app)
            .get("/api/albums/3/comments")
            .expect(200)
            .then((response) => {
                expect(response.body.comments.length).not.toBe(0)
                response.body.comments.forEach((comment) => {
                    expect(typeof comment.user_id).toBe("string");
                    expect(comment.album_id).toBe(3);
                    expect(typeof comment.author.artist_name).toBe("string");
                    expect(typeof comment.author.username).toBe("string");
                    expect(typeof comment.author.profile_picture).toBe("string");
                    expect(typeof comment.body).toBe("string");
                    expect(comment).toHaveProperty("created_at");
                    expect(comment).not.toHaveProperty("song_id");
                })
            })
        })
        test("200: Responds with an empty array if album has no comments", () => {
            return request(app)
            .get("/api/albums/1/comments")
            .expect(200)
            .then((response) => {
                expect(response.body.comments.length).toBe(0);
            })
        })
        test("400: Responds with a bad request message if album ID is invalid", () => {
            return request(app)
            .get("/api/albums/captain_kevin/comments")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message if album does not exist", () => {
            return request(app)
            .get("/api/albums/231/comments")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Album not found");
            })
        })
    })
    describe("POST", () => {
        test("201: Posts a new comment and responds with the posted comment", () => {
            return request(app)
            .post("/api/albums/1/comments")
            .send({
                user_id: "3",
                body: "Captain Kevin! Searching for treasure far and wide!"
            })
            .expect(201)
            .then((response) => {
                const {comment} = response.body;
                expect(comment.user_id).toBe("3");
                expect(comment.author.username).toBe("Kevin_SynthV");
                expect(comment.author.artist_name).toBe("Kevin");
                expect(comment.author.profile_picture).toBe("captain-kevin.png");
                expect(comment.album_id).toBe(1);
                expect(comment.body).toBe("Captain Kevin! Searching for treasure far and wide!");
                expect(comment).toHaveProperty("created_at")
                expect(comment).not.toHaveProperty("song_id")
            })
        })
        test("201: Ignores any extra properties on request body", () => {
            return request(app)
            .post("/api/albums/1/comments")
            .send({
                user_id: "3",
                body: "Captain Kevin! Searching for treasure far and wide!",
                extraKey: "CAAAAAPTAAAIN KEEEEVIIIIN! SEARCHING FOR TREASURE FAR AND WIDE!"
            })
            .expect(201)
            .then((response) => {
                const {comment} = response.body;
                expect(comment.user_id).toBe("3");
                expect(comment.author.username).toBe("Kevin_SynthV");
                expect(comment.author.artist_name).toBe("Kevin");
                expect(comment.author.profile_picture).toBe("captain-kevin.png");
                expect(comment.album_id).toBe(1);
                expect(comment.body).toBe("Captain Kevin! Searching for treasure far and wide!");
                expect(comment).toHaveProperty("created_at")
                expect(comment).not.toHaveProperty("song_id")
                expect(comment).not.toHaveProperty("extraKey")
            })
        })
        test("400: Responds with a bad request message if song_id is included in request body", () => {
            return request(app)
            .post("/api/albums/1/comments")
            .send({
                user_id: "3",
                song_id: 2,
                body: "Captain Kevin! Searching for treasure far and wide!",
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if album_id is included in request body", () => {
            return request(app)
            .post("/api/albums/1/comments")
            .send({
                user_id: "3",
                album_id: 2,
                body: "Captain Kevin! Searching for treasure far and wide!",
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if song_id is invalid", () => {
            return request(app)
            .post("/api/albums/invalid_id/comments")
            .send({
                user_id: "3",
                body: "Captain Kevin! Searching for treasure far and wide!",
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("404: Responds with a bad request message if song_id does not exist", () => {
            return request(app)
            .post("/api/albums/231/comments")
            .send({
                user_id: "3",
                body: "Captain Kevin! Searching for treasure far and wide!",
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Album not found")
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
                    expect(typeof song.album.front_cover_reference).toBe("string");
                    expect(typeof song.album.title).toBe("string");
                    expect(song).toHaveProperty("created_at");
                    expect(song).not.toHaveProperty("description");
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
                        expect(typeof song.album.front_cover_reference).toBe("string");
                        expect(typeof song.album.title).toBe("string");
                        expect(song).not.toHaveProperty("description");
                        expect(song).toHaveProperty("created_at");
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
                        expect(song).not.toHaveProperty("description");
                        expect(song).toHaveProperty("created_at");
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
        describe("Queries: user_id", () => {
            test("200: Responds with an array of all songs from a given user", () => {
                return request(app)
                .get("/api/songs?user_id=1")
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
                        expect(typeof song.album.title).toBe("string");
                        expect(typeof song.album.front_cover_reference).toBe("string");
                        expect(song).not.toHaveProperty("description");
                        expect(song).toHaveProperty("created_at");
                    })
                })
            })
            test("200: Responds with an empty array if user exists but has no songs", () => {
                return request(app)
                .get("/api/songs?user_id=4")
                .expect(200)
                .then((response) => {
                    expect(response.body.songs.length).toBe(0);
                })
            })
            test("404: Responds with a not found message if user does not exist", () => {
                return request(app)
                .get("/api/songs?user_id=invalid_user")
                .expect(404)
                .then((response) => {
                    expect(response.body.message).toBe("User not found");
                })
            })
        })
        describe("Queries: sorting and order", () => {
            test("200: Sorts songs by created_at in descending order by default", () => {
                return request(app)
                .get("/api/songs")
                .expect(200)
                .then((response) => {
                    expect(response.body.songs).toBeSortedBy("created_at", {descending: true});
                })
            })
            test("200: Sorts by the given sort_by query if given", () => {
                return request(app)
                .get("/api/songs?sort_by=title")
                .expect(200)
                .then((response) => {
                    expect(response.body.songs).toBeSortedBy("title", {descending: true});
                })
            })
            test("200: Sorts in ascending order if order query is asc", () => {
                return request(app)
                .get("/api/songs?order=asc")
                .expect(200)
                .then((response) => {
                    expect(response.body.songs).toBeSortedBy("created_at", {ascending: true});
                })
            })
            test("400: Responds with a bad request message if sort_by is invalid", () => {
                return request(app)
                .get("/api/songs?sort_by=invalid_property")
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe("Bad request")
                })
            })
            test("400: Responds with a bad request message if order is invalid", () => {
                return request(app)
                .get("/api/songs?order=invalid_order")
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe("Bad request")
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
                expect(song.album.front_cover_reference).toBe("identities-front-cover.png");
                expect(song.album.back_cover_reference).toBe("identities-back-cover.png");
                expect(song.album.title).toBe("Identities");
                expect(song.description).toBe("He's Captain Kevin, the best there is, he's been collecting treasure for the best of years!");
                expect(typeof song.average_rating).toBe("number");
                expect(song).toHaveProperty("created_at");
            })
        })
        test("200: Average rating is rounded to one decimal place", () => {
            return request(app)
            .get("/api/songs/3")
            .expect(200)
            .then((response) => {
                expect((response.body.song.average_rating*10)%1).toBe(0)
            })
        })
        test("200: Average rating is null if song has not been rated yet", () => {
            return request(app)
            .get("/api/songs/2")
            .expect(200)
            .then((response) => {
                expect(response.body.song.average_rating).toBe(null)
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
    describe("PATCH", () => {
        test("200: Updates the given song and responds with the updated song", () => {
            return request(app)
            .patch("/api/songs/2")
            .send({
                title: "Never Gonna Give You Up",
                reference: "never-gonna-give-you-up.mp3",
                is_featured: false,
                description: "You've been rickrolled!"
            })
            .expect(200)
            .then((response) => {
                const {song} = response.body;
                expect(song.song_id).toBe(2);
                expect(song.user_id).toBe("1");
                expect(song.title).toBe("Never Gonna Give You Up");
                expect(song.reference).toBe("never-gonna-give-you-up.mp3");
                expect(song.is_featured).toBe(false);
                expect(song.description).toBe("You've been rickrolled!");
                expect(song.created_at).toBe("2024-02-16T00:00:00.000Z");
            })
        })
        test("200: Ignores any extra properties on request body", () => {
            return request(app)
            .patch("/api/songs/2")
            .send({
                title: "Never Gonna Give You Up",
                reference: "never-gonna-give-you-up.mp3",
                is_featured: false,
                description: "You've been rickrolled!",
                extraKey: "Extra property"
            })
            .expect(200)
            .then((response) => {
                const {song} = response.body;
                expect(song.song_id).toBe(2);
                expect(song.user_id).toBe("1");
                expect(song.title).toBe("Never Gonna Give You Up");
                expect(song.reference).toBe("never-gonna-give-you-up.mp3");
                expect(song.is_featured).toBe(false);
                expect(song.description).toBe("You've been rickrolled!");
                expect(song.created_at).toBe("2024-02-16T00:00:00.000Z");
            })
        })
        test("400: Responds with a bad request message if request body contains user_id", () => {
            return request(app)
            .patch("/api/songs/2")
            .send({
                user_id: "dQw4w9WgXcQ",
                title: "Never Gonna Give You Up",
                reference: "never-gonna-give-you-up.mp3",
                is_featured: false,
                description: "You've been rickrolled!"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if request body contains album_id", () => {
            return request(app)
            .patch("/api/songs/2")
            .send({
                album_id: 2,
                title: "Never Gonna Give You Up",
                reference: "never-gonna-give-you-up.mp3",
                is_featured: false,
                description: "You've been rickrolled!"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if request body contains song_id", () => {
            return request(app)
            .patch("/api/songs/2")
            .send({
                song_id: 2,
                title: "Never Gonna Give You Up",
                reference: "never-gonna-give-you-up.mp3",
                is_featured: false,
                description: "You've been rickrolled!"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if song_id in parameters is invalid", () => {
            return request(app)
            .patch("/api/songs/invalid_id")
            .send({
                title: "Never Gonna Give You Up",
                reference: "never-gonna-give-you-up.mp3",
                is_featured: false,
                description: "You've been rickrolled!"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message if song does not exist", () => {
            return request(app)
            .patch("/api/songs/231")
            .send({
                title: "Never Gonna Give You Up",
                reference: "never-gonna-give-you-up.mp3",
                is_featured: false,
                description: "You've been rickrolled!"
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Song not found");
            })
        })
    })
    describe("DELETE", () => {
        test("204: Deletes the song with the given song_id from the database", () => {
            return request(app)
            .delete("/api/songs/1")
            .expect(204)
        })
        test("400: Responds with a bad request message if song_id is invalid", () => {
            return request(app)
            .delete("/api/songs/never_gonna_give_you_up")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message if song to delete does not exist", () => {
            return request(app)
            .delete("/api/songs/231")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Song not found")
            })
        })
    })
})

describe("/api/songs/:song_id/comments", () => {
    describe("GET", () => {
        test("200: Responds with an array of all comments associated with a given song", () => {
            return request(app)
            .get("/api/songs/13/comments")
            .expect(200)
            .then((response) => {
                expect(response.body.comments.length).not.toBe(0)
                response.body.comments.forEach((comment) => {
                    expect(typeof comment.user_id).toBe("string");
                    expect(comment.song_id).toBe(13);
                    expect(typeof comment.author.artist_name).toBe("string");
                    expect(typeof comment.author.username).toBe("string");
                    expect(typeof comment.author.profile_picture).toBe("string");
                    expect(typeof comment.body).toBe("string");
                    expect(comment).toHaveProperty("created_at");
                    expect(comment).not.toHaveProperty("album_id");
                })
            })
        })
        test("200: Responds with an empty array if song has no comments", () => {
            return request(app)
            .get("/api/songs/2/comments")
            .expect(200)
            .then((response) => {
                expect(response.body.comments.length).toBe(0);
            })
        })
        test("400: Responds with a bad request message if song ID is invalid", () => {
            return request(app)
            .get("/api/songs/captain_kevin/comments")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message if song does not exist", () => {
            return request(app)
            .get("/api/songs/231/comments")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Song not found");
            })
        })
    })
    describe("POST", () => {
        test("201: Posts a new comment and responds with the posted comment", () => {
            return request(app)
            .post("/api/songs/1/comments")
            .send({
                user_id: "3",
                body: "Captain Kevin! Searching for treasure far and wide!",
            })
            .expect(201)
            .then((response) => {
                const {comment} = response.body;
                expect(comment.user_id).toBe("3");
                expect(comment.author.username).toBe("Kevin_SynthV");
                expect(comment.author.artist_name).toBe("Kevin");
                expect(comment.author.profile_picture).toBe("captain-kevin.png");
                expect(comment.song_id).toBe(1);
                expect(comment.body).toBe("Captain Kevin! Searching for treasure far and wide!");
                expect(comment).toHaveProperty("created_at")
                expect(comment).not.toHaveProperty("album_id")
            })
        })
        test("201: Ignores any extra properties on request body", () => {
            return request(app)
            .post("/api/songs/1/comments")
            .send({
                user_id: "3",
                body: "Captain Kevin! Searching for treasure far and wide!",
                extraKey: "CAAAAAPTAAAIN KEEEEVIIIIN! SEARCHING FOR TREASURE FAR AND WIDE!"
            })
            .expect(201)
            .then((response) => {
                const {comment} = response.body;
                expect(comment.user_id).toBe("3");
                expect(comment.song_id).toBe(1);
                expect(comment.body).toBe("Captain Kevin! Searching for treasure far and wide!");
                expect(comment).toHaveProperty("created_at")
                expect(comment).not.toHaveProperty("album_id")
                expect(comment).not.toHaveProperty("extraKey")
            })
        })
        test("400: Responds with a bad request message if song_id is included in request body", () => {
            return request(app)
            .post("/api/songs/1/comments")
            .send({
                user_id: "3",
                song_id: 2,
                body: "Captain Kevin! Searching for treasure far and wide!",
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if album_id is included in request body", () => {
            return request(app)
            .post("/api/songs/1/comments")
            .send({
                user_id: "3",
                album_id: 2,
                body: "Captain Kevin! Searching for treasure far and wide!",
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if song_id is invalid", () => {
            return request(app)
            .post("/api/songs/invalid_id/comments")
            .send({
                user_id: "3",
                body: "Captain Kevin! Searching for treasure far and wide!",
                rating: 8
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("404: Responds with a bad request message if song_id does not exist", () => {
            return request(app)
            .post("/api/songs/231/comments")
            .send({
                user_id: "3",
                body: "Captain Kevin! Searching for treasure far and wide!",
                rating: 8
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Song not found")
            })
        })
    })
})

describe("/api/songs/:song_id/ratings", () => {
    describe("POST", () => {
        test("201: Creates a new rating for a song", () => {
            return request(app)
            .post("/api/songs/3/ratings")
            .send({
                user_id: "1",
                score: 8,
                is_visible: true
            })
            .expect(201)
            .then((response) => {
                const {rating} = response.body;
                expect(rating.user_id).toBe("1");
                expect(rating.score).toBe(8);
                expect(rating.song_id).toBe(3);
                expect(rating.is_visible).toBe(true);
            })
        })
        test("201: is_visible defaults to false if not provided", () => {
            return request(app)
            .post("/api/songs/3/ratings")
            .send({
                user_id: "1",
                score: 8,
            })
            .expect(201)
            .then((response) => {
                const {rating} = response.body;
                expect(rating.user_id).toBe("1");
                expect(rating.score).toBe(8);
                expect(rating.song_id).toBe(3);
                expect(rating.is_visible).toBe(false);
            })
        })
        test("201: Ignores any extra keys on request object", () => {
            return request(app)
            .post("/api/songs/3/ratings")
            .send({
                user_id: "1",
                score: 8,
                is_visible: true,
                extraKey: "Extra value"
            })
            .expect(201)
            .then((response) => {
                const {rating} = response.body;
                expect(rating.user_id).toBe("1");
                expect(rating.score).toBe(8);
                expect(rating.song_id).toBe(3);
                expect(rating.is_visible).toBe(true);
                expect(rating).not.toHaveProperty("extraKey");
            })
        })
        test("400: Responds with a bad request message if song_id is on request body", () => {
            return request(app)
            .post("/api/songs/3/ratings")
            .send({
                user_id: "1",
                score: 8,
                is_visible: true,
                song_id: 1
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("400: Responds with a bad request message if score is bigger than 10", () => {
            return request(app)
            .post("/api/songs/3/ratings")
            .send({
                user_id: "1",
                score: 11,
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid score");
            })
        })
        test("400: Responds with a bad request message if score is less than 1", () => {
            return request(app)
            .post("/api/songs/3/ratings")
            .send({
                user_id: "1",
                score: -1,
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid score");
            })
        })
        test("400: Responds with a bad request message if song_id is not valid", () => {
            return request(app)
            .post("/api/songs/invalid_id/ratings")
            .send({
                user_id: "1",
                score: 8,
                is_visible: true
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message if song does not exist", () => {
            return request(app)
            .post("/api/songs/231/ratings")
            .send({
                user_id: "1",
                score: 8,
                is_visible: true
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Song not found");
            })
        })
        test("404: Responds with a not found message if user does not exist", () => {
            return request(app)
            .post("/api/songs/3/ratings")
            .send({
                user_id: "dQw4w9WgXcQ",
                score: 8,
                is_visible: true
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Related property not found")
            })
        })
    })
})

describe("/api/albums/:album_id/ratings", () => {
    describe("POST", () => {
        test("201: Creates a new rating for an album", () => {
            return request(app)
            .post("/api/albums/3/ratings")
            .send({
                user_id: "1",
                score: 8,
                is_visible: true
            })
            .expect(201)
            .then((response) => {
                const {rating} = response.body;
                expect(rating.user_id).toBe("1");
                expect(rating.score).toBe(8);
                expect(rating.album_id).toBe(3);
                expect(rating.is_visible).toBe(true);
            })
        })
        test("201: is_visible defaults to false if not provided", () => {
            return request(app)
            .post("/api/albums/3/ratings")
            .send({
                user_id: "1",
                score: 8,
            })
            .expect(201)
            .then((response) => {
                const {rating} = response.body;
                expect(rating.user_id).toBe("1");
                expect(rating.score).toBe(8);
                expect(rating.album_id).toBe(3);
                expect(rating.is_visible).toBe(false);
            })
        })
        test("201: Ignores any extra keys on request object", () => {
            return request(app)
            .post("/api/albums/3/ratings")
            .send({
                user_id: "1",
                score: 8,
                is_visible: true,
                extraKey: "Extra value"
            })
            .expect(201)
            .then((response) => {
                const {rating} = response.body;
                expect(rating.user_id).toBe("1");
                expect(rating.score).toBe(8);
                expect(rating.album_id).toBe(3);
                expect(rating.is_visible).toBe(true);
                expect(rating).not.toHaveProperty("extraKey");
            })
        })
        test("400: Responds with a bad request message if album_id is on request body", () => {
            return request(app)
            .post("/api/albums/3/ratings")
            .send({
                user_id: "1",
                score: 8,
                is_visible: true,
                album_id: 1
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("400: Responds with a bad request message if score is bigger than 10", () => {
            return request(app)
            .post("/api/albums/3/ratings")
            .send({
                user_id: "1",
                score: 11,
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid score");
            })
        })
        test("400: Responds with a bad request message if score is less than 1", () => {
            return request(app)
            .post("/api/albums/3/ratings")
            .send({
                user_id: "1",
                score: -1,
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid score");
            })
        })
        test("400: Responds with a bad request message if song_id is not valid", () => {
            return request(app)
            .post("/api/albums/invalid_id/ratings")
            .send({
                user_id: "1",
                score: 8,
                is_visible: true
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message if album does not exist", () => {
            return request(app)
            .post("/api/albums/231/ratings")
            .send({
                user_id: "1",
                score: 8,
                is_visible: true
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Album not found");
            })
        })
        test("404: Responds with a not found message if user does not exist", () => {
            return request(app)
            .post("/api/albums/3/ratings")
            .send({
                user_id: "dQw4w9WgXcQ",
                score: 8,
                is_visible: true
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Related property not found")
            })
        })
    })
})

describe("/api/ratings/:content_type/:content_id/users/:user_id", () => {
    describe("PATCH", () => {
        test("200: Updates a given song rating and responds with that rating", () => {
            return request(app)
            .patch("/api/ratings/songs/3/users/2")
            .send({
                score: 9,
                is_visible: false
            })
            .expect(200)
            .then((response) => {
                const {rating} = response.body;
                expect(rating.user_id).toBe("2");
                expect(rating.song_id).toBe(3);
                expect(rating.score).toBe(9);
                expect(rating.is_visible).toBe(false);
            })
        })
        test("200: Updates a given album rating and responds with that rating", () => {
            return request(app)
            .patch("/api/ratings/albums/4/users/1")
            .send({
                score: 7,
                is_visible: true
            })
            .expect(200)
            .then((response) => {
                const {rating} = response.body;
                expect(rating.user_id).toBe("1");
                expect(rating.album_id).toBe(4);
                expect(rating.score).toBe(7);
                expect(rating.is_visible).toBe(true);
            })
        })
        test("200: Ignores any extra properties on request body", () => {
            return request(app)
            .patch("/api/ratings/albums/4/users/1")
            .send({
                score: 7,
                is_visible: true,
                extraKey: "Extra property"
            })
            .expect(200)
            .then((response) => {
                const {rating} = response.body;
                expect(rating.user_id).toBe("1");
                expect(rating.album_id).toBe(4);
                expect(rating.score).toBe(7);
                expect(rating.is_visible).toBe(true);
            })
        })
        test("400: Responds with a bad request message if content_type is not songs or albums", () => {
            return request(app)
            .patch("/api/ratings/books/4/users/1")
            .send({
                score: 7,
                is_visible: true
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("400: Responds with a bad request message if user_id is included in request body", () => {
            return request(app)
            .patch("/api/ratings/songs/3/users/2")
            .send({
                score: 9,
                is_visible: false,
                user_id: "2"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if song_id is included in request body", () => {
            return request(app)
            .patch("/api/ratings/songs/3/users/2")
            .send({
                score: 9,
                is_visible: false,
                song_id: 2
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if album_id is included in request body", () => {
            return request(app)
            .patch("/api/ratings/songs/3/users/2")
            .send({
                score: 9,
                is_visible: false,
                album_id: 2
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if content_id is invalid", () => {
            return Promise.all([
                request(app)
                .patch("/api/ratings/songs/invalid_song/users/2")
                .send({
                    score: 9,
                    is_visible: false,
                })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe("Bad request")
                }),
                request(app)
                .patch("/api/ratings/albums/invalid_album/users/1")
                .send({
                    score: 7,
                    is_visible: true
                })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe("Bad request")
                })
            ])
        })
        test("404: Responds with a not found message if content does not exist", () => {
            return Promise.all([
                request(app)
                .patch("/api/ratings/songs/231/users/2")
                .send({
                    score: 9,
                    is_visible: false,
                })
                .expect(404)
                .then((response) => {
                    expect(response.body.message).toBe("Song not found")
                }),
                request(app)
                .patch("/api/ratings/albums/231/users/1")
                .send({
                    score: 7,
                    is_visible: true
                })
                .expect(404)
                .then((response) => {
                    expect(response.body.message).toBe("Album not found")
                })
            ])
        })
        test("404: Responds with a not found message if user_id does not exist", () => {
            return request(app)
            .patch("/api/ratings/songs/3/users/unknown_from_me")
            .send({
                score: 9,
                is_visible: false
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("User not found")
            })
        })
    })
})


describe("/api/comments/:comment_id", () => {
    describe("PATCH", () => {
        test("200: Updates a given comment in the database and returns the updated comment", () => {
            return Promise.all([
                request(app)
                .patch("/api/comments/3")
                .send({
                    body: "Not cringe",
                })
                .expect(200)
                .then((response) => {
                    const {comment} = response.body;
                    expect(comment.user_id).toBe("4");
                    expect(comment.author.username).toBe("Bad_dev");
                    expect(comment.author.artist_name).toBe("Bad Developer");
                    expect(comment.author.profile_picture).toBe("Default");
                    expect(comment.song_id).toBe(13);
                    expect(comment.body).toBe("Not cringe");
                    expect(comment).not.toHaveProperty("album_id")
                }),
                request(app)
                .patch("/api/comments/7")
                .send({
                    body: "Ultimate perfection!",
                })
                .expect(200)
                .then((response) => {
                    const {comment} = response.body;
                    expect(comment.user_id).toBe("1");
                    expect(comment.author.username).toBe("AlexTheMan");
                    expect(comment.author.artist_name).toBe("Alex The Man");
                    expect(comment.author.profile_picture).toBe("KoolAlex.png");
                    expect(comment.album_id).toBe(2);
                    expect(comment.body).toBe("Ultimate perfection!");
                    expect(comment).not.toHaveProperty("song_id")
                })
            ])
        })
        test("200: Ignores any extra properties on request body", () => {
            return request(app)
            .patch("/api/comments/3")
            .send({
                body: "Not cringe",
                extraKey: "Just kidding, it's cringe."
            })
            .expect(200)
            .then((response) => {
                const {comment} = response.body;
                expect(comment.user_id).toBe("4");
                expect(comment.author.username).toBe("Bad_dev");
                expect(comment.author.artist_name).toBe("Bad Developer");
                expect(comment.author.profile_picture).toBe("Default");
                expect(comment.song_id).toBe(13);
                expect(comment.body).toBe("Not cringe");
                expect(comment).not.toHaveProperty("album_id");
                expect(comment).not.toHaveProperty("extraKey");
            })
        })
        test("400: Responds with a bad request message if trying to edit user_id", () => {
            return request(app)
            .patch("/api/comments/3")
            .send({
                body: "Not cringe",
                user_id: "1"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("400: Responds with a bad request message if trying to edit song_id", () => {
            return request(app)
            .patch("/api/comments/3")
            .send({
                body: "Not cringe",
                song_id: 2
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("400: Responds with a bad request message if trying to edit album_id", () => {
            return request(app)
            .patch("/api/comments/3")
            .send({
                body: "Not cringe",
                album_id: 2
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("400: Responds with a bad request message if comment_id is invalid", () => {
            return request(app)
            .patch("/api/comments/invalid_comment")
            .send({
                body: "Not cringe"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message if comment does not exist", () => {
            return request(app)
            .patch("/api/comments/231")
            .send({
                body: "Not cringe"
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Comment not found");
            })
        })
    })
    describe("DELETE", () => {
        test("204: Deletes the comment from the database", () => {
            return request(app)
            .delete("/api/comments/1")
            .expect(204)
        })
        test("400: Responds with a bad request message if comment_id is invalid", () => {
            return request(app)
            .delete("/api/comments/invalid_id")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request");
            })
        })
        test("404: Responds with a not found message if comment does not exist", () => {
            return request(app)
            .delete("/api/comments/231")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Comment not found")
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