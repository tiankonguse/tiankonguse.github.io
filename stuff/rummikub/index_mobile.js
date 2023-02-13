

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