// install dependencies
const { execSync } = require('child_process');
execSync('npm install');
execSync('npm run seed');

const request = require("supertest");
const { db } = require('./db/connection');
const app = require("./src/app");
const { seedRestaurant } = require("./seedData");

describe('/restaurants endpoint', () => {
  test("requests endpoint successfully", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.statusCode).toBe(200);
  });

  test("/restaurants returns an array of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("returns the correct number of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.body.length).toBe(3);
  });

  test("can find a specific restaurant", async () => {
    const id = 1;
    const response = await request(app).get(`/restaurants/${id}`);
    expect(response.body.name).toBe("AppleBees");
  });

  test("can add a restaurant", async () => {
    const newRestaurant = {
      name: "Rudy's Barbecue",
      location: "Everywhere",
      cuisine: "American",
    };
    await request(app).post("/restaurants").send(newRestaurant);
    const allRestaurants = await request(app).get("/restaurants");
    expect(allRestaurants.body.some(restaurant => 
      restaurant.name === newRestaurant.name &&
      restaurant.location === newRestaurant.location &&
      restaurant.cuisine === newRestaurant.cuisine
    )).toBe(true);
  });

  test("returns errors array if a field is empty", async () => {
    const newRestaurant = {
      name: "",
      location: "Everywhere",
      cuisine: "American",
    };
    const response = await request(app).post("/restaurants").send(newRestaurant);
    expect(response.body.error).toBeDefined();
    expect(response.body.error[0].msg).toBe("Invalid value");
  });

  test("validates restaurant name length", async () => {
    const newRestaurant = {
      name: "Pie",
      location: "Everywhere",
      cuisine: "American",
    };
    const response = await request(app).post("/restaurants").send(newRestaurant);
    expect(response.body.error).toBeDefined();
    expect(response.body.error[0].msg).toBe("Name must be between 10 and 30 characters long");
  });

  test("can update a restaurant", async () => {
    const id = 1;
    const updatedRestaurant = {
      name: "McDonald's",
      location: "Everywhere",
      cuisine: "American",
    };
    const update = await request(app).put(`/restaurants/${id}`).send(updatedRestaurant);
    const updatedRestaurantsReq = await request(app).get(`/restaurants/${id}`);
    expect(updatedRestaurantsReq.body.name).toBe("McDonald's");
  });

  test("can delete a restaurant", async () => {
    const id = 1;
    const deletedRestaurant = await request(app).delete(`/restaurants/${id}`);
    const updatedRestaurants = await request(app).get("/restaurants");
    expect(updatedRestaurants.body.length).toBe(3);
  });
});