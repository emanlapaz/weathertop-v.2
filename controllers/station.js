"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const uuid = require("uuid");
const analytics = require("../utils/analytics");
const { last } = require("lodash/array");
const { contentDisposition } = require("express/lib/utils");
const reading = require("../controllers/reading");
const { value } = require("lodash/seq");
const axios = require("axios");
const { toString } = require("lodash");



const station = {
  index(request, response) {
    const stationId = request.params.id;
    logger.debug("Station id = ", stationId);
    const station = stationStore.getStation(stationId);
    const latestReading = analytics?.getLatestReading(station);
    const lastTwoReading = analytics?.getLastTwoReading(station);
    const lastThreeReading = analytics?.getLastThreeReading(station);
    const fahrenheit = analytics?.getFahrenheit(latestReading?.temperature);
    const weatherCode = analytics?.getWeatherCode(latestReading?.code);
    const weatherIcon = analytics?.getWeatherIcon(latestReading?.code);
    const windChill = analytics?.getWindChill(latestReading?.temperature, latestReading?.windSpeed);
    const beaufortReading = analytics?.getBeaufortReading(latestReading?.windSpeed);
    const beaufortLabel = analytics?.getBeaufortlabel(beaufortReading);
    const windCompass = analytics?.getWindCompass(latestReading?.windDirection);
    const trendWind = analytics?.getTrendWind(latestReading?.windSpeed, lastTwoReading?.windSpeed, lastThreeReading?.windSpeed);
    const trendTemp = analytics?.getTrendTemp(latestReading?.temperature, lastTwoReading?.temperature, lastThreeReading?.temperature);
    const trendPress = analytics?.getTrendPress(latestReading?.pressure, lastTwoReading?.pressure, lastThreeReading?.pressure);
    const timeStamp = analytics?.getTimeStamp();
    const minTemp = analytics?.getMinTemp(station.readings);
    const minWind = analytics?.getMinWind(station.readings);
    const minPress = analytics?.getMinPress(station.readings);
    const maxTemp = analytics?.getMaxTemp(station.readings);
    const maxWind = analytics?.getMaxWind(station.readings);
    const maxPress = analytics?.getMaxPress(station.readings);


    const viewData = {
      name: "Station",
      station: stationStore.getStation(stationId),
      latestReading: latestReading,
      lastTwoReading: lastTwoReading,
      lastThreeReading: lastThreeReading,
      fahrenheit: fahrenheit,
      weatherCode: weatherCode,
      weatherIcon: weatherIcon,
      windChill: windChill,
      beaufortReading: beaufortReading,
      beaufortLabel: beaufortLabel,
      windCompass: windCompass,
      trendTemp: trendTemp,
      trendWind: trendWind,
      trendPress: trendPress,
      timeStamp: timeStamp,
      minTemp: minTemp,
      minWind: minWind,
      minPress: minPress,
      maxTemp: maxTemp,
      maxWind: maxWind,
      maxPress: maxPress,

    };
    response.render("station", viewData);
  },

  deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.debug(`Deleting Reading ${readingId} from Station ${stationId}`);
    stationStore.removeReading(stationId, readingId);
    response.redirect("/station/" + stationId);

  },

  addReading(request, response) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const newReading = {
      id: uuid.v1(),
      date: request.body.date,
      code: request.body.code,
      temperature: Number(request.body.temperature),
      windSpeed: Number(request.body.windSpeed),
      windDirection: Number(request.body.windDirection),
      pressure: Number(request.body.pressure)
    };
    logger.debug("New Reading = ", newReading);
    stationStore.addReading(stationId, newReading);
    response.redirect("/station/" + stationId);
  },

  async addReport(request, response) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    let report = {
      id: uuid.v1(),
    };
    const lat= station.latitude;
    const lng= station.longitude;
    const callWeather= `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&&units=metric&appid=dae60561bd4c79fffdaa062810f637ec`
    const result = await axios.get(callWeather)
    if (result.status === 200) {
      console.log(result.data);
      const reading = result.data.current;
      report.date = analytics?.getTimeStamp();
      report.code = toString(reading.weather[0].id);
      report.temperature = reading.temp;
      report.windSpeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;
      report.trendLabels = [];
      report.windTrend=[];
      report.tempTrend = [];

      const trends = result.data.daily;
      for (let i = 0; i < trends.length; i++) {
        report.windTrend.push(trends[i].wind_speed);
        report.tempTrend.push(trends[i].temp.day);
        const date = new Date(trends[i].dt * 1000);
        report.trendLabels.push(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);
      }
    }
    logger.info("rendering new report");
    console.log(report);
    stationStore.addReport(stationId, report);
    response.redirect("/station/"+stationId);

  }
}



module.exports = station;
