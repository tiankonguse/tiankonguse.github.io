// http://findproxyforurl.com/
function FindProxyForURL(url, host) {
    let iplist = [
        ".openai.com",
        ".google.com"
    ];
    for(let i in iplist){
        if (dnsDomainIs(host, iplist[i])) {
            return "SOCKS 43.133.254.69:8080";
        }
    }
    return "DIRECT";
}