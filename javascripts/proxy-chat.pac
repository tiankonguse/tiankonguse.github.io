function FindProxyForURL(url, host) {
    let iplist = [
        "https://*openai.com/*",
        "https://*google.com/*",
    ];
    for(let i in iplist){
        if (shExpMatch(url, iplist[i])) {
            return "SOCKS 43.133.254.69:8080";
        }
    }
    return "DIRECT";
}