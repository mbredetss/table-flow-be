import request from 'supertest';
import app from '../index.js';
import AuthenticationsTableTestHelper from '../../../tests/AuthenticationsTableTestHelper.js';
import MenusTableTestHelper from '../../../tests/MenusTableTestHelper.js';

describe('HTTP Server', () => {
    describe('when POST /authentications', () => {
        it('should response 201 with accessToken and refreshToken', async () => {
            const response = await request(app)
                .post('/authentications')
                .send({
                    username: process.env.ADMIN_USERNAME,
                    password: process.env.ADMIN_PASSWORD,
                });

            expect(response.status).toBe(201);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
            expect(response.body.data.accessToken).toBeTruthy();
            expect(response.body.data.refreshToken).toBeTruthy();

            await AuthenticationsTableTestHelper.cleanTable();
        });

        it('should response 401 when password is wrong', async () => {
            const response = await request(app)
                .post('/authentications')
                .send({
                    username: process.env.ADMIN_USERNAME,
                    password: 'wrong_password',
                });

            expect(response.status).toBe(401);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Username atau password salah!');
        });

        it('should response 401 when username does not exist', async () => {
            const response = await request(app)
                .post('/authentications')
                .send({
                    username: 'user_yang_tidak_ada',
                    password: 'password123',
                });

            expect(response.status).toBe(401);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Username atau password salah!');
        });
    });

    describe('when PUT /authentications', () => {
        it('should response 200 with new accessToken', async () => {
            const refreshTokenResponse = await request(app)
                .post('/authentications')
                .send({
                    username: process.env.ADMIN_USERNAME,
                    password: process.env.ADMIN_PASSWORD,
                });

            const validRefreshToken = refreshTokenResponse.body.data.refreshToken;

            const response = await request(app)
                .put('/authentications')
                .send({ refreshToken: validRefreshToken });

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data.accessToken).toBeTruthy();
            expect(typeof response.body.data.accessToken).toBe('string');

            await AuthenticationsTableTestHelper.cleanTable();
        });

        it('should response 400 when refresh token is invalid', async () => {
            const response = await request(app)
                .put('/authentications')
                .send({ refreshToken: 'invalid.refresh.token' });

            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body).toHaveProperty('message');
        });
    });

    describe('when DELETE /authentications', () => {
        it('should response 400 when logout with invalid refresh token', async () => {
            const response = await request(app)
                .delete('/authentications')
                .send({ refreshToken: 'invalid.refresh.token' });

            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body).toHaveProperty('message');
        });

        it('should response 200 when logout with valid refresh token', async () => {
            const refreshTokenResponse = await request(app)
                .post('/authentications')
                .send({
                    username: process.env.ADMIN_USERNAME,
                    password: process.env.ADMIN_PASSWORD,
                });

            const validRefreshToken = refreshTokenResponse.body.data.refreshToken;

            const response = await request(app)
                .delete('/authentications')
                .send({ refreshToken: validRefreshToken });

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'Refresh token berhasil dihapus!');

            await AuthenticationsTableTestHelper.cleanTable();
        });
    });
    describe('when POST /menus', () => {
        let accessToken = null;

        beforeAll(async () => {
            // login as admin to get access token
            const loginResponse = await request(app)
                .post('/authentications')
                .send({
                    username: process.env.ADMIN_USERNAME,
                    password: process.env.ADMIN_PASSWORD,
                });
            accessToken = loginResponse.body.data.accessToken;
        });

        afterAll(async () => {
            await MenusTableTestHelper.cleanTable();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            const response = await request(app)
                .post('/menus')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body).toHaveProperty('message');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            const response = await request(app)
                .post('/menus')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 123,
                    price: 'not_a_number',
                    description: 456,
                });

            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body).toHaveProperty('message');
        });

        it('should response 201 and store menus correctly', async () => {
            const response = await request(app)
                .post('/menus')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Nasi Goreng',
                    price: 15000,
                    description: 'Nasi goreng spesial dengan telur dan ayam',
                });

            expect(response.status).toBe(201);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body.data.addedMenus).toBeDefined();
        });


    })
})