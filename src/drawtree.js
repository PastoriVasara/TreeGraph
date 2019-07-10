import React from 'react';
import * as d3 from "d3";
import $ from 'jquery';
import * as dagreD3 from "dagre-d3";
import styles from  './treeStyle.css';

export default class Drawtree extends React.Component {
    constructor() {
        super();
        this.state =
            {
                givenContents: [],
                location : this
            }
        this.svg = null;
        this.g = null;
    }
    //when initialized
    componentDidMount() {
    }
    //don't draw again if the parameters are the same
    componentDidUpdate(prevProps, prevState) {

        if (JSON.stringify(this.state.givenContents) !== JSON.stringify(this.props.contents)) {
            this.drawing();
            this.setState({
                givenContents: this.props.contents
            });
        }
    }


    drawing() {

        //make the spacing even in the textboxes
        function calculateWidth(string) {
            var spaces = "";
            for (var i = 0; i < string.length / 2; i++) {
                spaces += " ";
            }
            return spaces;
        }

        var units = [];
        var courses = [];
        var specifiedCourses = [];
        for (var i = 0; i < Object.keys(this.props.contents.courses).length; i++) {
            courses.push(this.props.contents.courses[i].id);
            specifiedCourses.push(this.props.contents.courses[i]);
        }
        for (i = 0; i < Object.keys(this.props.contents.units).length; i++) {
            units.push(this.props.contents.units[i].unit);
        }
        var contents = {
            unit: units,
            course: courses
        };
        console.log(courses);
        var givenData = [];
        $.ajax({
            type: 'POST',
            url: "https://request.kallu.fi/call.php",
            //url: "http://localhost/phpCall/call.php",
            data: contents,
            success: function (contents) {
                var returnedData = contents;
                givenData = returnedData;
            },
            contentsType: 'json',
            async: false,
            error: function (x, e) {
                console.log(contents);
                console.log(Object.keys(x));
                console.log("CODE " + x.status + " Error: " + e);
            }
            
        });
                //new D3 graph
                var g = new dagreD3.graphlib.Graph().setGraph({});
                var nodes = [];
                /*
                Returned contents:
    
                 0 = Parent ID 
                 1 = Parent Course Short
                 2 = Parent Course Name
    
                 3 = Child ID
                 4 = Child Course Short
                 5 = Child Course Name
                */

                console.log(givenData);
                //Make every course into a node
                
                for (i = 0; i < givenData[0].length; i++) {                  
                        //check parent
                        if (!nodes.includes(givenData[0][i])) {
                            nodes.push(givenData[0][i]);
                            if(courses.includes(givenData[0][i]))
                            {
                                g.setNode(givenData[0][i], {
                                    label: calculateWidth(givenData[2][i]) + "[" + givenData[1][i] + "] \n" + givenData[2][i],
                                    class: 'specific',
                                    id: givenData[0][i],
                                    specifity: '1'
                                });
                            }
                            else{
                                g.setNode(givenData[0][i], {
                                    label: calculateWidth(givenData[2][i]) + "[" + givenData[1][i] + "] \n" + givenData[2][i],
                                    class: 'generic',
                                    id: givenData[0][i],
                                    specifity: '0'
                                });
                            }                           
                        }
                        //check child
                        if (!nodes.includes(givenData[3][i])) {
                            nodes.push(givenData[3][i]);
                            if (courses.includes(givenData[3][i])) {
                                g.setNode(givenData[3][i], {
                                label: calculateWidth(givenData[5][i]) + "[" + givenData[4][i] + "] \n" + givenData[5][i],
                                class: 'specific',
                                id: givenData[3][i],
                                specifity: '1'
                             });
                            }
                            else {
                                g.setNode(givenData[3][i], {
                                    label: calculateWidth(givenData[5][i]) + "[" + givenData[4][i] + "] \n" + givenData[5][i],
                                    class: 'generic',
                                    id: givenData[3][i],
                                    specifity: '0'
                                });
                            }
                            //case of specified course
                        }
                }
                
                //Connect parent nodes to child nodes with a line
                for (i = 0; i < givenData[0].length; i++) {
                    if (givenData[3][i] !== givenData[0][i]) {
                        g.setEdge(givenData[3][i], givenData[0][i], {
                            label: ""
                        });
                    }

                }
                
                //bind to svg
                var svg = d3.select("svg"),
                    inner = svg.select("g");

                //Direction and Separation of nodes
                g.graph().rankdir = "LR";
                g.graph().nodesep = 15;

                // Set up zoom support
                var zoom = d3.zoom()
                    .on("zoom", function () {
                        inner.attr("transform", d3.event.transform);
                    });
                svg.call(zoom);

                // Create the renderer
                var render = new dagreD3.render();
                

                // Run the renderer. This is what draws the final graph.
                console.time("courses");
                render(inner, g);
                console.timeEnd("courses");
                var binder = this;
                // Center the graph
                var initialScale = 0.65;
                //svg.call(zoom.transform, d3.zoomIdentity.translate(0,0).scale(initialScale));
                if(specifiedCourses.length > 0)
                {
                    var xCoordinate =g.node(specifiedCourses[specifiedCourses.length-1].id).x;
                    var yCoordinate =g.node(specifiedCourses[specifiedCourses.length-1].id).y;
                    //Johd MTTY3 = 38618
                    //LinA MTTP3 = 38622
                    //LinB MTTMA2 = 38627
                    console.log("W: " + g.graph().width + " H: " + g.graph().height);
                    var xTranslated = -xCoordinate*initialScale +(svg.attr("width")/2);
                    var yTranslated = -yCoordinate*initialScale +(svg.attr("height")/2);
                    svg.call(zoom.transform, d3.zoomIdentity.translate(xTranslated,yTranslated).scale(initialScale));

                    
                }
                //svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));
                svg.selectAll("g.node").on("click", function(id)
                { 
                    
                    var clickedNode = g.node(id);
                    
                    binder.updateValues(clickedNode.id);
                });
                svg.selectAll("g.node").on("mouseover", function(id)
                {  
                    
                    this.childNodes[1].childNodes[0].className.baseVal = "zoomIn";
                    this.className.baseVal = "node hovering";
                });
                svg.selectAll("g.node").on("mouseout", function(id)
                { 
                    var clickedNode = g.node(id);
                    if(clickedNode.specifity === "1")
                    {
                        this.className.baseVal ="node specific";
                    }
                    else
                    {
                        this.className.baseVal ="node generic";
                    }
                });
    }
    updateValues = (values) =>
    {
       this.props.courseAdd(values);
    }
    render() {

        return (
            <svg width="1000" height="700"
            className={styles.treeSVG}
                ref={(el) => { this.svg = el; }}
            >
                <g
                    ref={(el) => { this.g = el; }}
                /></svg>


        )
    };


}