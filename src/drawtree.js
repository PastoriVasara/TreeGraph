import React from 'react';
import * as d3 from "d3";
import $ from 'jquery';
import * as dagreD3 from "dagre-d3";

export default class Drawtree extends React.Component {
    constructor() {
        super();
        this.state =
      {
          givenContents: []
      }
        this.svg = null;
        this.g = null;
    }
    //when initialized
    componentDidMount() {
    }
    //don't draw again if the parameters are the same

    componentDidUpdate(prevProps, prevState) {

        if(JSON.stringify(this.state.givenContents) !== JSON.stringify(this.props.contents)){
            console.log("erit");
            this.drawing();
            this.setState({
                givenContents: this.props.contents
            });
        }
    }
    

    drawing() {
        function calculateWidth(string)
        {
           var spaces = "";
           for(var i = 0; i < string.length/2; i++)
           {
            spaces += " ";
           } 
           return spaces;
        }
        var text = this.props.contents.units[0].unit;
        var courses = this.props.contents.courses;
        console.log(courses);
        var contents = {
            unit: text,
            condition: this.props.contents.units[0].condition
        };
        $.ajax({
            type: 'POST',
            url: "https://request.kallu.fi/index.php",
            data: contents,
            success: function (contents) {
            //new D3 graph
            console.log(contents);
            var g = new dagreD3.graphlib.Graph().setGraph({});

            var nodes = [];
            var blacklist = [];
            /*
            Returned contents:

             0 = Parent ID 
             1 = Parent Course Short
             2 = Parent Course Name

             3 = Child ID
             4 = Child Course Short
             5 = Child Course Name
            */
            

            //Make every course into a node
            for (var i = 0; i < contents[0].length; i++) {
                if (contents[0][i] != contents[3][i]) {
                    if (!nodes.includes(contents[0][i])) {
                        nodes.push(contents[0][i]);

                        g.setNode(contents[0][i], {
                            label:  calculateWidth(contents[2][i]) + "[" + contents[1][i] + "] \n"  +  contents[2][i]
                        });
                    }
                    if (!nodes.includes(contents[3][i])) {

                        nodes.push(contents[3][i]);
                        g.setNode(contents[3][i], {
                            label: calculateWidth(contents[5][i]) + "[" + contents[4][i] + "] \n" + contents[5][i]
                        });
                    }
                }

            }
            //Connect parent nodes to child nodes with a line
            for (var i = 0; i < contents[0].length; i++) {
                if (!blacklist.includes(i) && contents[3][i] != contents[0][i]) {
                    g.setEdge(contents[3][i], contents[0][i], {
                        label: ""
                    });
                }

            }
            //bind to svg
            var svg = d3.select("svg"),
                inner = svg.select("g");

            //Direction and Separation of nodes
            g.graph().rankdir = "LR";
            g.graph().nodesep = 25;

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
            console.log("???");


        }, 
        contentsType: 'json',
        async: false
      });
        
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