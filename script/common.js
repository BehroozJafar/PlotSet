var plotset = {
    common: {
        /**
         * @param svg   svg created by d3
         * @param title title sample, {
                show: true,
                color: "#FF0000",
                text: "Header",
                fontSize: 15,
                fontWeight: "Bold",
                hAlign: "center",
                vAlign: "top",
                subtext: {
                    text: "subtitle",
                    fontSize: 10,
                    color: "#0000FF"
                }
         * 
         */
        addTitle: function addTitle(svg, title) {
            var width = svg.attr("width");
            var height = svg.attr("height");
            if (title?.show) {
                var margin = 16;
                var x = margin;
                var y = margin - 5;
                var anchor = "start";
                var baseline = "hanging"

                if (title.hAlign == "center") {
                    x = width / 2;
                    anchor = "middle";
                }
                else if (title.hAlign == "right") {
                    x = width - margin;
                    anchor = "end"
                }

                if (title.vAlign == "middle")
                    y = height / 2;
                else if (title.vAlign == "bottom") {
                    y = height - 20 - margin - (parseFloat(title.fontSize) - parseFloat(title.subtext.fontSize));
                    baseline = "baseline"
                }

                var yst = y + parseFloat(title.fontSize);
                if (title.vAlign == "bottom")
                    yst = y + parseFloat(title.subtext.fontSize);

                svg.append("text")
                    .text(title.text)
                    .attr("dominant-baseline", baseline)
                    .style("fill", title.color)
                    .style("font-size", parseFloat(title.fontSize) + "px")
                    .style("font-weight", title.fontWeight)
                    //.style("font-family", titleFont)
                    .attr('text-anchor', anchor)
                    .attr("x", x)
                    .attr("y", y)

                if (title?.subtext) {
                    svg.append("text")
                        .text(title.subtext.text)
                        .attr("dominant-baseline", baseline)
                        .style("fill", title.subtext.color)
                        .style("font-size", parseFloat(title.subtext.fontSize) + "px")
                        //.style("font-family", titleFont)
                        .attr('text-anchor', anchor)
                        .attr("x", x)
                        .attr("y", yst)
                }
            }
        },

        dateFormats: ["%y-%m-%d", "%y/%m/%d", "%Y-%m-%d", "%Y/%m/%d", "%y%m%d", "%y%m%d+%H%M", "%Y%m%d+%H%M", "%Y%m%d", "%Y-%m-%d+%H:%M"
            , "%b %e %Y", "%b %e %y", "%d-%b", "%m/%d/%y", "%m/%d/%Y", "%d/%m/%y", "%d/%m/%Y"],

        getArrayType: function getType(arr) {
            var res = null;

            dateFormats.forEach(f => {
                var parseDate = d3.timeParse(f);
                var parsedValues = arr.map(str => { parseDate(str) });

                if (parsedValues.indexOf(null) >= 0) {
                    res = { type: "time", format: f };;
                }
            })
            if (res == null) {
                var isVal = true;
                arr.forEach(d => {
                    if (isNaN(parseFloat(d)))
                        isVal = false;
                })
                if (isVal)
                    res == "value";
            }
            if (res == null) {
                res = "category";

            }
            return res;
        }

    }
}