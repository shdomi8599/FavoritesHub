import moment from "moment";

export const formatDate = (date: string) => {
  return moment(date).format("YYYY년 MMMM Do, a h:mm:ss");
};

export const extractURLs = (text: string) => {
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  const urls = text.match(urlRegex);

  if (urls) {
    return urls.map((url: string) => {
      if (url.startsWith("https://")) {
        return url.replace("https://", "").split("/")[0];
      } else {
        return url.split("/")[0];
      }
    });
  } else {
    return "";
  }
};
