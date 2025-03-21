import { DateTime } from "luxon";

export const formatDate = (dateString, hour12 = false, timeZone = "UTC") => {
  const date = new Date(dateString);

  // Get month and day
  const options = { month: "long" };
  const month = date.toLocaleString("en-EN", options, { timeZone });
  const day = date.getUTCDate();

  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12,
    timeZone,
  };

  const time = date.toLocaleString("en-EN", timeOptions);

  return `${month} ${day} at ${time}`;
};

export const toUTCDateTime = (dateString) => {
  return DateTime.fromISO(dateString, { zone: "utc" }).toUTC();
};

export const dateRangesOverlap = (inA, outA, inB, outB) => {
  return inA < outB && outA > inB;
};
