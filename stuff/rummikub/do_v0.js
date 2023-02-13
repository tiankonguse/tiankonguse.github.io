//
// InitDp();

var dpData = {};
const C = 4;
const K = 13;
const KK = 26;
const BIT = 2;
const selectCase = [3, 4, 5];

function CheckNums(num, nums, n) {
    if (num + n > K) {
        return false;
    }
    for (var k = 0; k < n; k++) {
        if (nums[num + k] + 1 > BIT) {
            return false;
        }
    }
    return true;
}

function CalMask(nums) {
    var mask = 0;
    for (var i = 0; i < K; i++) {
        var offset = i * 2;
        if (nums[i] == 1) {
            mask = mask | (1 << offset);
        } else if (nums[i] == 2) {
            mask = mask | (1 << offset) | (1 << (offset + 1));
        }
    }
    return mask;
}



function BornAns(num, n) {
    var ans = [];
    for (var i = 0; i < n; i++) {
        ans.push(num + i);
    }
    return ans
}


var maskNum = 0;
function AddAns(mask, num, n, maskTmp) {
    dpData[maskTmp] = {
        "ans": BornAns(num, n),
        "pre": mask
    };
    maskNum = maskNum + 1;
}

function MaskToNums(mask) {
    var nums = [];
    for (var i = 0; i < K; i++) {
        const offset = i * 2;
        var num = 0;
        if (mask & (1 << offset)) {
            num++;
        }
        if (mask & (1 << (offset + 1))) {
            num++;
        }
        nums.push(num);
    }
    return nums;
}






function InitDp() {
    dpData[0] = {
        "ans": [],
        "pre": -1
    }
    maskNum = 1;

    var nums = [];
    for (var i = 0; i < K; i++) {
        nums.push(0);
    }
    var que = []
    que.push(0);

    while (que.length > 0) {
        const mask = que.pop();
        var nums = MaskToNums(mask);
        // console.log("mask", mask, nums);

        for (var num = 0; num < K; num++) {
            for (var i = 0; i < selectCase.length; i++) {
                const n = selectCase[i];
                if (!CheckNums(num, nums, n)) {

                    continue;
                }

                for (var k = 0; k < n; k++) {
                    nums[num + k]++;
                }
                var maskTmp = CalMask(nums);

                if (!dpData.hasOwnProperty(maskTmp)) {
                    AddAns(mask, num, n, maskTmp);
                    // console.log("mask=", mask, "num=", num, "i=", i, "j=", j, "maskTmp=", maskTmp, nums);
                    que.push(maskTmp);
                }


                for (var k = 0; k < n; k++) {
                    nums[num + k]--;
                }

            }
        }

    }

    console.log("init DP finish, size ", maskNum);
}


const sameCase = [[0, 0, 0, 0], [1, 1, 1, 0], [1, 1, 0, 1], [1, 0, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1]]

function CheckColors(colorNums, ans) {
    var masks = []
    for (var k in colorNums) {
        const mask = CalMask(colorNums[k]);
        masks.push(mask)
        if (!dpData.hasOwnProperty(mask)) return false;
    }

    for (var k in colorNums) {
        var mask = masks[k];
        while (mask != 0) {
            const data = dpData[mask];
            var tmpAns = [];
            for (var i in data.ans) {
                tmpAns.push({ "num": data.ans[i], "color": k });
            }
            ans.push(tmpAns);
            mask = data.pre;
        }
    }

    return true;
}


function DfsSplit(colorNums, c, k, leftColorNums) {
    if (c < 0 || k < 0 || c >= C || k >= K) return 0;
    if (leftColorNums[c][k] == colorNums[c][k]) return 0;
    if (colorNums[c][k] == 0) return 0;
    var ans = 1;
    leftColorNums[c][k] = colorNums[c][k];
    for (var i = -1; i <= 1; i++) {
        ans += DfsSplit(colorNums, c + i, k, leftColorNums);
        ans += DfsSplit(colorNums, c, k + i, leftColorNums);
    }
    return ans;
}


function SplitColorNums(colorNums, leftColorNums, rightColorNums) {
    var flag = false
    var leftNum = 0;
    for (var k = 0; k < K; k++) {
        for (var c = 0; c < C; c++) {
            if (colorNums[c][k] > 0) {
                leftNum = DfsSplit(colorNums, c, k, leftColorNums);
                flag = true
                break;
            }
        }
        if (flag) {
            break
        }
    }

    var rightNum = 0;
    for (var c = 0; c < C; c++) {
        for (var k = 0; k < K; k++) {
            if (colorNums[c][k] == leftColorNums[c][k]) continue;
            rightColorNums[c][k] = colorNums[c][k];
            rightNum++;
        }
    }
    return rightNum > 0;
}



function CreateEmptyColorNums() {
    var colorNums = []
    for (var i = 0; i < 4; i++) {
        colorNums.push([]);
        for (var j = 0; j < K; j++) {
            colorNums[i].push(0);
        }
    }
    return colorNums
}

function DfsCheck(num, colorNums, ans) {
    if (CheckColors(colorNums, ans)) {
        return true;
    }


    if (num == K) return false;

    // 连通分支优化
    var leftColorNums = CreateEmptyColorNums()
    var rightColorNums = CreateEmptyColorNums()
    if (SplitColorNums(colorNums, leftColorNums, rightColorNums)) {
        var leftAns = []
        var rightAns = []
        if (DfsCheck(num, leftColorNums, leftAns) && DfsCheck(num, rightColorNums, rightAns)) {
            for (var i in leftAns) {
                ans.push(leftAns[i]);
            }
            for (var i in rightAns) {
                ans.push(rightAns[i]);
            }
            return true;
        }
        return false;
    }


    var nowTime = getTimestampInMs();
    if ((nowTime - globalData.endTime) > 10000) {
        return false;
    }



    var nums = [];
    for (var k in colorNums) {
        nums.push(colorNums[k][num]);
    }

    for (var i = 0; i < sameCase.length; i++) {
        for (var j = i; j < sameCase.length; j++) {
            var counts = [0, 0, 0, 0];
            var flag = true;
            for (var k in sameCase[i]) {
                counts[k] += sameCase[i][k];
                counts[k] += sameCase[j][k];
                if (counts[k] > nums[k]) {
                    flag = false;
                }
            }

            if (!flag) continue;

            // 选择 i+j 策略
            for (var k in counts) {
                colorNums[k][num] -= counts[k];
            }

            if (DfsCheck(num + 1, colorNums, ans)) {
                if (i > 0) {
                    var tmpAns = []
                    for (var k in sameCase[i]) {
                        if (sameCase[i][k] == 0) continue;
                        tmpAns.push({ "num": num, "color": k });
                    }
                    ans.push(tmpAns);

                }
                if (j > 0) {

                    var tmpAns = []
                    for (var k in sameCase[j]) {
                        if (sameCase[j][k] == 0) continue;
                        tmpAns.push({ "num": num, "color": k });
                    }
                    ans.push(tmpAns);
                }
                return true;
            }

            // 还原 i+j 策略
            for (var k in counts) {
                colorNums[k][num] += counts[k];
            }

        }
    }
    return false;
}






