var FindProxyForURL = function(init, profiles) {
  return function(url, host) {
      "use strict";
      var result = init, scheme = url.substr(0, url.indexOf(":"));
      do {
          result = profiles[result];
          if (typeof result === "function") result = result(url, host, scheme);
      } while (typeof result !== "string" || result.charCodeAt(0) === 43);
      return result;
  };
}("+auto switch", {
  "+auto switch": function(url, host, scheme) {
      "use strict";
      if (/(?:^|\.)github\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)fanbox\.cc$/.test(host)) return "+vps";
      if (/(?:^|\.)marketo\.net$/.test(host)) return "+vps";
      if (/(?:^|\.)microsoft\.com$/.test(host)) return "DIRECT";
      if (/(?:^|\.)deviantart\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)bing\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)poecdn\.net$/.test(host)) return "+vps";
      if (/(?:^|\.)poe\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)ora\.sh$/.test(host)) return "+vps";
      if (/(?:^|\.)forefront\.ai$/.test(host)) return "+vps";
      if (/(?:^|\.)whatismyipaddress\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)v2fly\.org$/.test(host)) return "+vps";
      if (/^openai\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)openai\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)ingest\.sentry\.io$/.test(host)) return "+vps";
      if (/(?:^|\.)intercom\.io$/.test(host)) return "+vps";
      if (/(?:^|\.)sentry\.io$/.test(host)) return "+vps";
      if (/(?:^|\.)featuregates\.org$/.test(host)) return "+vps";
      if (/^featuregates\.org$/.test(host)) return "+vps";
      if (/(?:^|\.)statsigapi\.net$/.test(host)) return "+vps";
      if (/(?:^|\.)intercomcdn\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)googleapis\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)gstatic\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)azureedge\.net$/.test(host)) return "+vps";
      if (/(?:^|\.)arkoselabs\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)auth0\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)super-copy\.com$/.test(host)) return "+vps";
      if (/^bard\.google\.com$/.test(host)) return "+vps";
      if (/^www\.bing\.com$/.test(host)) return "+vps";
      if (/^5sim\.net$/.test(host)) return "+vps";
      if (/(?:^|\.)google\.com$/.test(host)) return "+vps";
      if (/(?:^|\.)henduohao\.net$/.test(host)) return "+vps";
      if (/(?:^|\.)v8jisu\.cn$/.test(host)) return "+vps";
      if (/(?:^|\.)henduohao\.com$/.test(host)) return "+vps";
      if (/^docker\.com$/.test(host)) return "DIRECT";
      if (/^docker\.io$/.test(host)) return "DIRECT";
      return "DIRECT";
  },
  "+vps": function(url, host, scheme) {
      "use strict";
      if (/^127\.0\.0\.1$/.test(host) || /^::1$/.test(host) || /^localhost$/.test(host)) return "DIRECT";
      return "SOCKS5 43.153.106.188:14399; SOCKS 43.153.106.188:14399; DIRECT";
  }
});