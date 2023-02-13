const colors = { "red": "红", "blue": "蓝", "pink": "粉", "black": "黑" };
const colorName = ["red", "blue", "pink", "black"];
var globalData = {};

function Init(data) {
    globalData = data;

    for (const color in colors) {
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


    $(document).on('click', '.card-num .row .col-num', function () {
        Click($(this));
    });
    globalData.calTime = jQuery("#cal-time");
    globalData.calNum = jQuery("#cal-num");
    globalData.calResult = jQuery("#cal-result");

    $("#control-reset").click(function () {
        Reset();
    });
    // CheckV1();
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
                "color": colorName[one.color]
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

