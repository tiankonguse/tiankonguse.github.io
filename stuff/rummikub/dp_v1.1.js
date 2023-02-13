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
    const L = 6;
    const R = 6;
    var curentIndex = 0;

    var lrHash = [];
    function GetDP(n, lrs) {
        var tmpDp = g.dp[n];
        for (var color = 0; color < C; color++) {
            const lr = lrs[color];
            const l = lr[0];
            const r = lr[1];
            const index = lrHash[l][r];
            tmpDp = tmpDp[index];
        }
        return tmpDp;
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
    function FirstColor(n, lrs) {
        var color = 0;
        while (color < C) {
            const val = GetVal(n, lrs[color], color, 0);
            if (val != 0) break;
            color++;
        }
        return color;
    }

    function SetTrue() {
        return curentIndex + 1;
    }
    function SetFalse() {
        return curentIndex + 0;
    }
    function IsTrue(v) {
        return v % 2;
    }
    function IsSet(v) {
        return v >= curentIndex;
    }

    function Dfs(n, lrs) {
        if (n == -1) {
            return SetTrue(); // 出口
        }

        var ret = GetDP(n, lrs);
        if (IsSet(ret.flag)) {
            return ret.flag;
        }

        const color = FirstColor(n, lrs);
        if (color == C) { // 全是 0
            var nextLrs = lrs;
            for (const c in nextLrs) {
                for (const v in nextLrs[c]) {
                    if (nextLrs[c][v] == 0) continue;
                    nextLrs[c][v]--;
                }
            }
            return ret.flag = Dfs(n - 1, nextLrs);
        }

        // 相同颜色
        const maxOffset = CalMaxOffset(n, lrs[color], color);
        for (var offset = 3; offset <= maxOffset; offset++) {
            var nextLrs = DumpLrs(lrs);
            nextLrs[color] = UpdateLR(offset, nextLrs[color][1]);
            ret.flag = Dfs(n, nextLrs);
            if (IsTrue(ret.flag)) {
                var oneAns = [];
                for (var i = 0; i < offset; i++) {
                    oneAns.push({ "num": n - i, "color": color });
                }
                g.ans.push(oneAns);
                return ret.flag;
            }
        }

        // 相同数字

        const curentColorVals = CalColorVals(n, lrs);
        var curentColorSum = 0;
        for (const i in curentColorVals) {
            curentColorSum += curentColorVals[i];
        }
        if (curentColorSum < 3) {
            // 不足三个或四个，没答案
            return ret.flag = SetFalse();
        }

        // 数字全选择
        var nextLrs = DumpLrs(lrs);
        for (const i in curentColorVals) {
            if (curentColorVals[i] == 0) continue;
            nextLrs[i] = UpdateLR(1, lrs[i][1]);
        }
        ret.flag = Dfs(n, nextLrs);
        if (IsTrue(ret.flag)) {
            var oneAns = [];
            for (const i in curentColorVals) {
                if (curentColorVals[i] == 0) continue;
                oneAns.push({ "num": n, "color": i });
            }
            g.ans.push(oneAns);
            return ret.flag;
        }

        if (curentColorSum == 3) {
            return ret.flag = SetFalse();
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
            ret.flag = Dfs(n, nextLrs);
            if (IsTrue(ret.flag)) {
                var oneAns = [];
                for (const i in curentColorVals) {
                    if (c == i) continue;
                    oneAns.push({ "num": n, "color": i });
                }
                g.ans.push(oneAns);
                return ret.flag;
            }
        }
        return ret.flag = SetFalse();
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
    function DfsInit(nums) {
        if (nums instanceof Array) {
            for (const i in nums) {
                DfsInit(nums[i]);
            }
        } else {
            nums.flag = -1;
        }
    }


    function InitDp() {
        var lrIndex = 0;
        for (var i = 0; i < L; i++) {
            var rHash = []
            for (var j = i; j < L; j++) {
                rHash.push(lrIndex);
                lrIndex++;
            }
            lrHash.push(rHash);
        }

        var dims = [N];
        for (var i = 0; i < C; i++) {
            dims.push(lrIndex);
        }
        // console.log("dims", dims);
        if (typeof (g.dp) != "undefined") {
            // DfsInit(g.dp);
            curentIndex += 2;
        } else {
            g.dp = CreateArray(dims, 0, CreateDpVal);
        }

    }

    function CreateNumVal() {
        return 0;
    }
    function Solver(colorNums, ans) {
        InitDp();
        if (typeof (colorNums) == "undefined") {
            return false;
        }
        g.colorNums = colorNums;
        g.ans = ans;
        const lrs = CreateArray([C, 2], 0, CreateNumVal);
        // console.log("lrs", lrs);
        const ret = Dfs(N - 1, lrs);
        // console.log("ans", ret, g);
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
function CheckV1(colorNums, ans) {
    return Solver(colorNums, ans);
}
