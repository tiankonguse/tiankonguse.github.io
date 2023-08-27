// http://findproxyforurl.com/
function FindProxyForURL(url, host) {
  "use strict";
  let ipport = "43.153.106.188:14399";
  let proxy = "SOCKS " + ipport + "; SOCKS5 " + ipport + "; DIRECT;";
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
    "azureedge.net",
    "intercom.io",
    "sentry.io",
    "statsigapi.net",
    "arkoselabs.com",
    "speak.com",
    "scholar-ai.net",
    "toonily.com",
  ];
  for (let i in urlList) {
    if (host.split(".").slice(-2).join(".") == urlList[i]) {
      return proxy;
    }
  }
  return direct;
}
