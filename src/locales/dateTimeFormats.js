/* jshint esversion:8 */
const dateTimeFormats = {
  en: {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric"
    },
    long: {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric"
    }
  },
  zh: {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric"
    },
    long: {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false
    }
  }
};

module.exports = dateTimeFormats;
