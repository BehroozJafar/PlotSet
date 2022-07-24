/**
 * @param svg   svg created by d3
 */
function addLegend(svg, legend) {
    var x0 = 100, y0 = 100;
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
