const colors = { "red": "红", "blue": "蓝", "pink": "粉", "black": "黑" };
var globalData = {};
function Init(data) {
    globalData = data;

    for (var color in colors) {
        globalData[color] = [];
        globalData[color].push(0);

        var row1 = jQuery('.row.one.' + color)
        var row2 = jQuery('.row.two.' + color)
        row1.append('<div class="col num one select-num col-head"> <span class="val">' + colors[color] + '</span> </div>');
        row2.append('<div class="col num two select-num col-head"> <span class="val">' + colors[color] + '</span> </div>');
        for (var i = 1; i <= 13; i++) {
            globalData[color].push(0);
            row1.append('<div class="col num one btn" attr-val="' + i + '" attr-color="' + color + '"> <span class="val">' + i + '</span> </div>');
            row2.append('<div class="col num two btn" attr-val="' + i + '" attr-color="' + color + '"> <span class="val">' + i + '</span> </div>');
        }
    }
}

function render() {
    for (var color in colors) {
        var $cols1 = jQuery("." + color + " .num .one");
        var $cols2 = jQuery("." + color + " .num .two");
        for (var i = 1; i <= 13; i++) {
            var offset = i;
            var val = globalData[color][offset];
            if (val == 0) {
                jQuery($cols1[offset]).removeClass('select-num');
                jQuery($cols2[offset]).removeClass('select-num');
            } else if (val == 1) {
                jQuery($cols1[offset]).addClass('select-num');
                jQuery($cols2[offset]).removeClass('select-num');
            } else {
                jQuery($cols1[offset]).addClass('select-num');
                jQuery($cols2[offset]).addClass('select-num');
            }
        }
    }

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
    console.log(globalData);

}

function Check() {

}