export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(navigator.language);
};

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleTimeString(navigator.language, options);
};

export const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(navigator.language);
};

export const timeAgo = (timestamp) => {
  const now = Date.now();
  const difference = now - timestamp;

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;

  if (difference < minute) {
    return "Just now";
  } else if (difference < hour) {
    return Math.round(difference / minute) + " minutes ago";
  } else if (difference < day) {
    return Math.round(difference / hour) + " hours ago";
  } else if (difference < week) {
    return Math.round(difference / day) + " days ago";
  } else {
    return formatDate(timestamp);
  }
};

export default { formatDate, formatDateTime, formatTime, timeAgo };
