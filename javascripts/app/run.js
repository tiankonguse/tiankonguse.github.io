var names = {
    "_a": _a,
    "_b": _b,
    "_c": _c,
    "_d": _d,
    "_e": _e,
    "_f": _f,
    "_g": _g,
    "_h": _h,
    "_i": _i,
    "_j": _j,
    "_0x17c2": _0x17c2
};

function isNameChar(c) {
    if (c >= '0' && c <= '9') return true;
    if (c >= 'a' && c <= 'z') return true;
    if (c >= 'A' && c <= 'Z') return true;
    if (c >= '_' && c <= '_') return true;
    return false;
}
function isNum(c) {
    if (c >= '0' && c <= '9') return true;
    return false;
}

function ReadName(s, i) {
    var j = i;
    while (isNameChar(s[j])) j++;
    return t = s.substring(i, j);
}

function ReadNum(s, i) {
    var j = i;
    while (isNum(s[j])) j++;
    return s.substring(i, j);
}

function run(s, limit) {
    var ret = "";
    var pos = 0;
    while (pos < s.length) {
        var p0 = pos;
        if (!isNameChar(s[p0])) {
            ret += s[p0];
            pos++;
            continue;
        }
        var a = ReadName(s, pos);
        if (!names.hasOwnProperty(a) || (names.hasOwnProperty(a) && s[pos+a.length] != '[')) {
            pos += a.length;
            ret += a;
            continue;
        }

        var ans = "";
        while (names.hasOwnProperty(a)) {
            pos += a.length;

            if (s[pos] != '[') {
                console.log("expect [, pos=", pos, "char=", s[pos]);
                return;
            }
            pos++; // skip [

            var b = ReadNum(s, pos);
            pos += b.length;

            b = parseInt(b);
            ans += names[a][parseInt(b)];

            if (s[pos] != ']') {
                console.log("expect ], pos=", pos, "char=", s[pos]);
                return;
            }
            pos++; // skip ]

            if (s[pos] != '+') {
                break;
            }

            pos++; // skip +
            a = ReadName(s, pos);
        }
        ret += "\"" + ans + "\"";
        if(pos > limit){
            break;
        }
    }
    return ret;
}