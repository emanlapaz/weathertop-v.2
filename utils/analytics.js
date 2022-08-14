"use strict";

const { map } = require("lodash/collection");
const analytics = {

  getLatestReading(station) {
    let latestReading = null;
    if (station.readings.length > 0) {
      latestReading = station.readings.slice(-1)[0];
    }
    return latestReading;
  },

  getLastTwoReading(station) {
    let lastTwoReading = null;
    if (station.readings.length > 0) {
      lastTwoReading = station.readings.slice(-2)[0];
    }
    return lastTwoReading;
  },

  getLastThreeReading(station) {
    let lastThreeReading = null;
    if (station.readings.length > 0) {
      lastThreeReading = station.readings.slice(-3)[0];
    }
    return lastThreeReading;
  },

  getFahrenheit(temperature) {
    let fahrenheit = null;
    fahrenheit = ((temperature * 9) / 5) + 32;
    return fahrenheit;
  },

  getWeatherCode() {
    let weatherCode = new Map();
    weatherCode.set("100", "Clear"),
      weatherCode.set("200", "Partial Clouds"),
      weatherCode.set("300", "Cloudy"),
      weatherCode.set("400", "Light Showers"),
      weatherCode.set("500", "Heavy Showers"),
      weatherCode.set("600", "Rain"),
      weatherCode.set("700", "Snow"),
      weatherCode.set("800", "Thunder")
    return weatherCode;
  },

  getWeatherIcon() {
    let weatherIcon = new Map();
    weatherIcon.set("100", "large orange sun icon"),
      weatherIcon.set("200", "large orange cloud sun icon"),
      weatherIcon.set("300", "large  grey cloud icon"),
      weatherIcon.set("400", "large grey cloud sun rain icon"),
      weatherIcon.set("500", "large black cloud showers heavy icon"),
      weatherIcon.set("600", "large grey cloud rain icon"),
      weatherIcon.set("700", "large blue snowflake icon"),
      weatherIcon.set("800", "large violet bolt icon")
    return weatherIcon;
  },

  getWindChill(temperature, windSpeed) {
    let windChill = null;
    windChill = 13.12 + (0.6215 * temperature) - 11.37 * (Math.pow(windSpeed, 0.16)) + (0.3965 * temperature) * (Math.pow(windSpeed, 0.16));
    return windChill;
  },

  getBeaufortReading(windSpeed) {
    let w = windSpeed;
    let beaufortReading = null;
    if (w < 1) {
      beaufortReading = 0;
    } else if (w > 1 & w <= 5) {
      beaufortReading = 1;
    } else if (w > 6 & w <= 11) {
      beaufortReading = 2;
    } else if (w > 12 & w <= 19) {
      beaufortReading = 3;
    } else if (w > 20 & w <= 28) {
      beaufortReading = 4;
    } else if (w > 29 & w <= 38) {
      beaufortReading = 5;
    } else if (w > 39 & w <= 49) {
      beaufortReading = 6;
    } else if (w > 50 & w <= 61) {
      beaufortReading = 7;
    } else if (w > 62 & w <= 74) {
      beaufortReading = 8;
    } else if (w > 75 & w <= 88) {
      beaufortReading = 9;
    } else if (w > 89 & w <= 102) {
      beaufortReading = 10;
    } else if (w > 103 & w <= 117) {
      beaufortReading = 11;
    } else if (w > 117) {
      beaufortReading = 11;
    }
    return beaufortReading;
  },

  getBeaufortlabel(beaufort) {
    let bf = beaufort;
    let beaufortLabel = null;
    if (bf == 0) {
      beaufortLabel = "Calm";
    } else if (bf == 1) {
      beaufortLabel = "Light Air";
    } else if (bf == 2) {
      beaufortLabel = "Light Breeze";
    } else if (bf == 3) {
      beaufortLabel = "Gentle Breeze";
    } else if (bf == 4) {
      beaufortLabel = "Moderate Breeze";
    } else if (bf == 5) {
      beaufortLabel = "Fresh Breeze";
    } else if (bf == 6) {
      beaufortLabel = "Strong Breeze";
    } else if (bf == 7) {
      beaufortLabel = "Near Gale";
    } else if (bf == 8) {
      beaufortLabel = "Gale";
    } else if (bf == 9) {
      beaufortLabel = "Severe Gale";
    } else if (bf == 10) {
      beaufortLabel = "Strong Storm";
    } else if (bf >= 11) {
      beaufortLabel = "Violent Storm";
    }
    return beaufortLabel;
  },

  getWindCompass(windDirection) {
    let dr = windDirection;
    let windCompass = null;
    if (dr >= 11.26 && dr <= 33.75) {
      windCompass = "north northeast";
    } else if (dr >= 33.76 & dr <= 56.25) {
      windCompass = "north east";
    } else if (dr >= 56.26 & dr <= 78.75) {
      windCompass = "east northeast";
    } else if (dr >= 78.76 & dr <= 101.25) {
      windCompass = "east";
    } else if (dr >= 101.26 & dr <= 123.75) {
      windCompass = "east southeast";
    } else if (dr >= 123.76 & dr <= 146.25) {
      windCompass = "south east";
    } else if (dr >= 146.26 & dr <= 168.75) {
      windCompass = "south southeast";
    } else if (dr >= 168.76 & dr <= 191.25) {
      windCompass = "south";
    } else if (dr >= 191.26 & dr <= 213.75) {
      windCompass = "south southwest";
    } else if (dr >= 213.76 & dr <= 236.25) {
      windCompass = "south west";
    } else if (dr >= 236.26 & dr <= 258.75) {
      windCompass = "west southwest";
    } else if (dr >= 258.76 & dr <= 281.25) {
      windCompass = "west";
    } else if (dr >= 281.26 & dr <= 303.75) {
      windCompass = "west northwest";
    } else if (dr >= 303.76 & dr <= 326.25) {
      windCompass = "northwest";
    } else if (dr >= 326.26 & dr <= 348.75) {
      windCompass = "north northwest";
    } else if (dr >= 346.75 & dr <= 360) {
      windCompass = "north";
    } else if (dr >= 0 & dr <= 11.25) {
      windCompass = "north";
    } else if ((dr >= 361)) {
      windCompass = "n/a";
    }
    return windCompass;
  },

  getTrendTemp(latestReading, lastTwoReading, lastThreeReading) {
    let A = latestReading;
    let B = lastTwoReading;
    let C = lastThreeReading;
    let trendTemp = null;
    if (A > B && B > C) {
      trendTemp = "red arrow alternate circle up icon";
    } else if (A < B && B < C) {
      trendTemp = "blue arrow alternate circle down icon";
    }
    return trendTemp;
  },

  getTrendWind(latestReading, lastTwoReading, lastThreeReading) {
    let A = latestReading;
    let B = lastTwoReading;
    let C = lastThreeReading;
    let trendWind = null;
    if (A > B && B > C) {
      trendWind = "red arrow alternate circle up icon";
    } else if (A < B && B < C) {
      trendWind = "blue arrow alternate circle down icon";
    }
    return trendWind;
  },
  getTrendPress(latestReading, lastTwoReading, lastThreeReading) {
    let A = latestReading;
    let B = lastTwoReading;
    let C = lastThreeReading;
    let trendPress = null;
    if (A > B && B > C) {
      trendPress = "red arrow alternate circle up icon";
    } else if (A < B && B < C) {
      trendPress = "blue arrow alternate circle down icon";
    }
    return trendPress;
  }
}
module.exports = analytics;