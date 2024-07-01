const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../database');
const Address = require('../../models/Address');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const getToken = async () => {
  const passwordHash = await bcrypt.hash('password123', 10);

  user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: passwordHash,
  });

  const response = await request(app)
    .post('/login')
    .send({
      email: 'test@example.com',
      password: 'password123',
  });

  return response.body.token;
};

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Address Controller', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    await User.destroy({ where: {} });
    authToken = await getToken()
    userId = user.id;
  });


  it('should create a new address with valid data', async () => {
    const response = await request(app)
      .post('/addresses')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        zipcode: '0000000',
        street: 'Test Street',
        district: 'Test District',
        city: 'Test City',
        state: 'ST',
        complement: 'Apt 1',
        number: 123,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.zipcode).toBe('0000000');
  });

  it('should update an existing address with valid data', async () => {
    const address = await Address.create({
      user_id: userId,
      zipcode: '0000000',
      street: 'Test Street',
      district: 'Test District',
      city: 'Test City',
      state: 'ST',
      complement: 'Apt 1',
      number: 1223,
    });

    const response = await request(app)
      .put(`/addresses/${address.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        zipcode: '0000000',
        street: 'Update Test Street',
        district: 'Update Test District',
        city: 'Update Test City',
        state: 'TS',
        complement: 'Update Apt 1',
        number: 1223,
      });

    expect(response.status).toBe(200);
    expect(response.body.zipcode).toBe('0000000');
    expect(response.body.street).toBe('Update Test Street');
    expect(response.body.district).toBe('Update Test District');
    expect(response.body.city).toBe('Update Test City');
    expect(response.body.state).toBe('TS');
    expect(response.body.complement).toBe('Update Apt 1');
    expect(response.body.number).toBe(1223);
  });

  it('should delete an existing address', async () => {
    const address = await Address.create({
      user_id: userId,
      zipcode: '0000000',
      street: 'Test Street',
      district: 'Test District',
      city: 'Test City',
      state: 'ST',
      complement: 'Apt 1',
      number: 1223,
    });

    const response = await request(app)
      .delete(`/addresses/${address.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);

    const deletedAddress = await Address.findByPk(address.id);
    expect(deletedAddress).toBeNull();
  });

  it('should list addresses filtered by keyword', async () => {
    await Address.bulkCreate([
      {
        user_id: userId,
        zipcode: '0000000',
        street: 'Test Street',
        district: 'Test District',
        city: 'Test City',
        state: 'ST',
        complement: 'Apt 1',
        number: 1223,
      },
      {
        user_id: userId,
        zipcode: '0000001',
        street: 'Filter Test',
        district: 'Filter District 1',
        city: 'Filter City 1',
        state: 'ST',
        complement: 'Apt 1 1',
        number: 1224,
      },
    ]);

    const response = await request(app)
      .get('/addresses')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ keyword: 'Filter' });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].street).toBe('Filter Test');
  });

  it('should share an address and generate a shared URL', async () => {
    const address = await Address.create({
      user_id: userId,
      zipcode: '0000000',
      street: 'Test Street',
      district: 'Test District',
      city: 'Test City',
      state: 'ST',
      complement: 'Apt 1',
      number: 1223,
    });

    const response = await request(app)
      .post(`/addresses/${address.id}/share`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        expiresIn: '1h',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('url');
    expect(response.body.url).toContain('/shared/');
  });

  it('should get a shared address using a valid token', async () => {
    const token = jwt.sign({ address_id: 1 }, process.env.SHARED_SECRET_KEY, { expiresIn: '1h' });

    const response = await request(app)
      .get(`/shared/${token}`);

    expect(response.status).toBe(200);
    expect(response.body.street).toBe('Test Street');
  });

  it('should not get a shared address using an invalid token', async () => {
    const invalidToken = 'invalid-token';

    const response = await request(app)
      .get(`/shared/${invalidToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid or expired token');
  });
});

