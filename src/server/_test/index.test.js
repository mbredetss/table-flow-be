import request from 'supertest';
import app from '../index.js';
import AuthenticationsTableTestHelper from '../../../tests/AuthenticationsTableTestHelper.js';
import MenusTableTestHelper from '../../../tests/MenusTableTestHelper.js';
import { describe, it } from 'vitest';
import TablesTableTestHelper from '../../../tests/TablesTableTestHelper.js';

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
            await AuthenticationsTableTestHelper.cleanTable();
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
    });

    describe('when PUT /menus/{menuId}', () => {
        let accessToken = null;
        let menuId = null;

        beforeAll(async () => {
            // login as admin to get access token
            const loginResponse = await request(app)
                .post('/authentications')
                .send({
                    username: process.env.ADMIN_USERNAME,
                    password: process.env.ADMIN_PASSWORD,
                });
            accessToken = loginResponse.body.data.accessToken;

            // added a menu to get menu id
            const addMenuResponse = await request(app)
                .post('/menus')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Nasi Goreng',
                    price: 15000,
                    description: 'Nasi goreng spesial dengan telur dan ayam',
                });
            menuId = addMenuResponse.body.data.addedMenus;
        });

        afterAll(async () => {
            await AuthenticationsTableTestHelper.cleanTable();
            await MenusTableTestHelper.cleanTable();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            const response = await request(app)
                .put(`/menus/${menuId}`)
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
                .put(`/menus/${menuId}`)
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

        it('should response 201 and edit menus correctly', async () => {
            const response = await request(app)
                .put(`/menus/${menuId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Mie Goreng',
                    price: 17000,
                    description: 'Mie goreng spesial dengan telur dan ayam',
                });

            expect(response.status).toBe(201);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body.data.editedMenus).toBeDefined();
            expect(response.body.data.editedMenus.id).toBe(menuId);
            expect(response.body.data.editedMenus.name).toBe('Mie Goreng');
            expect(response.body.data.editedMenus.price).toBe(17000);
            expect(response.body.data.editedMenus.description).toBe('Mie goreng spesial dengan telur dan ayam');
        });
    });

    describe('when DELETE /menus/{menuId}', () => {
        let accessToken = null;
        let menuId = null;

        beforeAll(async () => {
            // login as admin to get access token
            const loginResponse = await request(app)
                .post('/authentications')
                .send({
                    username: process.env.ADMIN_USERNAME,
                    password: process.env.ADMIN_PASSWORD,
                });
            accessToken = loginResponse.body.data.accessToken;

            // added a menu to get menu id
            const addMenuResponse = await request(app)
                .post('/menus')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Nasi Goreng',
                    price: 15000,
                    description: 'Nasi goreng spesial dengan telur dan ayam',
                });
            menuId = addMenuResponse.body.data.addedMenus;
        });

        afterAll(async () => {
            await AuthenticationsTableTestHelper.cleanTable();
            await MenusTableTestHelper.cleanTable();
        });

        it('should response 404 when menuId not found', async () => {
            const response = await request(app)
                .delete(`/menus/nonexistent-menu-id`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(404);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
        });

        it('should response 200 and delete menus correctly', async () => {
            const response = await request(app)
                .delete(`/menus/${menuId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'success');
        });
    });

    describe('when GET /menus', () => {
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

            // added a menu
            await request(app)
                .post('/menus')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Nasi Goreng',
                    price: 15000,
                    description: 'Nasi goreng spesial dengan telur dan ayam',
                });
        });

        afterAll(async () => {
            await AuthenticationsTableTestHelper.cleanTable();
            await MenusTableTestHelper.cleanTable();
        });

        it('should response 200 and get menus correctly', async () => {
            const response = await request(app).get('/menus');

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body.data.menus).toHaveLength(1);
            expect(response.body.data.menus[0]).toHaveProperty('id');
            expect(response.body.data.menus[0]).toHaveProperty('name');
            expect(response.body.data.menus[0]).toHaveProperty('price');
            expect(response.body.data.menus[0]).toHaveProperty('description');
        });
    });

    describe('when POST /tables', () => {
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
            await AuthenticationsTableTestHelper.cleanTable();
            await MenusTableTestHelper.cleanTable();
            await TablesTableTestHelper.cleanTable();
        });

        it('should response 401 when users not login yet', async () => {
            const response = await request(app)
                .post('/tables')
                .send({
                    tableCount: 10,
                });

            expect(response.status).toBe(401);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should response 400 when request payload not contain needed property', async () => {
            const response = await request(app)
                .post('/tables')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body.message).toBe(`"tableCount" is required`);
        });

        it('should response 400 when request payload not meet data type spesification', async () => {
            const response = await request(app)
                .post('/tables')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    tableCount: 'not a number',
                });

            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body.message).toBe(`"tableCount" must be a number`);
        });

        it('should response 201 and set table correctly', async () => {
            const response = await request(app)
                .post('/tables')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    tableCount: 10,
                });

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body.data.tables).toHaveLength(10);
        });
    });

    describe('when POST /orders', () => {
        let menuId = null;
        let tableId = null;

        beforeAll(async () => {
            // login as admin to get access token
            const loginResponse = await request(app)
                .post('/authentications')
                .send({
                    username: process.env.ADMIN_USERNAME,
                    password: process.env.ADMIN_PASSWORD,
                });
            const accessToken = loginResponse.body.data.accessToken;

            // add some menu
            const addMenuresponse = await request(app)
                .post('/menus')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: 'Nasi Goreng',
                    price: 15000,
                    description: 'Nasi goreng spesial dengan telur dan ayam',
                });
            menuId = addMenuresponse.body.data.addedMenus;

            // set table count
            const setTableCountResult = await request(app)
                .post('/tables')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ tableCount: 1, });
            tableId = setTableCountResult.body.data.tables[0].id;
        });

        afterAll(async () => {
            await AuthenticationsTableTestHelper.cleanTable();
            await MenusTableTestHelper.cleanTable();
            await TablesTableTestHelper.cleanTable();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            const response = await request(app)
                .post('/orders')
                .send({});

            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body.message).toBe('"tableId" is required');
        });

        it('should response 400 when request payload not meet data type spesification', async () => {
            const response = await request(app)
                .post('/orders')
                .send({
                    tableId: 'not a number', 
                    orderList: 'not a array',
                });

            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body.message).toBe('"orderList" must be an array');
        });

        it('should response 400 when request menuId payload not contain atleast 1 menu', async () => {
            const response = await request(app)
                .post('/orders')
                .send({
                    tableId, 
                    orderList: [],
                });

            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body.message).toBe('"orderList" must contain at least 1 items');
        });

        it('should response 404 when table is not found', async () => {
            const response = await request(app)
                .post('/orders')
                .send({
                    tableId: 'table not found', 
                    orderList: [menuId],
                });

            expect(response.status).toBe(404);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body.message).toBe('tabel tidak ditemukan!');
        });

        it('should response 404 when menu is not found', async () => {
            const response = await request(app)
                .post('/orders')
                .send({
                    tableId, 
                    orderList: ['not found menu'],
                });

            expect(response.status).toBe(404);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body.message).toBe('menu tidak ditemukan!');
        });

        it('should response 400 when request menuId array payload not meet data spesification', async () => {
            const response = await request(app)
                .post('/orders')
                .send({
                    tableId,
                    orderList: [5],
                });

            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body.message).toBe('"orderList[0]" must be a string');
        });

        it('should response 200 and order correctly', async () => {
            const response = await request(app)
                .post('/orders')
                .send({
                    tableId, 
                    orderList: [menuId],
                });

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toBeTypeOf('object');
            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body.data.orderDetail.qrImageURL).toBeDefined();
            expect(response.body.data.orderDetail.tableId).toBe(tableId);
            expect(response.body.data.orderDetail.order).toHaveLength(1);
            expect(response.body.data.orderDetail.orderTotal).toBe(15000);
        });
    });
});