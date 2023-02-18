const colors = [{
    "name": "red",
    "title": "红",
    "num": 13
}, {
    "name": "blue",
    "title": "蓝",
    "num": 13
}, {
    "name": "pink",
    "title": "粉",
    "num": 13
}, {
    "name": "black",
    "title": "黑",
    "num": 13
}, {
    "name": "green",
    "title": "王",
    "num": 1
}];
const numMax = 12;
var globalData = {};

function Init(data) {
    globalData = data;

    for (const colorIndex in colors) {
        var colorName = colors[colorIndex].name;
        var colorNum = colors[colorIndex].num;
        var colorTitle = colors[colorIndex].title
        globalData[colorName] = [];

        for (var j = 0; j < 2; j++) {
            var numClass = "num" + (j + 1);
            var row = jQuery('.card-num .row.' + numClass + '.' + colorName)
            row.append('<div class="col num ' + numClass + ' select-num col-head ' + colorName + '"> <span class="val">' + colorTitle + '</span> </div>');
            var col11 = jQuery('<div class="col-11"></div></div>');
            var row11 = jQuery('<div class="row row-num"></div>');
            for (var i = 1; i <= colorNum; i++) {
                globalData[colorName].push(0);
                row11.append('<div class="col num + numClass + btn col-num ' + colorName + '" attr-val="' + i + '" attr-color="' + colorName + '"> <span class="val">' + i + '</span> </div>');
            }
            if (numMax - colorNum > 0) {
                var num = numMax - colorNum;
                row11.append('<div class="col-' + num + ' btn"> <span class="val"></span> </div>');
            }
            col11.append(row11);
            row.append(col11);
        }
    }



    $(document).on('click', '.card-num .row-num .col-num', function () {
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





function renderHtml(gData) {
    $(".card-ans .row").remove();
    $card = $(".card-ans");

    for (var i in gData) {
        var pdata = gData[i];
        var $row = jQuery('<div class="row html-row"></div>');
        $row.append('<div class="col num select-num col-head "> <span class="val"></span> </div>');
        $row.append('<div class="col num select-num col-head "> <span class="val"></span> </div>');
        $row.append('<div class="col num select-num col-head "> <span class="val"></span> </div>');
        for (var j in pdata.childs) {
            var cdata = pdata.childs[j];
            $row.append('<div class="col num select-num col-head ' + cdata.color + '"> <span class="val">' + cdata.num + '</span> </div>');
        }
        $row.append('<div class="col num select-num col-head "> <span class="val"></span> </div>');
        $row.append('<div class="col num select-num col-head "> <span class="val"></span> </div>');
        $row.append('<div class="col num select-num col-head "> <span class="val"></span> </div>');
        $card.append($row);
    }

}

function renderAns(ans, callback) {
    var gData = []
    for (var k in ans) {
        const oneAns = ans[k];
        var pData = {
            "childs": []
        }

        for (const j in oneAns) {
            const one = oneAns[j];
            pData.childs.push({
                "num": one.num + 1,
                "color": colors[one.color].name
            });
        }
        gData.push(pData);
    }
    console.log("gData", gData)
    callback(gData);
}

function getTimestampInMs() {
    return Date.now();
}

function Check(callback) {
    globalData.beginTime = getTimestampInMs();
    globalData.endTime = getTimestampInMs();
    var colorNums = [];
    var num = 0;
    for (var colorIndex in colors) {
        var colorName = colors[colorIndex].name;
        var nums = [];
        for (var k in globalData[colorName]) {
            num = num + globalData[colorName][k]
            nums.push(globalData[colorName][k]);
        }
        colorNums.push(nums);
    }
    globalData.calTime.text(" ...s ");
    globalData.calNum.text("选择" + num + "个数字 ");
    globalData.calResult.text("正在尝试计算答案中 ");

    var showText = "";
    setTimeout(function () {
        console.log("colorNums", colorNums);
        var ans = []


        if (CheckV1(colorNums, ans)) {
            // if (DfsCheck(0, colorNums, ans)) {
            console.log("ans", ans);
            renderAns(ans, callback);
            showText = '<span style="color: green;">答案显示如下</span>';
        } else {
            renderAns([], callback);
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
    }, 0);
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

