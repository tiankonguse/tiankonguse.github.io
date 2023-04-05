// http://findproxyforurl.com/
function FindProxyForURL(url, host) {
    let urlList = [
        "openai.com",
        "google.com",
        "poe.com",
    ];
    for (let i in urlList) {
        let name = "https://*." + urlList[i] + "/*";
        if (shExpMatch(url, name)) {
            return "SOCKS 43.133.254.69:4399";
        }
    }
    return "DIRECT";
}