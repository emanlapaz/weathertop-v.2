"use strict";

const analytics = {

  getLatestReading(station) {
    let latestReading = null;
    if (station.readings.length > 0) {
      latestReading = station.readings.slice(-1)[0];
    }
    return latestReading;
  }
};
module.exports = analytics;