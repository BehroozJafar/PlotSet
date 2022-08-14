const Header=(config)=>{
    const {align,
        titleText,
        titleColor,
        titleSize,
        subtitleText,
        subtitleColor,
        subtitleSize,
        text,
        textColor,
        textSize,
        borderColor,
        borderShow,
        borderWeight,
        borderType,
        borderGap,
        borderDash
    }=config?.header;


    function textAnchor(align) {
        if (align === "0%") {
          return "start";
        }
        if (align === "50%") {
          return "middle";
        } else {
          return "end";
        }
      };

       // title
  let svg = d3.select("svg").attr("width",width).attr("height","350")
  let svgTitle = (svg.select("#title").size()===0)?svg.append("text"):svg.select("#title")
  svgTitle
    .attr("x", `${align}`)
    .attr("text-anchor", textAnchor(`${align}`))
    .attr("y", "65")
    .text(`${titleText}`)
    .attr("fill", `${titleColor}`)
    .attr("font-size", `${titleSize}`)
    const heightTitle=svgTitle.node().getBBox().height
    svgTitle
   .attr("y", heightTitle)
  
  
  //  subtitle
  let svgSubtitle =(svg.select("#subtitle").size()===0)?svg.append("text"):svg.select("#subtitle") 
  svgSubtitle
    .text(`${subtitleText}`)
    .attr("x", `${align}`)
    .attr("text-anchor", textAnchor(`${align}`))
    .attr("y", 65+heightTitle)
    .attr("fill", `${subtitleColor}`)
    .attr("font-size", `${subtitleSize}`)
    const heightSubtitle=svgSubtitle.node().getBBox().height
    

  //text
  let svgText = (svg.select("#text").size()===0)?svg.append("text"):svg.select("#text") 
  svgText 
    .text(`${text}`)
    .attr("x", `${align}`)
    .attr("text-anchor", textAnchor(`${align}`))
    .attr("y", 65+heightTitle+heightSubtitle)
    .attr("fill", `${textColor}`)
    .attr("font-size", `${textSize}`)
    const heightText=svgText.node().getBBox().height
    


    //line
    let borderLine =(svg.select("#line").size()===0)?svg.append("line"):svg.select("#line")
    borderLine
    .style("stroke",`${borderColor}`)
    .style("stroke-width",`${borderShow ? borderWeight : 0 }`)
    .style("stroke-dasharray",`${borderType?`${borderDash},${borderGap}`:""}`)
    .attr("x1",0)
    .attr("y1",heightText+heightSubtitle+heightTitle+60)
    .attr("x2",width)
    .attr("y2",heightText+heightSubtitle+heightTitle+60)
    const maxHeightSelect=heightText+heightSubtitle+heightTitle+60;



    return maxHeightSelect;
};