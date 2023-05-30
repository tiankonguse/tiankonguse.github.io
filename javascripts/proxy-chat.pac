// http://findproxyforurl.com/
function FindProxyForURL(url, host) {
  "use strict";
  let ipport = "43.130.156.215:4397";
  let proxy = "SOCKS " + ipport + "; SOCKS " + ipport + "; DIRECT;";
  let direct = "DIRECT;";

  let urlList = [
    "openai.com",
    "google.com",
    "poe.com",
    "bing.com",
    "vercel.com",
    "twitter.com",
    "twimg.com",
    "sentry.io",
    "intercom.io",
    "featuregates.org",
    "statsigapi.net",
    "intercomcdn.com",
  ];
  for (let i in urlList) {
    if (host.split(".").slice(-2).join(".") == urlList[i]) {
      return proxy;
    }
  }
  return direct;
}
