import React, { Component } from 'react';
import * as d3 from "d3";
import $ from 'jquery';
import * as dagreD3 from "dagre-d3";
import styles from './treeStyle.css';

export default class Drawtree extends Component {
    constructor() {
        super();
        this.state =
            {
                givenContents: [],
                location: this,
                testIterator: -1,
                orderedNodes: []
            }
        this.svg = null;
        this.g = null;
        this.drawer = null;

    }
    //moving between courses with arrowkeys
    jumpBetweenCourses = event => {
        if (this.svg != null && this.state.orderedNodes != null && (event.keyCode === 37 || event.keyCode === 39)) {

            //prevent the screen from scrolling
            event.preventDefault();

            //jump to the closest node
            var currentNode = this.state.testIterator + (event.keyCode === 39 ? 1 : -1);
            if (currentNode >= 0 && currentNode < this.state.orderedNodes.length) {
                var scaleLevel = 0.75;
                var g = this.drawer;
                var xCoordinate = g.node(this.state.orderedNodes[currentNode].name).x;
                var yCoordinate = g.node(this.state.orderedNodes[currentNode].name).y;
                var svg = d3.select("svg"),
                    inner = svg.select("g");

                var zoom = d3.zoom()
                    .on("zoom", function () {
                        inner.attr("transform", d3.event.transform);
                    });
                var xTranslated = -xCoordinate * scaleLevel + (svg.attr("width") / 2);
                var yTranslated = -yCoordinate * scaleLevel + (svg.attr("height") / 2);
                //animate the travel from one node to another
                svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(xTranslated, yTranslated).scale(scaleLevel));
                this.setState({
                    testIterator: currentNode
                });
            }
        }
    };
    //when initialized
    componentDidMount() {
        document.addEventListener('keydown', this.jumpBetweenCourses);
        this.drawer = new dagreD3.graphlib.Graph().setGraph({});
    }
    //don't draw again if the parameters are the same
    componentDidUpdate(prevProps, prevState) {

        //if the property has changed redraw the canvas
        if (JSON.stringify(this.state.givenContents) !== JSON.stringify(this.props.contents)) {
            //draw the canvas again
            this.drawer = new dagreD3.graphlib.Graph().setGraph({});
            this.drawing();
            this.setState({
                givenContents: this.props.contents
            });
        }
    }

    //Drawing the canvas with tree structure
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

        //call the SQL databse via jquery and the async must be disabled for waiting the results of the call.
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
                //error logging if the query was unsuccesful
                console.log(contents);
                console.log(Object.keys(x));
                console.log("CODE " + x.status + " Error: " + e);
            }

        });
        //new D3 graph
        var g = this.drawer;

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


        //Make every course into a node
        for (i = 0; i < givenData[0].length; i++) {

            //check parent
            if (!nodes.includes(givenData[0][i])) {
                nodes.push(givenData[0][i]);
                if (courses.includes(givenData[0][i])) {
                    g.setNode(givenData[0][i], {
                        label: calculateWidth(givenData[2][i]) + "[" + givenData[1][i] + "] \n" + givenData[2][i],
                        class: 'specific',
                        id: givenData[0][i],
                        specifity: '1'
                    });
                }
                else {
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

        //specify what is the binder for nodes
        var binder = this;


        var initialScale = 0.65;
        //zoom in to the latest selected course
        if (specifiedCourses.length > 0) {
            var xCoordinate = g.node(specifiedCourses[specifiedCourses.length - 1].id).x;
            var yCoordinate = g.node(specifiedCourses[specifiedCourses.length - 1].id).y;

            var xTranslated = -xCoordinate * initialScale + (svg.attr("width") / 2);
            var yTranslated = -yCoordinate * initialScale + (svg.attr("height") / 2);
            svg.call(zoom.transform, d3.zoomIdentity.translate(xTranslated, yTranslated).scale(initialScale));


        }
        //if no course is selected focus in the middle of the screen
        else {
            initialScale = 0.3;
            svg.call(zoom.transform, d3.zoomIdentity.translate(0, (svg.attr("height") - g.graph().height * initialScale) / 2).scale(initialScale));
        }
        //if node is clicked add the clicked node to the selected courses list
        svg.selectAll("g.node").on("click", function (id) {
            var clickedNode = g.node(id);

            //the specified binder calls the parent method
            binder.updateValues(clickedNode.id);
        });
        //when mouse is hovering over a course highlight it
        svg.selectAll("g.node").on("mouseover", function (id) {
            this.childNodes[1].childNodes[0].className.baseVal = "zoomIn";
            this.className.baseVal = "node hovering";
        });
        //when mouse leaves a course remove highlight from the course
        svg.selectAll("g.node").on("mouseout", function (id) {
            var clickedNode = g.node(id);
            if (clickedNode.specifity === "1") {
                this.className.baseVal = "node specific";
            }
            else {
                this.className.baseVal = "node generic";
            }
        });

        //order the nodes by the distance from upper left corner so navigating between them is easier
        var nodesInOrder = [];
        for (i = 0; i < g.nodes().length; i++) {
            var currentNode = g.node(g.nodes()[i]);
            nodesInOrder.push({
                name: currentNode.id,
                distance: Math.sqrt(Math.pow(currentNode.x, 2) + Math.pow(currentNode.y, 2))
            });
        }
        nodesInOrder.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
        this.setState({
            orderedNodes: nodesInOrder
        });
    }

    //add clicked course to selected course
    updateValues = (values) => {
        this.props.courseAdd(values);
    }
    render() {
        var Info = "";
        if (this.props.drawn) {
            Info = this.props.language.graph_hint;
        }
        return (
            <div>
                <svg width="1000" height="700"
                    className={styles.treeSVG}
                    ref={(el) => { this.svg = el; }}>
                    <g ref={(el) => { this.g = el; }} />
                </svg>
                <div className={styles.GraphInfo}>{Info}</div>
            </div>
        )
    };


}