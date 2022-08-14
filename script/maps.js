var plotset = {
    map: {
        tooltip: function tooltip(svg, elements) {

            var outerDiv = d3.select("body.tooltip");
            var div = d3.select(".tooltip-inner");
            var innerDiv = d3.select(".tooltip-border-color");
            var pointerTri = d3.select(".tooltip-pointer");

            if (outerDiv.size() == 0) {
                outerDiv = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("pointer-events", "none")
                    .style("width", "323px")
                    .style("height", "57px")
                    .style("opacity", 0);
                innerDiv = outerDiv.append("div")
                    .attr("class", "tooltip-border-color")
                    .style("float", "left")
                    .style("pointer-events", "none")
                    .style("width", "6px")
                    .style("height", "57px")
                    .style("background", "#AEACFF")
                    .style("border-radius", "4px 0px 0px 4px")
                    .style("opacity", 1);
                div = outerDiv.append("div")
                    .attr("class", "tooltip-inner")
                    .style("float", "left")
                    .style("box-shadow", "0px 0px 8px rgba(0, 0, 0, 0.2)")
                    .style("border-radius", "4px")
                    .style("width", "293px")
                    .style("height", "57px")
                    .style("background", "#FFFFFF")
                    .style("opacity", 1);
                pointerTri = outerDiv.append("div")
                    .style("position", "absolute")
                    .style("width", "0px")
                    .style("height", "0px")
                    .attr("class", "tooltip-pointer")
            }

            function setPosition(event) {
                var cw = svg.node().clientWidth;
                var ch = svg.node().clientHeight;

                var rx = 0;
                var ry = 0;

                pointerTri.style("border-right", "10px solid transparent")
                    .style("border-left", "10px solid transparent")
                    .style("border-bottom", "10px solid transparent")
                    .style("border-top", "10px solid transparent")

                if (event.pageX < (cw / 3)) {
                    ry = -29;
                    rx = 15;
                    pointerTri.style("border-right", "10px solid #AEACFF")
                        .style("left", "-20px")
                        .style("top", "20px");
                }
                else if (event.pageX > (2 * cw / 3)) {
                    rx = -310;
                    ry = -29;
                    pointerTri.style("border-left", "10px solid #FFF")
                        .style("left", "295px")
                        .style("top", "20px");
                }
                else if (event.pageY < (ch / 3)) {
                    rx = -158;
                    ry =25;
                    pointerTri
                        .style("left", "150px")
                        .style("top", "-20px")
                        .style("border-bottom", "10px solid #FFF")
                }
                else {
                    ry = -65;
                    rx = -158;
                    pointerTri
                        .style("left", "150px")
                        .style("top", "55px")
                        .style("border-top", "10px solid #FFF")
                }
                return { rx, ry };
            }

            elements.each(function (d, i) {
                d3.select(this)
                    .on("mouseover", function (event, d) {

                        var p = setPosition(event)
                        outerDiv.transition()
                            .duration(1)
                            .style("opacity", 0.9)
                            .style("left", (event.pageX + p.rx) + "px")
                            .style("top", (event.pageY + p.ry) + "px");

                        div.html('<span class="tooltiptext" >' + d.properties.NAME_2 + " </span>");

                    })
                    .on("mousemove", function (event, d) {
                        var p = setPosition(event)

                        outerDiv
                            .style("left", (event.pageX + p.rx) + "px")
                            .style("top", (event.pageY + p.ry) + "px")
                            .style("opacity", 0.9);

                    })
                    .on("mouseout", function (d) {
                        outerDiv.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            });
        }
    }
};

function regions(svg, geoJson, d, className) {
    var projection = d3.geoAlbersUsa()
        .scale([1000]);

    var path = d3.geoPath()
        .projection(projection);

    var sc = d3.scaleLinear()
        .domain([0, 1])
        .range(["#fff", "#88f"]);

    svg.selectAll("path." + className)
        .data(geoJson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", className)
        .style("stroke", d)
        .style('pointer-events', (className == "cc") ? 'default' : 'none')
        .style("stroke-width", "1")
        .style("fill", function (d) {
            if (className == "cc") {
                return sc(Math.random())
            }
            return "#FFF0";
        });
}

/**
 * @param svg   svg created by d3
 */
function addLegend(svg, legend) {
    var x0 = 500, y0 = 500;
    const rectWidth = 30;
    const rectHeight = 7;

    var scale = d3.scaleLinear()
        .range([legend.minimumValue, legend.maximumValue])
        .domain([0, 1]);

    if (legend.type == "binned") {
        if (legend.binningMode == "fixed") {
            for (let i = 0; i <= legend.numberOfBins; i++) {

                if (i < legend.numberOfBins)
                    svg.append("rect")
                        .attr("x", x0 + i * rectWidth)
                        .attr("y", y0)
                        .attr("width", rectWidth)
                        .attr("height", rectHeight)
                        .style("fill", getColor(legend.colors, (i + 0.5) / (legend.numberOfBins)));

                svg.append("line")
                    .attr("x1", x0 + i * rectWidth)
                    .attr("y1", y0)
                    .attr("x2", x0 + i * rectWidth)
                    .attr("y2", y0 + rectHeight * 2)
                    .attr("stroke-width", 0.3)
                    .attr("stroke", "#000");

                var label = svg.append("text")
                    .text(formatNumber(scale(i / (legend.numberOfBins)), 0, 1000, "K"))
                    .attr("x", x0 + i * rectWidth)
                    .attr("y", y0 + 15 + rectHeight * 2)
                    .attr("font-size", 12)
                    .attr("text-anchor", "middle");

                if (checkTextForOverlap(svg.selectAll("text"), label)) {
                    label.remove();
                }

            }

        }
    }
}

function checkTextForOverlap(set, newText) {
    var results = false;
    var newBox = newText.node().getBBox();
    var newBoxXRadius = newBox.width / 2;
    var newBoxXCenter = newBox.x + newBoxXRadius;
    var newBoxYRadius = newBox.height / 2;
    var newBoxYCenter = newBox.y + newBoxYRadius;

    set.each(function (d) {
        let box1 = this.getBBox();
        let box1XRadius = box1.width / 2;
        let box1XCenter = box1.x + box1XRadius;
        let box1YRadius = box1.height / 2;
        let box1YCenter = box1.y + box1YRadius;

        if (this != newText.node()) {
            if ((Math.abs(box1XCenter - newBoxXCenter) <= (box1XRadius + newBoxXRadius))
                && (Math.abs(box1YCenter - newBoxYCenter) <= (box1YRadius + newBoxYRadius)))
                results = true;
        }

    })

    return results;
}

function getColor(colors, value0to1) {
    values = colors.map((d, i) => i / (colors.length - 1));
    return d3.scaleLinear()
        .domain(values)
        .range(colors)(value0to1);
}

function formatNumber(number, decimalPlaces, division, suffix = "") {
    if (isNaN(number))
        return number;
    return (number / division).toLocaleString(undefined,
        { maximumFractionDigits: decimalPlaces, minimumFractionDigits: decimalPlaces })
        + suffix;
}
