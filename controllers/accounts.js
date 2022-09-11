"use strict";

const userstore = require("../models/user-store");
const logger = require("../utils/logger");
const uuid = require("uuid");
const stationStore = require("../models/station-store");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup",
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to WeatherTop"
    };
    response.render("login", viewData);
  },

  edit(request, response){
    const viewData={
      title: "Edit account"
    };
    response.render("edit", viewData)
  },

  logout(request, response) {
    response.cookie("playlist", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Sign Up "
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid.v1();
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect("/");
  },

  update(request, response){
    const user= request.body;
    user.id = uuid.v1();
    userstore.updateUser(user);
    const updatedUser = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
    }
    logger.info('updating ${user.email}');
    userstore.updateUser(user, updatedUser)
    response.redirect("edit");
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    if (user) {
      response.cookie("station", user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.station;
    return userstore.getUserByEmail(userEmail);
  }
};

module.exports = accounts;
