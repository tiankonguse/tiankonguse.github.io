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
            return "SOCKS 49.51.98.195:8080";
        }
    }
    return "DIRECT";
}