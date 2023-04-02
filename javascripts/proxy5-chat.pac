// http://findproxyforurl.com/
function FindProxyForURL(url, host) {
    if (shExpMatch(url, "https://*.openai.com/*")) {
        return "SOCKS5 43.133.254.69:4399";
    }
    if (shExpMatch(url, "https://*.google.com/*")) {
        return "SOCKS5 43.133.254.69:4399";
    }
    return "DIRECT";
}