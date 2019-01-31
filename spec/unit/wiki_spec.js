const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe('Wiki', () => {
    beforeEach((done) => {
        this.user;
        this.wiki;

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
        });
    });

    describe('#create()', () => {
        it("should create a wiki object with title, body, boolean, and assigned user.", (done) => {
            Wiki.create({
                title: "Another example wiki",
                body: "knowledge should be inserted here",
                private: false,
                userId: this.user.id
            })
            .then((wiki) => {
                expect(wiki.title).toBe("Another example wiki");
                expect(wiki.body).toBe("knowledge should be inserted here");
                expect(wiki.private).toBe(false);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        });

        it("should not create a wiki with missing title, body, private or assigned user", (done) => {
            Wiki.create({
                title: "The wiki that never was"
            })
            .then((wiki) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Wiki.body cannot be null");
                expect(err.message).toContain("Wiki.private cannot be null");
                expect(err.message).toContain("Wiki.userId cannot be null");
                done();
            })
        });
    });

    describe('#setUser', () => {
        it("should associate a user and a wiki together", (done) => {

            User.create({
                email: "user@example.com",
                password: "1234567890"
            })
            .then((newUser) => {
                expect(this.wiki.userId).toBe(this.user.id);
                this.wiki.setUser(newUser)
                .then((wiki) => {
                    expect(wiki.userId).toBe(newUser.id);
                    done();
                });
            })
        });
    });

    describe("##getUser()", () => {
        it("should return the associated user", (done) => {
            this.wiki.getUser()
            .then((associatedUser) => {
                expect(associatedUser.email).toBe("user@example.com");
                done();
            });
        });
    });
});
