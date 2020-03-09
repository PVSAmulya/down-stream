const assert = require('assert');
const request = require('supertest');
const app = require('./app');

describe('Simplified Star Wars API', function () {

    describe('GET /people/:id', function () {

        it('should return a person with first_name and last_name', async () => {
            const response = await request(app)
                .get('/people/1');

            assert.equal(response.status, 200);
            assert.equal(response.body.first_name, 'Luke');
            assert.equal(response.body.last_name, 'Skywalker');
        });


        it(`should only return a first_name when there's no last name`, async () => {
            const response = await request(app)
                .get('/people/3');

            assert.equal(response.status, 200);
            assert.equal(response.body.first_name, 'R2-D2');
            assert.equal(response.body.last_name, undefined);
        });

        it('should return the species not the species id', async () => {
            const response = await request(app)
                .get('/people/1');

            assert.equal(response.status, 200);
            assert.equal(response.body.species, 'Human');
        });

        it('should return a different person with a different id', async () => {
            const darthResponse = await request(app)
                .get('/people/4');

            assert.equal(darthResponse.status, 200);
            assert.deepStrictEqual(darthResponse.body, {
                first_name: 'Darth',
                last_name: 'Vader',
                species: 'Human'
            });

            const c3poResponse = await request(app)
                .get('/people/2');

            assert.equal(c3poResponse.status, 200);
            assert.deepStrictEqual(c3poResponse.body, {
                first_name: 'C-3PO',
                species: 'Droid'
            });
        });

        it('should return first and last name correctly when there are three names', async () => {
            const response = await request(app)
                .get('/people/30');

            assert.equal(response.status, 200);
            assert.equal(response.body.first_name, 'Wicket');
            assert.equal(response.body.last_name, 'Warrick');
        });

    });

    describe('GET /planets/:id', function () {

        it('should return a name of the planet', async () => {
            const response = await request(app)
                .get('/planets/1');

            assert.equal(response.status, 200);
            assert.equal(response.body.name, 'Tatooine');
        });

        it('should return count of known residents of a particular species', async () => {
            const response = await request(app)
                .get('/planets/1');

            assert.equal(response.status, 200);
            assert.equal(typeof response.body.count, 'object');
            assert.equal(response.body.count.Human, 8)
            assert.equal(response.body.count.Droid, 2)
        });

        it('should return an empty count when no resident information is present', async () => {
            const response = await request(app)
                .get('/planets/4');

            assert.deepStrictEqual(response.body, {
                name: 'Hoth',
                count: {}
            });
        });

        it('should return a different count with a different id', async () => {
            const response = await request(app)
                .get('/planets/7');

            assert.deepStrictEqual(response.body, {
                name: 'Endor',
                count: {
                    Ewok: 1
                }
            });
        });


    });

});