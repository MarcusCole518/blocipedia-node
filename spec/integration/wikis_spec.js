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

    describe('POST /wikis/create', () => {
        it("should create a new wiki and redirect", (done) => {
            const options = {
                url: `${base}create`,
                form: {
                    title: "Good Morning Revival",
                    body: "Decent album I guess",
                    private: false
                }
            };
            request.post(options, (err, res, body) => {
                Wiki.findOne({where: {title: "Good Morning Revival"}})
                .then((wiki) => {
                    expect(res.statusCode).toBe(303);
                    expect(wiki.title).toBe("Good Morning Revival");
                    expect(wiki.body).toBe("Decent album I guess");
                    expect(wiki.private).toBe(false);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });

        it("should not create a new wiki that fails validations", (done) => {
            const options = {
                url: `${base}create`,
                form: {
                    title: "a",
                    body: "b",
                    private: false
                }
            };
            request.post(options, (err, res, body) => {
                Wiki.findOne({where: {title: "a"}})
                .then((wiki) => {
                    expect(wiki).toBeNull();
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("GET /wikis/:id", () => {

        it("should render a view with the selected wiki", (done) => {
            request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("My first wiki");
                done();
            });
        });
    });

    describe("POST /wikis/:id/destroy", () => {

        it("should delete the wiki with the associated ID", (done) => {
            Wiki.all()
            .then((wikis) => {
                const wikiCountBeforeDelete = wikis.length;
                expect(wikiCountBeforeDelete).toBe(1);

                request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                    Wiki.all()
                    .then((wikis) => {
                        expect(err).toBeNull();
                        expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                        done();
                    })
                });
            });
        });
    });


    describe("GET /wikis/:id/edit", () => {

        it("should render a view with an edit wiki form", (done) => {
            request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("My first wiki");
                done();
            });
        });
    });

    describe("POST /wikis/:id/update", () => {

        it("should update the wiki with the given values", (done) => {
            const options = {
                url: `${base}${this.wiki.id}/update`,
                form: {
                    title: "My second wiki",
                    body: "still an example wiki",
                    private: false,
                    userId: this.user.id
                }
            };
            request.post(options, (err, res, body) => {
                expect(err).toBeNull();
                Wiki.findOne({
                    where: { id: 1 }
                })
                .then((wiki) => {
                    expect(wiki.title).toBe("My second wiki");
                    done();
                });
            });
        });
    });
});
