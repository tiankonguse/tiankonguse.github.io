
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
