<!doctype html>

<html lang="en">

<head>


    <meta charset="utf-8">

    <title>The HTML5 Herald</title>
    <meta name="description" content="The HTML5 Herald">
    <meta name="author" content="SitePoint">

    <script src="node_modules/d3/build/d3.min.js" charset="utf-8"></script>
    <script src="node_modules/dagre/dist/dagre.min.js" charset="utf-8"></script>
    <script src="node_modules/dagre-d3/dist/dagre-d3.min.js" charset="utf-8"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>


    <style>
    body {
        font: 300 14px 'Helvetica Neue', Helvetica;
    }

    .node rect {
        stroke: #333;
        fill: #fff;
    }

    .edgePath path {
        stroke: #333;
        fill: #333;
        stroke-width: 1.5px;
    }

    svg {
        border: 1px solid #ccc;
        overflow: hidden;
        margin: 0 auto;
    }
    </style>
</head>

<body>
    <svg width=960 height=600>
        <g /></svg>
    Tiedekunta: <input type="text" id="fname">
    <button onclick="weAreReady()">Hae!</button>
    <div id="test"></div>
    <script type="text/javascript">
    var ready = false;
    </script>
    <script type="text/javascript">
    
    </script>
</body>

</html>