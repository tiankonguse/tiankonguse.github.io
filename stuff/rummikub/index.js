const colors = { "red": "红", "blue": "蓝", "pink": "粉", "black": "黑" };
const colorName = ["red", "blue", "pink", "black"];
var globalData = {};


var dpData = {};
const C = 4;
const K = 13;
const KK = 26;
const BIT = 2;
const selectCase = [3, 4, 5];

function CheckNums(num, nums, n) {
    if (num + n > K) return false;
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



function Init(data) {
    globalData = data;

    for (var color in colors) {
        globalData[color] = [];

        var row1 = jQuery('.card-num .row.one.' + color)
        var row2 = jQuery('.card-num .row.two.' + color)
        row1.append('<div class="col num one select-num col-head ' + color + '"> <span class="val">' + colors[color] + '</span> </div>');
        row2.append('<div class="col num two select-num col-head ' + color + '"> <span class="val">' + colors[color] + '</span> </div>');
        for (var i = 1; i <= 13; i++) {
            globalData[color].push(0);
            row1.append('<div class="col num one btn col-num ' + color + '" attr-val="' + i + '" attr-color="' + color + '"> <span class="val">' + i + '</span> </div>');
            row2.append('<div class="col num two btn col-num ' + color + '" attr-val="' + i + '" attr-color="' + color + '"> <span class="val">' + i + '</span> </div>');
        }
    }
    InitDp();


    $(document).on('click', '.card-num .row .col-num', function () {
        Click($(this));
    });
    globalData.calTime = jQuery("#cal-time");
    globalData.calNum = jQuery("#cal-num");
    globalData.calResult = jQuery("#cal-result");

    $("#control-reset").click(function () {
        Reset();
    });
}



function Click($num) {
    if ($num.hasClass('col-head')) return;
    var color = $num.attr('attr-color');
    var num = parseInt($num.attr('attr-val'));
    if ($num.hasClass('select-num')) {
        globalData[color][num - 1]--;
        $num.removeClass('select-num');
    } else {
        globalData[color][num - 1]++;
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

function InitMobile(height) {
    globalData.width = $(window).width() * 5 / 6;
    globalData.graphF6 = new F6.Graph({
        container: document.getElementById('container-f6'),
        grid: true,
        width: globalData.width,
        height: height,
        fitView: true,
        fitViewPadding: 60,
        // Set groupByTypes to false to get rendering result with reasonable visual zIndex for combos
        groupByTypes: false,
        defaultCombo: {
            type: 'rect',
            size: [100, 10], // The minimum size of the Combo
            style: {
                lineWidth: 1,
            }
        },
        defaultNode: {
            type: 'rect',
            size: [20, 30], // The minimum size of the Co
            labelCfg: {
                style: {
                    fill: 'white',
                    fontSize: 14,
                },
            },
        },
        modes: {
            default: [
                'drag-canvas',
                'drag-node',
                'drag-combo',
                'collapse-expand-combo',
                'click-select',
            ],
        },
    });
    globalData.graphF6.render();
    globalData.graphF6.fitView();

    // 监听
    globalData.graphF6.on('dragstart', () => {
        $('body').addClass('stop-scrolling')
    });
    globalData.graphF6.on('dragend', () => {
        $('body').removeClass('stop-scrolling')
    });
    globalData.graphF6.on('combo:dragend', () => {
        globalData.graphF6.getCombos().forEach((combo) => {
            globalData.graphF6.setItemState(combo, 'dragenter', false);
        });
    });
    globalData.graphF6.on('node:dragend', () => {
        globalData.graphF6.getCombos().forEach((combo) => {
            globalData.graphF6.setItemState(combo, 'dragenter', false);
        });
    });

    globalData.graphF6.on('combo:dragenter', (e) => {
        globalData.graphF6.setItemState(e.item, 'dragenter', true);
    });
    globalData.graphF6.on('combo:dragleave', (e) => {
        globalData.graphF6.setItemState(e.item, 'dragenter', false);
    });

    globalData.graphF6.on('combo:mouseenter', (evt) => {
        const item = evt.item;
        globalData.graphF6.setItemState(item, 'active', true);
    });

    globalData.graphF6.on('combo:mouseleave', (evt) => {
        const item = evt.item;
        globalData.graphF6.setItemState(item, 'active', false);
    });
}

function renderMobie(gData) {
    var y = 0;
    globalData.width = $(window).width() * 5 / 6;
    var cellWidth = globalData.width / 10;
    var cellHeight = 60;
    var cellFontSize = 25
    var cellPading = 10

    var data = {
        "nodes": [],
        "combos": []
    };

    jQuery("canvas").remove();
    InitMobile((cellHeight + cellFontSize * 3) * gData.length);


    for (var i in gData) {
        var pdata = gData[i];
        var cellNum = pdata.childs.length;
        var x = 0;
        var comboName = 'combo_' + i;
        data.combos.push({
            id: comboName,
            type: 'rect',
            label: ''
        });
        for (var j in pdata.childs) {
            var cdata = pdata.childs[j];
            data.nodes.push({
                x: x + cellFontSize / 2,
                y: y + cellFontSize / 2,
                id: 'node_' + i + "_" + j,
                type: 'rect',
                label: cdata.num,
                comboId: comboName,
                style: {
                    // 仅在 keyShape 上生效
                    fill: cdata.color,
                    stroke: '#000',
                    lineWidth: 1,
                }
            });
            x += cellWidth + cellPading;
        }
        y += cellHeight + cellFontSize + cellFontSize;


    }
    console.log(data)

    globalData.graphF6.data(data);
    globalData.graphF6.render();
    globalData.graphF6.fitView();


}


function renderDestop(gData) {
    globalData.width = $(window).width() * 2 / 3;
    var cellWidth = globalData.width / 10;
    var cellHeight = 60;
    var cellFontSize = 25
    var cellPading = 10
    jQuery("svg").remove();

    globalData.graphX6 = new X6.Graph({
        container: document.getElementById('container-x6'),
        grid: true,
        width: globalData.width,
        height: (cellHeight + cellFontSize * 3) * gData.length,
        panning: true,
        embedding: {
            enabled: true,
            findParent: function (r) {
                const node = r.node;
                const bbox = node.getBBox();
                return this.getNodes().filter(function (node) {
                    const data = node.getData();
                    if (data && data.parent) {
                        const targetBBox = node.getBBox();
                        return bbox.isIntersectWithRect(targetBBox)
                    }
                    return false
                })
            }
        }
    });

    globalData.graphX6.clearCells();

    var y = 0;
    for (var i in gData) {
        const pdata = gData[i];
        var x = 0;
        const parent = globalData.graphX6.addNode({
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

            parent.addChild(globalData.graphX6.addNode({
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

function renderHtml(gData) {
    $(".card-ans .row").remove();
    $card = $(".card-ans");

    for (var i in gData) {
        var pdata = gData[i];
        var $row = jQuery('<div class="row"></div>');
        for (var j in pdata.childs) {
            var cdata = pdata.childs[j];
            $row.append('<div class="col num select-num col-head ' + cdata.color + '"> <span class="val">' + cdata.num + '</span> </div>');
        }
        $card.append($row);
    }

}

function renderAns(ans, callback) {
    var gData = []
    for (var k in ans) {
        var d = ans[k];
        var pData = {
            "childs": []
        }

        if (d.type == "num") {
            for (var j in d.value) {
                if (d.value[j] == 0) continue;
                pData.childs.push({
                    "num": d.num + 1,
                    "color": colorName[j]
                });
            }
        } else {
            for (var j in d.value) {
                pData.childs.push({
                    "num": d.value[j] + 1,
                    "color": d.color
                });
            }
        }
        gData.push(pData);
    }
    console.log("gData", gData)
    callback(gData);
    // renderHtml(gData);
    // renderMobie(gData);
    // renderDestop(gData);
}

function getTimestampInMs() {
    return Date.now();
}

function Check(callback) {
    globalData.beginTime = getTimestampInMs();
    globalData.endTime = getTimestampInMs();
    var colorNums = [];
    var num = 0;
    for (var color in colors) {
        var nums = []
        for (var k in globalData[color]) {
            num = num + globalData[color][k]
            nums.push(globalData[color][k]);
        }
        colorNums.push(nums);
    }
    globalData.calTime.text(" ...s ");
    globalData.calNum.text("，选择" + num + "个数字 ");
    globalData.calResult.text("，正在尝试计算答案中 ");

    var showText = "";
    setTimeout(function () {
        // console.log("colorNums", colorNums);
        var ans = []
        if (DfsCheck(0, colorNums, ans)) {
            console.log("ans", ans);
            renderAns(ans, callback);
            showText = '<span style="color: green;">答案显示如下</span>';
        } else {
            showText = '<span style="color: red;">没有答案</span>';
        }
        globalData.endTime = getTimestampInMs();
        var costTime = (globalData.endTime - globalData.beginTime) / 1000;
        globalData.calTime.text(costTime + "s");
        if (costTime > 10) {
            globalData.calResult.html('<span style="color: red;">超过 10 秒，放弃计算</span>');
        } else {
            globalData.calResult.html(showText);
        }
    }, 1);
}
function Reset() {
    var $rows = jQuery('.card-num .row .col-num');
    for (var i = 0; i < $rows.length; i++) {
        var $row = jQuery($rows[i]);
        var color = $row.attr('attr-color');
        var num = parseInt($row.attr('attr-val'));
        if ($row.hasClass('select-num')) {
            globalData[color][num - 1]--;
            $row.removeClass('select-num');
        }
    }
}


function isMobile() {
    var userAgentInfo = navigator.userAgent;

    var mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];

    var mobile_flag = false;

    //根据userAgent判断是否是手机
    for (var v = 0; v < mobileAgents.length; v++) {
        if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
            mobile_flag = true;
            break;
        }
    }

    var screen_width = window.screen.width;
    var screen_height = window.screen.height;

    //根据屏幕分辨率判断是否是手机
    if (screen_width < 500 && screen_height < 800) {
        mobile_flag = true;
    }

    return mobile_flag;
}