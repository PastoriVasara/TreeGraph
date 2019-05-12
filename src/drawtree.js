import React from 'react';
import * as d3 from "d3";
import $ from 'jquery';
import * as dagreD3 from "dagre-d3";

export default class Drawtree extends React.Component {
    constructor() {
        super();
        this.svg = null;
        this.g = null;
    }
    componentDidMount() {
        this.drawing();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.unit != prevProps.unit) {
            this.drawing();
        }
    }
    drawing() {
        var text = this.props.unit;
        var data = {
            unit: text,
            condition: this.props.condition
        };
        $.post("http://localhost/phpCall/call.php", data, function (data) {
            // Create a new directed graph

            var g = new dagreD3.graphlib.Graph().setGraph({});

            var nodes = [];
            var blacklist = [];
            console.log(data);
            // 0 = Parent ID 
            // 1 = Parent Course Short
            // 2 = Parent Course Name

            // 3 = Child ID
            // 4 = Child Course Short
            // 5 = Child Course Name

            for (var i = 0; i < data[0].length; i++) {
                var added = true;
                if (data[0][i] != data[3][i]) {
                    if (!nodes.includes(data[0][i])) {
                        nodes.push(data[0][i]);

                        g.setNode(data[0][i], {
                            label: "[" + data[1][i] + "] " + data[2][i]
                        });
                    }
                    if (!nodes.includes(data[3][i])) {

                        nodes.push(data[3][i]);
                        g.setNode(data[3][i], {
                            label: "[" + data[4][i] + "] " + data[5][i]
                        });
                    }
                }

            }
            for (var i = 0; i < data[0].length; i++) {
                if (!blacklist.includes(i) && data[3][i] != data[0][i]) {
                    g.setEdge(data[3][i], data[0][i], {
                        label: ""
                    });
                }

            }
            console.log(g);
            var svg = d3.select("svg"),
                inner = svg.select("g");

            // Set the rankdir
            g.graph().rankdir = "LR";
            g.graph().nodesep = 100;

            // Set up zoom support
            var zoom = d3.zoom()
                .on("zoom", function () {
                    inner.attr("transform", d3.event.transform);
                });
            svg.call(zoom);

            // Create the renderer
            var render = new dagreD3.render();


            // Run the renderer. This is what draws the final graph.
            render(inner, g);

            // Center the graph
            var initialScale = 1;
            svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));

        }, "json");
    }

    render() {
        return (
            <svg width="960" height="500"
                ref={(el) => { this.svg = el; }}
            >
                <g
                    ref={(el) => { this.g = el; }}
                /></svg>


        )
    };


}