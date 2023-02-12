const colors = { "red": "红", "blue": "蓝", "pink": "粉", "black": "黑" };
const colorName = ["red", "blue", "pink", "black"];
var globalData = {};


var dpData = {};
const K = 13;
const KK = 26;
const BIT = 2;
const selectCase = [[], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4]];

function CheckNums(num, nums, counts) {
    for (var k in counts) {
        var kk = parseInt(k);
        if (counts[kk] == 0) continue;
        if (num + kk >= K) return false;
        if (nums[num + kk] + counts[kk] > BIT) {
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

function BornAns(num, nums) {
    var ans = [];
    for (var i in nums) {
        ans.push(num + parseInt(i));
    }
    return ans
}

var maskNum = 0;
function AddAns(mask, num, i, maskTmp) {
    dpData[maskTmp] = {
        "flag": 1,
        "ans": BornAns(num, selectCase[i]),
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
        "flag": 1,
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
            for (var i = 1; i < selectCase.length; i++) {
                var counts = [0, 0, 0, 0, 0];
                for (var k in selectCase[i]) {
                    counts[parseInt(k)]++;
                }
                if (!CheckNums(num, nums, counts)) {
                    // console.log("ckeck false mask=", mask, "num=", num, "i=", i, "j=", j, nums, counts);
                    continue;
                }

                for (var k in counts) {
                    nums[num + parseInt(k)] += counts[k];
                }
                var maskTmp = CalMask(nums);

                if (!dpData.hasOwnProperty(maskTmp)) {
                    AddAns(mask, num, i, maskTmp);
                    // console.log("mask=", mask, "num=", num, "i=", i, "j=", j, "maskTmp=", maskTmp, nums);
                    que.push(maskTmp);
                }


                for (var k in counts) {
                    nums[num + parseInt(k)] -= counts[k];
                }

            }
        }

    }

    console.log("init DP finish, size ", maskNum);
}

function Init(data) {
    globalData = data;

    for (var color in colors) {
        globalData[color] = [];
        globalData[color].push(0);

        var row1 = jQuery('.card-num .row.one.' + color)
        var row2 = jQuery('.card-num .row.two.' + color)
        row1.append('<div class="col num one select-num col-head ' + color + '"> <span class="val">' + colors[color] + '</span> </div>');
        row2.append('<div class="col num two select-num col-head ' + color + '"> <span class="val">' + colors[color] + '</span> </div>');
        for (var i = 1; i <= 13; i++) {
            globalData[color].push(0);
            row1.append('<div class="col num one btn ' + color + '" attr-val="' + i + '" attr-color="' + color + '"> <span class="val">' + i + '</span> </div>');
            row2.append('<div class="col num two btn ' + color + '" attr-val="' + i + '" attr-color="' + color + '"> <span class="val">' + i + '</span> </div>');
        }
    }
    InitDp();
}



function Click($num) {
    if ($num.hasClass('col-head')) return;
    var color = $num.attr('attr-color');
    var num = parseInt($num.attr('attr-val'));
    if ($num.hasClass('select-num')) {
        if (globalData[color][num] == 0) {
            alert("删除错误：" + color + " " + num + "为空")
            return;
        }

        globalData[color][num]--;
        $num.removeClass('select-num');
    } else {
        if (globalData[color][num] == 2) {
            alert("增加错误：" + color + " " + num + "已经有两个了")
            return;
        }
        globalData[color][num]++;
        $num.addClass('select-num');
    }
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
            ans.push({
                "type": "seq",
                "color": colorName[k],
                "value": data.ans
            });
            mask = data.pre;
        }
    }

    return true;
}

function DfsCheck(num, colorNums, ans) {
    if (CheckColors(colorNums, ans)) {
        return true;
    }

    if (num == K) return false;


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
                    ans.push({
                        "type": "num",
                        "num": num,
                        "value": sameCase[i]
                    });
                }
                if (j > 0) {
                    ans.push({
                        "type": "num",
                        "num": num,
                        "value": sameCase[j]
                    });
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

function renderAns(ans) {
    $(".card-ans .row").remove();
    $card = $(".card-ans");
    var gData = []
    for (var k in ans) {
        var d = ans[k];
        var kk = parseInt(k);
        var x = 10;
        var oneWidth = 80
        y += 100;

        var pData = {
            "childs": []
        }
        gData.push(pData);

        if (d.type == "num") {
            var num = d.num;
            var $row = jQuery('<div class="row"></div>');
            for (var j in d.value) {
                if (d.value[j] == 0) continue;
                $row.append('<div class="col num select-num col-head ' + colorName[j] + '"> <span class="val">' + num + '</span> </div>');

                pData.childs.push({
                    "num": num,
                    "color": colorName[j]
                });
            }
            $card.append($row);
        } else {
            var $row = jQuery('<div class="row"></div>');
            for (var j in d.value) {
                var num = d.value[j];
                $row.append('<div class="col num select-num col-head ' + d.color + '"> <span class="val">' + num + '</span> </div>');

                pData.childs.push({
                    "num": num,
                    "color": d.color
                });
            }
            $card.append($row);

        }
    }

    globalData.graph.clearCells();

    var y = 0;
    var cellWidth = globalData.width / 10;
    var cellHeight = 60;
    var cellFontSize = 25
    var cellPading = 10
    for (var i in gData) {
        var pdata = gData[i];
        var cellNum = pdata.childs.length;
        var x = 0;
        const parent = globalData.graph.addNode({
            x: x,
            y: y,
            width: 6 * (cellWidth + cellPading) + cellFontSize,
            height: cellHeight + cellFontSize,
            zIndex: 1,
            label: '',
            attrs: {
                body: {
                    fill: '#d3d2d2',
                }
            },
            data: {
                parent: true,
            },
        })

        for (var j in pdata.childs) {
            var cdata = pdata.childs[j];

            parent.addChild(globalData.graph.addNode({
                x: x + cellFontSize / 2,
                y: y + cellFontSize / 2,
                width: cellWidth,
                height: cellHeight,
                zIndex: 10,
                label: cdata.num,  // 文字
                attrs: {
                    body: {
                        stroke: '#000', // 边框颜色
                        fill: cdata.color,  // 填充颜色
                    },
                    label: {
                        fill: 'white',  // 文字颜色
                        fontSize: cellFontSize,
                    },
                },
            }))
            x += cellWidth + cellPading;

        }
        y += cellHeight + cellFontSize + cellFontSize;

    }

}
function Check() {
    var colorNums = []
    for (var color in colors) {
        var nums = []
        for (var k in globalData[color]) {
            nums.push(globalData[color][k]);
        }
        colorNums.push(nums);
    }
    var ans = []
    if (DfsCheck(0, colorNums, ans)) {
        console.log(ans);
        renderAns(ans);
    } else {
        alert("No");
    }
}