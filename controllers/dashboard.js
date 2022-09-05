"use strict";
const axios = require("axios");
const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const uuid = require("uuid");
const analytics = require("../utils/analytics");
const reading = require("../controllers/reading");
const { runInContext: L } = require("lodash");
const station = require("./station");
const weatherCode = require("../utils/analytics");

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const stations = stationStore.getUserStations(loggedInUser.id)
    stations.sort((a, b) => {
      const nameA = a.stationName.toUpperCase(); // ignore upper and lowercase
      const nameB = b.stationName.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    const latestReading =station.latestReading;
    for(let station of stations) {
      station.latestReading = analytics.getLatestReading(station)
      station.lastTwoReading = analytics?.getLastTwoReading(station);
      station.lastThreeReading = analytics?.getLastThreeReading(station);
      station.fahrenheit = analytics?.getFahrenheit(station.latestReading?.temperature);
      station.weatherCode = analytics?.getWeatherCode(station.latestReading?.code);
      station.weatherIcon = analytics?.getWeatherIcon(station.latestReading?.code);
      station.windChill = analytics?.getWindChill(station.latestReading?.temperature, station.latestReading?.windSpeed);
      station.beaufortReading = analytics?.getBeaufortReading(station.latestReading?.windSpeed);
      station.beaufortLabel = analytics?.getBeaufortlabel(station.beaufortLabel);
      station.windCompass = analytics?.getWindCompass(station.latestReading?.windDirection);
      station.trendWind = analytics?.getTrendWind(station.latestReading?.windSpeed, station.lastTwoReading?.windSpeed, station.lastThreeReading?.windSpeed);
      station.trendTemp = analytics?.getTrendTemp(station.latestReading?.temperature, station.lastTwoReading?.temperature, station.lastThreeReading?.temperature);
      station.trendPress = analytics?.getTrendPress(station.latestReading?.pressure, station.lastTwoReading?.pressure, station.lastThreeReading?.pressure);
      station.minTemp = analytics?.getMinTemp(station.readings);
      station.minWind = analytics?.getMinWind(station.readings);
      station.minPress = analytics?.getMinPress(station.readings);
      station.maxTemp = analytics?.getMaxTemp(station.readings);
      station.maxWind = analytics?.getMaxWind(station.readings);
      station.maxPress = analytics?.getMaxPress(station.readings);

    }
      const viewData = {
        title: "Station Dashboard",
        stations: stations,
      };
      logger.info("about to render", stationStore.getAllStations());
      response.render("dashboard", viewData);
  },

  deleteStations(request, response) {
    const stationId = request.params.id;
    logger.debug(`Deleting Station ${stationId}`);
    stationStore.removeStation(stationId);
    response.redirect("/dashboard");
  },

  addStation(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newStationList = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      stationName: request.body.stationName,
      latitude: request.body.latitude,
      longitude: request.body.longitude,
      readings: []
    };
    logger.debug("Creating a new StationList", newStationList);
    stationStore.addStations(newStationList);
    response.redirect("/dashboard");
  }
};

module.exports = dashboard;
