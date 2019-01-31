const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe('routes : wikis', () => {

    beforeEach((done) => {
        this.wiki;
        this.user;
        sequelize.sync({force: true}).then((res) => {
            User.create({
                email: "user@example.com",
                password: "1234567890"
            })
            .then((user) => {
                this.user = user;

                Wiki.create({
                    title: "My first wiki",
                    body: "this is an example wiki",
                    private: false,
                    userId: this.user.id
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            })
        });
    });

    describe("GET /wikis", () => {

        it("should return a status code 200 and all wikis", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Wikis");
                expect("My first wiki");
                done();
            });
        });
    });


    describe("GET /wikis/new", () => {

        it("should render a new wiki form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Wiki");
                done();
            });
        });
    });
});
