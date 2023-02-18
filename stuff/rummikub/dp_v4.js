"use strict";
/*
F(n, l, r) 含义 [n, n-l) 都减2， [n-l, n-r) 都减一。 
f(n, l1, r1, l2, r2, l3, r3, l4, r4) = {
    "flag" : 0,
    "pre" : [n, l1, r1, l2, r2, l3, r3, l4, r4]
}
*/

// 闭包处理
var Solver = function () {
    var g = {};
    const N = 13;
    const C = 4;
    const R = 6;
    var curentIndex = 0;

    var lrHash = [];
    function GetDP(n, lrs, color) {
        var tmpDp = g.dp[color][n];
        var preObj = tmpDp;
        var preIndex = -1;
        for (var i = 0; i < C; i++) {
            const lr = lrs[i];
            const l = lr[0];
            const r = lr[1];
            const index = lrHash[r][l];
            preObj = tmpDp;
            preIndex = index;
            tmpDp = tmpDp[index];
        }
        return { "obj": preObj, "index": preIndex };
    }

    // F(n, l, r) 含义 [n, n-l) 都减2， [n-l, n-r) 都减一。
    function GetVal(n, lr, color, offset) {
        var baseVal = g.colorNums[color][n - offset];
        for (const i in lr) {
            if (lr[i] > offset) {
                baseVal--;
            }
        }
        return baseVal;
    }

    function DumpLrs(lrs) {
        var tmpLrs = []
        for (var i in lrs) {
            var tmpLr = [];
            for (var j in lrs[i]) {
                tmpLr.push(lrs[i][j]);
            }
            tmpLrs.push(tmpLr);
        }
        return tmpLrs
    }

    /**
     * 
     * @param {数字最大值} n 
     * @param {两个顺子的偏移量} lr 
     * @param {当前颜色} color 
     * @returns 
     */
    function CalMaxOffset(n, lr, color) {
        var maxOffset = 0;
        while (n - maxOffset >= 0 && maxOffset < 5) {
            const val = GetVal(n, lr, color, maxOffset);
            if (val == 0) break;
            maxOffset++;
        }
        return maxOffset;
    }

    /**
     * 
     * @param {数字最大值} n 
     * @param {当前的状态} lrs 
     */
    function CalColorVals(n, lrs) {
        var curentColorVals = []
        for (const color in lrs) {
            const lr = lrs[color];
            const val = GetVal(n, lr, color, 0);
            if (val > 0) {
                curentColorVals.push(1);
            } else {
                curentColorVals.push(0);
            }
        }
        return curentColorVals;
    }
    function UpdateLR(l, r) {
        if (l < r) {
            return [l, r];
        } else {
            return [r, l];
        }
    }

    function SetTrue() {
        return curentIndex + 1;
    }
    function SetFalse() {
        return curentIndex + 0;
    }
    function SetObj(o, v) {
        return o.obj[o.index] = v;
    }
    function SetFalseObj(o) {
        return SetObj(o, SetFalse());
    }
    function IsTrue(v) {
        return v % 2;
    }
    function GetObjVal(o) {
        return o.obj[o.index];
    }
    function IsSetObj(o) {
        return GetObjVal(o) >= curentIndex;
    }
    function IsTrueObj(o) {
        return IsTrue(GetObjVal(o));
    }

    function Dfs(n, lrs, color) {
        if (n == -1) {
            return SetTrue(); // 出口
        }
        if (color == C) {
            return Dfs(n - 1, lrs, 0);
        }

        var ret = GetDP(n, lrs, color);
        if (IsSetObj(ret)) {
            return GetObjVal(ret);
        }

        const curentColorVals = CalColorVals(n, lrs);
        if (curentColorVals[color] == 0) {
            var nextLrs = lrs;
            for (const v in nextLrs[color]) {
                if (nextLrs[color][v] == 0) continue;
                nextLrs[color][v]--;
            }
            return SetObj(ret, Dfs(n, nextLrs, color + 1));
        }

        // 相同颜色
        const maxOffset = CalMaxOffset(n, lrs[color], color);
        for (var offset = 3; offset <= maxOffset; offset++) {
            var nextLrs = DumpLrs(lrs);
            nextLrs[color] = UpdateLR(offset, nextLrs[color][1]);
            SetObj(ret, Dfs(n, nextLrs, color));
            if (IsTrueObj(ret)) {
                var oneAns = [];
                for (var i = 0; i < offset; i++) {
                    oneAns.push({ "num": n - i, "color": color });
                }
                g.ans.push(oneAns);
                return GetObjVal(ret);
            }
        }

        // 相同数字
        var curentColorSum = 0;
        for (const i in curentColorVals) {
            curentColorSum += curentColorVals[i];
        }
        if (curentColorSum < 3) {
            // 不足三个或四个，没答案
            return SetFalseObj(ret);
        }

        // 数字全选择
        var nextLrs = DumpLrs(lrs);
        for (const i in curentColorVals) {
            if (curentColorVals[i] == 0) continue;
            nextLrs[i] = UpdateLR(1, lrs[i][1]);
        }
        SetObj(ret, Dfs(n, nextLrs, color));
        if (IsTrueObj(ret)) {
            var oneAns = [];
            for (const i in curentColorVals) {
                if (curentColorVals[i] == 0) continue;
                oneAns.push({ "num": n, "color": i });
            }
            g.ans.push(oneAns);
            return GetObjVal(ret);
        }

        if (curentColorSum == 3) {
            return SetFalseObj(ret);
        }

        // 此时， color == 0 && curentColorSum == 4, 枚举选择三个
        for (var c = 1; c < C; c++) {
            var nextLrs = lrs;
            if (c + 1 < C) {
                nextLrs = DumpLrs(lrs);
            }
            for (const i in curentColorVals) {
                if (c == i) continue;
                nextLrs[i] = UpdateLR(1, lrs[i][1]);
            }
            SetObj(ret, Dfs(n, nextLrs, color));
            if (IsTrueObj(ret)) {
                var oneAns = [];
                for (const i in curentColorVals) {
                    if (c == i) continue;
                    oneAns.push({ "num": n, "color": i });
                }
                g.ans.push(oneAns);
                return GetObjVal(ret);
            }
        }
        return SetFalseObj(ret);
    }

    function CreateDpVal() {
        return { "flag": -1 };
    }
    function CreateArray(dims, offset, createVal) {
        if (dims.length === offset) return createVal();
        var ret = [];
        for (var i = 0; i < dims[offset]; i++) {
            ret.push(CreateArray(dims, offset + 1, createVal));;
        }
        return ret;
    }
    function CreateNumVal() {
        return 0;
    }


    function InitDp() {
        if (typeof (g.dp) != "undefined") {
            curentIndex += 2;
            return;
        }
        var lr = [];
        var lrIndex = 0;
        for (var i = 0; i < R; i++) {
            var rHash = []
            for (var j = 0; j <= i; j++) {
                rHash.push(lrIndex);
                lrIndex++;
            }
            lrHash.push(rHash);
            lr.push(lrIndex);
        }
        console.log("lr", lr)
        console.log("lrHash", lrHash)
        const lr6 = lr[R - 1];
        const lr5 = lr[R - 2];

        g.dp = [];
        for (var c = 0; c < C; c++) {
            var dims = [N];
            for (var i = 0; i < C; i++) {
                if (i == c) {
                    dims.push(lr6);
                } else {
                    dims.push(lr5);
                }
            }
            g.dp.push(CreateArray(dims, 0, CreateNumVal));
        }
    }

    function Solver(colorNums, ans) {
        InitDp();
        g.colorNums = colorNums;
        g.ans = ans;
        const lrs = CreateArray([C, 2], 0, CreateNumVal);
        const ret = Dfs(N - 1, lrs, 0);
        return IsTrue(ret);
    }
    return Solver;
}();

/**
 *
 * @param {*} colorNums[4][13]
 * @param {*} ans[]
 * @returns {*} bool, 返回true为通过，返回false为不通过
 */
const AllMatchIndex = 4;

function CheckV1(colorNums, ans) {
    var allMatchNum = colorNums[AllMatchIndex][0];
    function Dfs(allMatchIndex, J) {
        if (allMatchIndex == allMatchNum) {
            return Solver(colorNums, ans);
        }

        for (var j = J; j < 13; j++) {
            for (var i = 0; i < 4; i++) {
                if (colorNums[i][j] == 2) continue;

                colorNums[i][j]++;
                if (Dfs(allMatchIndex + 1, J)) {
                    ans.push([{
                        "num": j,
                        "color": i
                    }]);
                    return true;
                }
                colorNums[i][j]--;
            }
        }
        return Solver(colorNums, ans);
    }
    if (Solver(colorNums, ans)) {
        for (var i = 0; i < allMatchNum; i++) {
            ans.push([{
                "num": -1,
                "color": 4
            }]);
        }
        return true;
    }
    return Dfs(0, 0);
}
