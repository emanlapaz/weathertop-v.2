"use strict";
const { value } = require("lodash/seq");
const stationStore = require("../models/station-store");
const analytics = {

  getLatestReading(station) {
    let latestReading = null;
    if (station?.readings.length > 0) {
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
    return fahrenheit.toFixed(1);
  },
  getMinTemp(readings) {
    let minTemp = readings[0]?.temperature;
    for (let reading of readings) {
      if (reading?.temperature < minTemp) {
        minTemp = reading?.temperature;
      }
    }
    return minTemp
  },

  getMinWind(readings) {
    let minWind = readings[0]?.windSpeed;
    for (let reading of readings) {
      if (reading?.windSpeed < minWind) {
        minWind = reading?.windSpeed;
      }
    }
    return minWind
  },

  getMinPress(readings) {
    let minPress = readings[0]?.pressure;
    for (let reading of readings) {
      if (reading?.pressure < minPress) {
        minPress= reading?.pressure;
    }
  }
    return minPress
  },

  getMaxTemp(readings) {
    let maxTemp = readings[0]?.temperature;
    for (let reading of readings) {
      if (reading?.temperature > maxTemp) {
        maxTemp= reading?.temperature;
      }
    }
    return maxTemp
  },

  getMaxWind(readings) {
    let maxWind = readings[0]?.windSpeed;
    for (let reading of readings) {
      if (reading?.windSpeed > maxWind) {
        maxWind= reading?.windSpeed;
      }
    }
    return maxWind
  },

  getMaxPress(readings) {
    let maxPress = readings[0]?.pressure;
    for (let reading of readings) {
      if (reading?.pressure > maxPress) {
        maxPress= reading?.pressure;
      }
    }
    return maxPress
  },

  getWeatherCode(code) {
    let weatherCode = new Map();

      weatherCode.set("200", "Thunderstorm with light rain"),
      weatherCode.set("201", "thunderstorm with rain"),
      weatherCode.set("202", "thunderstorm with heavy rain"),
      weatherCode.set("210", "light thunderstorm"),
      weatherCode.set("211", "thunderstorm"),
      weatherCode.set("212", "heavy thunderstorm"),
      weatherCode.set("221", "ragged thunderstorm"),
      weatherCode.set("230", "thunderstorm with light drizzle"),
      weatherCode.set("231", "thunderstorm with drizzle"),
      weatherCode.set("232", "thunderstorm with heavy drizzle"),
      weatherCode.set("300", "light intensity drizzle"),
      weatherCode.set("301", "drizzle"),
      weatherCode.set("302", "heavy intensity drizzle"),
      weatherCode.set("310", "light intensity drizzle rain"),
      weatherCode.set("311", "drizzle rain"),
      weatherCode.set("312", "heavy intensity drizzle rain"),
      weatherCode.set("313", "shower rain and drizzle"),
      weatherCode.set("314", "heavy shower rain and drizzle"),
      weatherCode.set("321", "shower drizzle"),
      weatherCode.set("500", "light rain"),
      weatherCode.set("501", "moderate rain"),
      weatherCode.set("502", "heavy intensity rain"),
      weatherCode.set("503", "very heavy rain"),
      weatherCode.set("504", "extreme rain"),
      weatherCode.set("511", "freezing rain"),
      weatherCode.set("520", "light intensity shower rain"),
      weatherCode.set("521", "shower rain"),
      weatherCode.set("522", "heavy intensity shower rain"),
      weatherCode.set("531", "ragged shower rain"),
      weatherCode.set("600", "light snow"),
      weatherCode.set("601", "Snow"),
      weatherCode.set("602", "Heavy snow"),
      weatherCode.set("611", "Sleet"),
      weatherCode.set("612", "Light shower sleet"),
      weatherCode.set("613", "Shower sleet"),
      weatherCode.set("615", "Light rain and snow"),
      weatherCode.set("616", "Rain and snow"),
      weatherCode.set("620", "Light shower snow"),
      weatherCode.set("621", "Shower snow"),
      weatherCode.set("622", "Heavy shower snow"),
      weatherCode.set("701", "mist"),
      weatherCode.set("711", "Smoke"),
      weatherCode.set("721", "Haze"),
      weatherCode.set("731", "sand/ dust whirls"),
      weatherCode.set("741", "fog"),
      weatherCode.set("751", "sand"),
      weatherCode.set("761", "dust"),
      weatherCode.set("762", "volcanic ash"),
      weatherCode.set("771", "squalls"),
      weatherCode.set("781", "tornado"),
      weatherCode.set("800", "clear sky"),
      weatherCode.set("801", "few clouds: 11-25%"),
      weatherCode.set("802", "scattered clouds: 25-50%"),
      weatherCode.set("803", "broken clouds: 51-84%"),
      weatherCode.set("804", "overcast clouds: 85-100%")

    return weatherCode.get(code);
  },

  getWeatherIcon(code) {
    let weatherIcon = new Map();

      weatherIcon.set("200", "large violet bolt icon"),
      weatherIcon.set("201", "large violet bolt icon"),
      weatherIcon.set("202", "large violet bolt icon"),
      weatherIcon.set("210", "large violet bolt icon"),
      weatherIcon.set("211", "large violet bolt icon"),
      weatherIcon.set("212", "large violet bolt icon"),
      weatherIcon.set("221", "large violet bolt icon"),
      weatherIcon.set("230",  "large violet bolt icon"),
      weatherIcon.set("231",  "large violet bolt icon"),
      weatherIcon.set("232",  "large violet bolt icon"),
      weatherIcon.set("300", "large grey cloud rain icon"),
      weatherIcon.set("301", "large grey cloud rain icon"),
      weatherIcon.set("302", "large black cloud showers heavy icon"),
      weatherIcon.set("310",  "large grey cloud rain icon"),
      weatherIcon.set("311",  "large grey cloud rain icon"),
      weatherIcon.set("312", "large black cloud showers heavy icon"),
      weatherIcon.set("313",  "large grey cloud rain icon"),
      weatherIcon.set("314", "large black cloud showers heavy icon"),
      weatherIcon.set("321",  "large grey cloud rain icon"),
      weatherIcon.set("500",  "large grey cloud rain icon"),
      weatherIcon.set("501",  "large grey cloud rain icon"),
      weatherIcon.set("502", "large black cloud showers heavy icon"),
      weatherIcon.set("503", "large black cloud showers heavy icon"),
      weatherIcon.set("504", "large black cloud showers heavy icon"),
      weatherIcon.set("511", "large blue snowflake icon"),
      weatherIcon.set("520",  "large grey cloud rain icon"),
      weatherIcon.set("521",  "large blue snowflake icon"),
      weatherIcon.set("522", "large blue snowflake icon"),
      weatherIcon.set("531",  "large grey cloud rain icon"),
      weatherIcon.set("600", "large blue snowflake icon"),
      weatherIcon.set("601", "large blue snowflake icon"),
      weatherIcon.set("602", "large blue snowflake icon"),
      weatherIcon.set("611", "large blue snowflake icon"),
      weatherIcon.set("612","large blue snowflake icon"),
      weatherIcon.set("613", "large blue snowflake icon"),
      weatherIcon.set("615", "large blue snowflake icon"),
      weatherIcon.set("616", "large blue snowflake icon"),
      weatherIcon.set("620", "large blue snowflake icon"),
      weatherIcon.set("621","large blue snowflake icon"),
      weatherIcon.set("622", "large blue snowflake icon"),
      weatherIcon.set("701", "large grey smog icon"),
      weatherIcon.set("711", "large grey smog icon"),
      weatherIcon.set("721", "large grey smog icon"),
      weatherIcon.set("731", "large yellow smog icon"),
      weatherIcon.set("741", "large grey smog icon"),
      weatherIcon.set("751", "large yellow smog icon"),
      weatherIcon.set("761", "large yellow smog icon"),
      weatherIcon.set("762", "large grey smog icon"),
      weatherIcon.set("771", "large blue wind icon"),
      weatherIcon.set("781", "large blue wind icon"),
      weatherIcon.set("800", "large orange sun icon"),
      weatherIcon.set("801", "large orange cloud sun icon"),
      weatherIcon.set("802", "large orange cloud sun icon"),
      weatherIcon.set("803", "large orange cloud sun icon"),
      weatherIcon.set("804", "large  grey cloud icon")

    return weatherIcon.get(code);
  },
  

  getWindChill(temperature, windSpeed) {
    let windChill = null;
    windChill = 13.12 + (0.6215 * temperature) - 11.37 * (Math.pow(windSpeed, 0.16)) + (0.3965 * temperature) * (Math.pow(windSpeed, 0.16));
    return windChill.toFixed(1);
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
  },

  getTimeStamp() {
    const timeStamp = new Date();
    return timeStamp.toISOString();
  },
}
module.exports = analytics;