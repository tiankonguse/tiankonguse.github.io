// http://findproxyforurl.com/
function FindProxyForURL(url, host) {
  let ipport = "43.130.156.215:4399";
  let proxy = "SOCKS5 " + ipport + "; SOCKS " + ipport + "; DIRECT;";
  let direct = "DIRECT;";

  let urlList = [
    "openai.com",
    "google.com",
    "poe.com",
    "bing.com",
    "vercel.com",
  ];
  for (let i in urlList) {
    if (host.split(".").slice(-2).join(".") == urlList[i]) {
      return proxy;
    }
  }
  return direct;
}