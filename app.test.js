const request = require("supertest");
const app = require("./app");

describe("test the art gallery API", () => {
    // /api/paintings tests
    test("GET /api/paintings returns status 200", () => {
        return request(app)
            .get("/api/paintings")
            .expect(200);
    });

    test("GET /api/paintings returns JSON", () => {
        return request(app)
            .get("/api/paintings")
            .expect('Content-type', /json/);
    });

    test("GET /api/paintings returns correct structure/properties", () => {
        return request(app)
            .get("/api/paintings")
            .expect(200)
            .then((response) => {
                expect(response.body).toBeInstanceOf(Array);
                expect(response.body[0]).toHaveProperty("id");
                expect(response.body[0]).toHaveProperty("title");
                expect(response.body[0]).toHaveProperty("artist");
                expect(response.body[0]).toHaveProperty("imageURL");
            });
    });

    // /api/painting/:id tests

    test("GET /api/painting/1 returns status 200", () => {
        return request(app)
            .get("/api/painting/1")
            .expect(200);
    });

    test("GET /api/painting/400 returns 404, painting does not exist", () => {
        return request(app)
            .get("/api/painting/400")
            .expect(404);
    });

    test("GET /api/painting/1 returns JSON", () => {
        return request(app)
            .get("/api/painting/1")
            .expect("Content-Type", /json/);
    });

    test("GET /api/painting/1 returns correct structure/properties", () => {
        return request(app)
            .get("/api/painting/1")
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty("id");
                expect(response.body).toHaveProperty("title");
                expect(response.body).toHaveProperty("artist");
                expect(response.body).toHaveProperty("imageURL");
                expect(response.body).toHaveProperty("year");
                expect(response.body).toHaveProperty("medium");
                expect(response.body).toHaveProperty("dimensions");
            });
    });

    // /api/comments/:paintingId tests

    test("GET /api/comments/1 returns status 200", () => {
        return request(app)
            .get("/api/comments/1")
            .expect(200);
    });

    test("GET /api/comments/1 returns JSON", () => {
        return request(app)
            .get("/api/comments/1")
            .expect("Content-Type", /json/);
    });

    test("GET /api/comments/1 returns correct structure/properties", () => {
        return request(app)
            .get("/api/comments/1")
            .expect(200)
            .then((response) => {
                expect(response.body).toBeInstanceOf(Array);

                if (response.body.length > 0) {
                    const comment = response.body[0];
                    expect(comment).toHaveProperty("name");
                    expect(comment).toHaveProperty("text");
                }
            });
    });

    test("POST /api/comments/1 adds new comment", () => {
        const testComment = {name: "tester", text: "test comment"};
        return request(app)
            .post("/api/comments/1")
            .send(testComment)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty("name", "tester");
                expect(response.body).toHaveProperty("text", "test comment");
            });
    });

    test("POST /api/comments/1 returns 400 if empty comment", () => {
        const testComment = {name: "tester", text: ""};
        return request(app)
            .post("/api/comments/1")
            .send(testComment)
            .expect(400);
    });
    
    test("POST /api/comments/1 name is Anonymous if not entered", () => {
        const testComment = {name: "", text: "test comment (anon)"};
        return request(app)
            .post("/api/comments/1")
            .send(testComment)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty("name", "Anonymous");
                expect(response.body).toHaveProperty("text", "test comment (anon)");
            });
    });
});
