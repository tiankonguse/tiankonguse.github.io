var Graph = function () {
    this.nodes = [];
    this.edges = [];
};
Graph.prototype = {
    addNode: function (id, content) {
        var new_node = this.nodes[id];
        if (new_node == undefined) {

            if(content){
                if(!content["id"]){
                    content["id"] = id;
                }
            }

            new_node = new Graph.Node(id, content || {
                "id": id
            });
            new_node.content["degree"] = 0;

            this.nodes[id] = new_node;
            this.nodes.push(new_node);
        }
        return new_node;
    }, addEdge: function (source, target, style) {
        var s = this.addNode(source);
        var t = this.addNode(target);
        
        s.content.degree++;
        t.content.degree++;

        var color;
        var colorbg;
        var directed;
        if (style) {
            color = style.color;
            colorbg = style.colorbg;
            directed = style.directed
        }
        var edge = {
            source: s,
            target: t,
            color: color,
            colorbg: colorbg,
            directed: directed
        };
        this.edges.push(edge);
    }
};
Graph.Node = function (id, value) {
    this.id = id;
    this.content = value;
};
Graph.Node.prototype = {};
Graph.Renderer = {};
Graph.Renderer.Raphael = function (element, graph, width, height) {
    this.width = width || 400;
    this.height = height || 400;
    var selfRef = this;
    this.r = Raphael(element, this.width, this.height);
    this.radius = 40;
    this.graph = graph;
    this.mouse_in = false;
    this.isDrag = false;
    this.dragger = function (e) {
        this.dx = e.clientX;
        this.dy = e.clientY;
        selfRef.isDrag = this;
        e.preventDefault && e.preventDefault();
    };
    document.onmousemove = function (e) {
        e = e || window.event;
        if (selfRef.isDrag) {
            var newX = e.clientX - selfRef.isDrag.dx + (selfRef.isDrag.attrs.cx == null ? (selfRef.isDrag.attrs.x + selfRef.isDrag.attrs.width / 2) : selfRef.isDrag.attrs.cx);
            var newY = e.clientY - selfRef.isDrag.dy + (selfRef.isDrag.attrs.cy == null ? (selfRef.isDrag.attrs.y + selfRef.isDrag.attrs.height / 2) : selfRef.isDrag.attrs.cy);
            var clientX = e.clientX - (newX < 20 ? newX - 20 : newX > selfRef.width - 20 ? newX - selfRef.width + 20 : 0);
            var clientY = e.clientY - (newY < 20 ? newY - 20 : newY > selfRef.height - 20 ? newY - selfRef.height + 20 : 0);
            selfRef.isDrag.translate(clientX - selfRef.isDrag.dx, clientY - selfRef.isDrag.dy);
            selfRef.isDrag.label.translate(clientX - selfRef.isDrag.dx, clientY - selfRef.isDrag.dy);
            for (var i in selfRef.graph.edges) {
                selfRef.graph.edges[i].connection.draw();
            }
            selfRef.isDrag.dx = clientX;
            selfRef.isDrag.dy = clientY;
        }
    };
    document.onmouseup = function () {
        selfRef.isDrag = false;
    };
};
Graph.Renderer.Raphael.prototype = {
    translate: function (point) {
        return [(point[0] - this.graph.layoutMinX) * this.factorX + this.radius, (point[1] - this.graph.layoutMinY) * this.factorY + this.radius];
    }, rotate: function (point, length, angle) {
        var dx = length * Math.cos(angle);
        var dy = length * Math.sin(angle);
        return [point[0] + dx, point[1] + dy];
    }, draw: function () {
        this.factorX = (width - 2 * this.radius) / (this.graph.layoutMaxX - this.graph.layoutMinX);
        this.factorY = (height - 2 * this.radius) / (this.graph.layoutMaxY - this.graph.layoutMinY);
        for (var i = 0; i < this.graph.nodes.length; i++) {
            this.drawNode(this.graph.nodes[i]);
        }
        for (var i = 0; i < this.graph.edges.length; i++) {
            this.drawEdge(this.graph.edges[i]);
        }
    }, drawNode: function (node) {
        var point = this.translate([node.layoutPosX, node.layoutPosY]);
        node.point = point;
        if (node.shape) {
            var opoint = [node.shape.attrs.cx || node.shape.attrs.x + node.shape.attrs.width / 2, node.shape.attrs.cy || node.shape.attrs.y + node.shape.attrs.height / 2 + 15];
            node.shape.translate(point[0] - opoint[0], point[1] - opoint[1]);
            node.shape.label.translate(point[0] - opoint[0], point[1] - opoint[1]);
            this.r.safari();
            return;
        }
        var shape;
        var w = 4, h = 4;
        var fillOpacity = 0;
        var strokeWidth = 1;
        var fontSize = 9;
        var colorGrid = [
            "#DCDCDC", // 0
            "#C0C0C0", // 1
            "#D8BFD8", // 2
            "#FFB6C1", // 3
            "#DA70D6", // 4
            "#FF7F50", // 5
            "#FFA500", // 6
            "#FFD700", // 7
            "#00FA9A", // 8
            "#00CED1", // 9
            "#FF00FF", // 10
        ];
        

        var color = Raphael.getColor(node.content.degree/13);

        if(node.content["fill-opacity"]){
            fillOpacity = 1;
            strokeWidth = 1;
            w += node.content.degree/2;
            h += node.content.degree/2;
        }else{
            w += node.content.degree * node.content.degree;
            h += node.content.degree * node.content.degree;
            strokeWidth += node.content.degree * 4;
            fontSize += node.content.degree * 2;
            if(node.content.degree >= colorGrid.length){
                color = colorGrid[colorGrid.length - 1];
            }else{
                color = colorGrid[node.content.degree];
            }
        }

        shape = this.r.ellipse(point[0], point[1], w, h);

        

        shape.attr({
            fill: color,
            stroke: color,
            "fill-opacity": fillOpacity,
            "stroke-width": strokeWidth
        });

        shape.mousedown(this.dragger);
        shape.node.style.cursor = "move";
        shape.label = this.r.text(point[0], point[1] + h/2 - fontSize/2, node.content.label || node.id);
        shape.label.attr({
            "font-size": fontSize
        });
        node.shape = shape;
    }, drawEdge: function (edge) {
        edge.connection && edge.connection.draw();
        if (!edge.connection)
            edge.connection = this.r.connection(edge.source.shape, edge.target.shape, {
                fg: edge.color,
                bg: edge.colorbg,
                directed: edge.directed
            });
    }
};
Graph.Layout = {};
Graph.Layout.Spring = function (graph) {
    this.graph = graph;
    this.iterations = 500;
    this.maxRepulsiveForceDistance = 6;
    this.k = 2;
    this.c = 0.01;
    this.maxVertexMovement = 0.5;
};
Graph.Layout.Spring.prototype = {
    layout: function () {
        this.layoutPrepare();
        for (var i = 0; i < this.iterations; i++) {
            this.layoutIteration();
        }
        this.layoutCalcBounds();
    }, layoutPrepare: function () {
        for (var i = 0; i < this.graph.nodes.length; i++) {
            var node = this.graph.nodes[i];
            node.layoutPosX = 0;
            node.layoutPosY = 0;
            node.layoutForceX = 0;
            node.layoutForceY = 0;
        }
    }, layoutCalcBounds: function () {
        var minx = Infinity,
            maxx = -Infinity,
            miny = Infinity,
            maxy = -Infinity;
        for (var i = 0; i < this.graph.nodes.length; i++) {
            var x = this.graph.nodes[i].layoutPosX;
            var y = this.graph.nodes[i].layoutPosY;
            if (x > maxx) maxx = x;
            if (x < minx) minx = x;
            if (y > maxy) maxy = y;
            if (y < miny) miny = y;
        }
        this.graph.layoutMinX = minx;
        this.graph.layoutMaxX = maxx;
        this.graph.layoutMinY = miny;
        this.graph.layoutMaxY = maxy;
    }, layoutIteration: function () {
        for (var i = 0; i < this.graph.nodes.length; i++) {
            var node1 = this.graph.nodes[i];
            for (var j = i + 1; j < this.graph.nodes.length; j++) {
                var node2 = this.graph.nodes[j];
                this.layoutRepulsive(node1, node2);
            }
        }
        for (var i = 0; i < this.graph.edges.length; i++) {
            var edge = this.graph.edges[i];
            this.layoutAttractive(edge);
        }
        for (var i = 0; i < this.graph.nodes.length; i++) {
            var node = this.graph.nodes[i];
            var xmove = this.c * node.layoutForceX;
            var ymove = this.c * node.layoutForceY;
            var max = this.maxVertexMovement;
            if (xmove > max) xmove = max;
            if (xmove < -max) xmove = -max;
            if (ymove > max) ymove = max;
            if (ymove < -max) ymove = -max;
            node.layoutPosX += xmove;
            node.layoutPosY += ymove;
            node.layoutForceX = 0;
            node.layoutForceY = 0;
        }
    }, layoutRepulsive: function (node1, node2) {
        var dx = node2.layoutPosX - node1.layoutPosX;
        var dy = node2.layoutPosY - node1.layoutPosY;
        var d2 = dx * dx + dy * dy;
        if (d2 < 0.01) {
            dx = 0.1 * Math.random() + 0.1;
            dy = 0.1 * Math.random() + 0.1;
            var d2 = dx * dx + dy * dy;
        }
        var d = Math.sqrt(d2);
        if (d < this.maxRepulsiveForceDistance) {
            var repulsiveForce = this.k * this.k / d;
            node2.layoutForceX += repulsiveForce * dx / d;
            node2.layoutForceY += repulsiveForce * dy / d;
            node1.layoutForceX -= repulsiveForce * dx / d;
            node1.layoutForceY -= repulsiveForce * dy / d;
        }
    }, layoutAttractive: function (edge) {
        var node1 = edge.source;
        var node2 = edge.target;
        var dx = node2.layoutPosX - node1.layoutPosX;
        var dy = node2.layoutPosY - node1.layoutPosY;
        var d2 = dx * dx + dy * dy;
        if (d2 < 0.01) {
            dx = 0.1 * Math.random() + 0.1;
            dy = 0.1 * Math.random() + 0.1;
            var d2 = dx * dx + dy * dy;
        }
        var d = Math.sqrt(d2);
        if (d > this.maxRepulsiveForceDistance) {
            d = this.maxRepulsiveForceDistance;
            d2 = d * d;
        }
        var attractiveForce = (d2 - this.k * this.k) / this.k;
        if (edge.weight == undefined || edge.weight < 1) edge.weight = 1;
        attractiveForce *= Math.log(edge.weight) * 0.5 + 1;
        node2.layoutForceX -= attractiveForce * dx / d;
        node2.layoutForceY -= attractiveForce * dy / d;
        node1.layoutForceX += attractiveForce * dx / d;
        node1.layoutForceY += attractiveForce * dy / d;
    }
};