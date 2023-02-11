const colors = { "red": "红", "blue": "蓝", "pink": "粉", "black": "黑" };
function Init(globalData) {

    for (var color in colors) {
        globalData[color] = [];
        globalData[color].push(0);

        var row = jQuery('.' + color)
        row.append('<div class="col num select-num"> <span class="val"> ' + colors[color] + '</span> </div>');
        for (var i = 1; i <= 13; i++) {
            globalData[color].push(0);
            row.append('<div class="col num"> <span class="val">' + i + '</span> </div>');
            row.append('<div class="col num"> <span class="val">' + i + '</span> </div>');
        }
    }
}

function render(globalData) {
    for (var color in colors) {
        var $cols = jQuery("." + color + " .num");
        for (var i = 1; i <= 26; i += 2) {
            var offset = parseInt((i + 1) / 2);
            var val = globalData[color][offset];
            if (val == 0) {
                jQuery($cols[i]).removeClass('select-num');
                jQuery($cols[i + 1]).removeClass('select-num');
            } else if (val == 1) {
                jQuery($cols[i]).addClass('select-num');
                jQuery($cols[i + 1]).removeClass('select-num');
            } else {
                jQuery($cols[i]).addClass('select-num');
                jQuery($cols[i + 1]).addClass('select-num');
            }
        }
    }

}

function ClickAdd(globalData) {
    var color = jQuery("#selec-control-color").val();
    var num = parseInt(jQuery("#selec-control-num").val());

    if (globalData[color][num] == 2) {
        alert("增加错误：" + color + " " + num + "已经有两个了")
        return;
    }
    globalData[color][num]++;
    render(globalData);
}

function ClickDel(globalData) {
    var color = jQuery("#selec-control-color").val();
    var num = parseInt(jQuery("#selec-control-num").val());

    if (globalData[color][num] == 0) {
        alert("删除错误：" + color + " " + num + "为空")
        return;
    }
    globalData[color][num]--;
    render(globalData);
}

function Check(globalData) {
    
}