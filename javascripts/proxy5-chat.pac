// http://findproxyforurl.com/
function FindProxyForURL(url, host) {
    if (shExpMatch(url, "https://*.openai.com/*")) {
        return "SOCKS5 43.130.156.215:4399";
    }
    if (shExpMatch(url, "https://*.google.com/*")) {
        return "SOCKS5 43.130.156.215:4399";
    }
    return "DIRECT";
}