var pymChild=new pym.Child,sheetURL="https://docs.google.com/spreadsheets/d/1YrPVj8O8ZrZaByz8wMhS56N8rL7e2hK-in_cyWlrq4I/pubhtml",rawData={},constants={presMantlePercentage:"50%",presBrookPercentage:"50%"},updatesData={},presData=[{booth:"Pre-poll",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"JFR",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Fisher",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Manning",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Cumberland",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Engineering",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"SCA",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"The Con",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Declaration",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Postal",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Total",brook:0,brookPercentage:"-",mantle:0,mantlePercentage:"-",informal:0,informalPercentage:"-",total:0}],honiData=[{name:"Time",primaryVote:500,preferenceVote:-500,finalVote:0,colorPreferences:"#ffcc33",colorPrimary:"#ffcc33"},{name:"Wet",primaryVote:600,preferenceVote:400,finalVote:1e3,colorPreferences:"#ffcc33",colorPrimary:"#99cccc"},{name:"Sin",primaryVote:700,preferenceVote:100,finalVote:800,colorPreferences:"#ffcc33",colorPrimary:"#cc99ff"},{name:"Informal",primaryVote:50,preferenceVote:0,finalVote:50,colorPreferences:"#ffcc33",colorPrimary:"#999"}],tabletopInit=function(){Tabletop.init({key:sheetURL,callback:processData,simpleSheet:!1})},processData=function(e,t){constants=e.constants.elements[0],updatesData=e.updates.elements,presData=e.pres.elements,honiData=e.honi.elements,update()},copyUpdate=function(){d3.select(".js-header-title").text(constants.title),d3.select(".js-header-standfirst").html(constants.headerStandfirst),d3.select(".js-footer-footnotes").html(constants.footnotes),d3.select(".js-pres-turnout").text(constants.presTurnout),d3.select(".js-pres-booths").text(constants.presBoothsCounted+"/"+constants.numberOfBooths),d3.select(".js-pres-standfirst").html(constants.presStandfirst),d3.select(".js-pres-footnotes").html(constants.presFootnotes),d3.select(".js-honi-turnout").text(constants.honiTurnout),d3.select(".js-honi-standfirst").html(constants.honiStandfirst),d3.select(".js-honi-footnotes").html(constants.honiFootnotes)},presWinningPercentage=48,presSummaryHeight=40,presSummaryLabelPadding=15,presSummary=d3.select(".js-pres-summary").append("svg"),presSummarySegmentOne=presSummary.append("rect"),presSummarySegmentTwo=presSummary.append("rect"),presSummaryMidline=presSummary.append("line"),presSummaryLabelOne=presSummary.append("text"),presSummaryLabelTwo=presSummary.append("text"),presSummaryInit=function(){var e=$(".js-content-results").width(),t=parseInt(constants.presMantlePercentage)/100;presSummary.attr("height",presSummaryHeight).attr("width",e),presSummarySegmentOne.attr("x",0).attr("y",0).attr("width",t*e).attr("height",presSummaryHeight).style("fill","#008938"),presSummarySegmentTwo.attr("x",t*e).attr("y",0).attr("width",t*e).attr("height",presSummaryHeight).style("fill","#753da6"),presSummaryMidline.attr("x1",e/2).attr("y1",0).attr("x2",e/2).attr("y2",presSummaryHeight).attr("stroke-width",2).attr("stroke","black"),presSummaryLabelOne.attr("x",presSummaryLabelPadding).attr("y",presSummaryHeight/4).attr("dy",presSummaryHeight/2).classed("pres__summary-segment-label",!0).text(constants.presMantlePercentage),presSummaryLabelTwo.attr("x",e-presSummaryLabelPadding).attr("y",presSummaryHeight/4).attr("dy",presSummaryHeight/2).attr("text-anchor","end").classed("pres__summary-segment-label",!0).text(constants.presBrookPercentage)},presSummaryUpdate=function(){var e=$(".js-content-results").width(),t=parseInt(constants.presMantlePercentage)/100;presSummary.attr("width",e),presSummarySegmentOne.transition().attr("width",e*t),presSummarySegmentTwo.transition().attr("x",e*t).attr("width",(1-t)*e),presSummaryMidline.attr("x1",e/2).attr("x2",e/2),presSummaryLabelOne.text(constants.presMantlePercentage),presSummaryLabelTwo.attr("x",e-presSummaryLabelPadding).text(constants.presBrookPercentage)},presTableUpdate=function(){var e=(d3.select(".js-pres-table").html(""),d3.select(".js-pres-table").append("table").classed("table",!0)),t=(e.append("tr").classed("table__header",!0).selectAll("td").data(["Booth","Brook","%","Mantle","%","Informal","%","Total"]).enter().append("td").text(function(e){return e}),e.selectAll("tr").data(presData).enter().append("tr").classed("table__row",!0));t.selectAll("td").data(function(e){return d3.values(e)}).enter().append("td").text(function(e){return e})},honiSummaryNumberOfTickets=4,honiSummaryRowHeight=30,honiSummaryRowSpace=4,honiSummaryTopPad=14,honiSummaryHeight=honiSummaryNumberOfTickets*honiSummaryRowHeight*2+(honiSummaryNumberOfTickets-1)*honiSummaryRowSpace+honiSummaryTopPad,honiSummaryWidth=$(".js-honi-summary").width(),honiSummary=d3.select(".js-honi-summary").append("svg"),honiSummaryMidline=honiSummary.append("line"),honiSummaryInit=function(e){var t=$(".js-content-results").width();honiSummary.attr("height",honiSummaryHeight).attr("width",t),honiSummaryTicket=honiSummary.selectAll("g").data(honiData).enter().append("g").attr("transform",function(e,t){return"translate(0,"+(honiSummaryTopPad+t*honiSummaryRowHeight*2)+")"}),honiSummaryLabels=honiSummaryTicket.append("text").text(function(e,t){return e.name+" – "+e.finalVote}).classed("honi__ticket-label",!0),honiSummaryPrimarySegment=honiSummaryTicket.append("rect").attr("height",honiSummaryRowHeight).attr("width",function(e,a){return parseInt(e.primaryPercentage)*t}).attr("fill",function(e,t){return e.colorPrimary}),honiSummaryPreferenceSegment=honiSummaryTicket.append("rect").attr("height",honiSummaryRowHeight).attr("width",function(e,t){return"100"}).attr("transform",function(e,t){return"translate(100, 0)"}).attr("fill",function(e,t){return e.colorPreferences}),honiSummaryMidline.attr("x1",t/2).attr("y1",0).attr("x2",t/2).attr("y2",honiSummaryHeight).attr("stroke-width",2).attr("stroke","black")},honiSummaryUpdate=function(){},updatesUpdate=function(){var e=d3.select(".js-updates-entries");e.html("");var t=e.selectAll("article").data(updatesData.reverse()).enter().append("article").classed("updates__entry",!0);t.append("h5").classed("updates__heading",!0).text(function(e,t){return updatesData[t].heading}),t.append("p").classed("updates__meta",!0).text(function(e,t){return updatesData[t].meta}),t.append("div").classed("updates__body",!0).html(function(e,t){return updatesData[t].body})},tabsInit=function(){$("ul.tabs li").click(function(){var e=$(this).attr("data-tab");$("ul.tabs li").removeClass("tabs__tab--current"),$(".tabs__content").removeClass("tabs__content--current"),$(this).addClass("tabs__tab--current"),$("#"+e).addClass("tabs__content--current"),pymChild.sendHeight()})};$(window).resize(function(){update()});var init=function(){tabsInit(),presSummaryInit(),presTableUpdate(),honiSummaryInit(),tabletopInit()},update=function(){presSummaryUpdate(),presTableUpdate(),honiSummaryUpdate(),updatesUpdate(),copyUpdate()};$(document).ready(function(){init()});