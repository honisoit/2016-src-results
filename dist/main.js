var pymChild=new pym.Child,sheetURL="https://docs.google.com/spreadsheets/d/1YrPVj8O8ZrZaByz8wMhS56N8rL7e2hK-in_cyWlrq4I/pubhtml",rawData={},constants={presMantlePercentage:"50%",presBrookPercentage:"50%"},updatesData={},presData=[{booth:"Pre-poll",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"JFR",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Fisher",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Manning",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Cumberland",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Engineering",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"SCA",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"The Con",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Declaration",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Postal",brook:null,brookPercentage:"-",mantle:null,mantlePercentage:"-",informal:null,informalPercentage:"-",total:0},{booth:"Total",brook:0,brookPercentage:"-",mantle:0,mantlePercentage:"-",informal:0,informalPercentage:"-",total:0}],honiData=[{name:"Time",primaryVote:500,preferenceVote:-500,finalVote:0,colorPreferences:"#ffcc33",colorPrimary:"#ffcc33"},{name:"Wet",primaryVote:600,preferenceVote:400,finalVote:1e3,colorPreferences:"#ffcc33",colorPrimary:"#99cccc"},{name:"Sin",primaryVote:700,preferenceVote:100,finalVote:800,colorPreferences:"#ffcc33",colorPrimary:"#cc99ff"},{name:"Informal",primaryVote:50,preferenceVote:0,finalVote:50,colorPreferences:"#ffcc33",colorPrimary:"#999"}],councilData={},councilElected=[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],tabletopInit=function(){Tabletop.init({key:sheetURL,callback:processData,simpleSheet:!1})},processData=function(t,e){constants=t.constants.elements[0],updatesData=t.updates.elements,updatesData=updatesData.reverse(),presData=t.pres.elements,honiPrimaryData=t.honiprimary.elements,honiPreferenceData=t.honipreferences.elements,honiTotalsData=t.honitotals.elements,councilData=t.council.elements,councilElected=councilData.filter(function(t){return"1"===t.elected}),councilTableData=councilData.slice().map(function(t){var e={};return e.name=t.name,e.ticket=t.ticket,e.faction=t.faction,e.primaryVote=t.primaryVote,e.currentVote=t.currentVote,e}),nusData=t.nus.elements,nusElected=nusData.filter(function(t){return"1"===t.elected}),nusTableData=nusData.slice().map(function(t){var e={};return e.name=t.name,e.ticket=t.ticket,e.faction=t.faction,e.primaryVote=t.primaryVote,e.currentVote=t.currentVote,e}),update()},copyUpdate=function(){d3.select(".js-header-title").text(constants.title),d3.select(".js-header-standfirst").html(constants.headerStandfirst),d3.select(".js-footer-footnotes").html(constants.footnotes),d3.select(".js-pres-turnout").text(constants.presTurnout),d3.select(".js-pres-booths").text(constants.presBoothsCounted+"/"+constants.numberOfBooths),d3.select(".js-pres-standfirst").html(constants.presStandfirst),d3.select(".js-pres-footnotes").html(constants.presFootnotes),d3.select(".js-honi-turnout").text(constants.honiTurnout),d3.select(".js-honi-booths").text(constants.honiBoothsCounted+"/"+constants.numberOfBooths),d3.select(".js-honi-standfirst").html(constants.honiStandfirst),d3.select(".js-honi-footnotes").html(constants.honiFootnotes),d3.select(".js-honi-primary-analysis").html(constants.honiPrimaryAnalysis),d3.select(".js-honi-preference-analysis").html(constants.honiPreferenceAnalysis),d3.select(".js-council-standfirst").html(constants.councilStandfirst),d3.select(".js-council-footnotes").html(constants.councilFootnotes),d3.select(".js-council-quota").text(constants.councilQuota),d3.select(".js-council-turnout").text(constants.councilTurnout),d3.select(".js-nus-standfirst").html(constants.nusStandfirst),d3.select(".js-nus-footnotes").html(constants.nusFootnotes),d3.select(".js-nus-quota").text(constants.nusQuota),d3.select(".js-nus-turnout").text(constants.nusTurnout)},presWinningPercentage=48,presSummaryHeight=40,presSummaryLabelPadding=15,presSummary=d3.select(".js-pres-summary").append("svg"),presSummarySegmentOne=presSummary.append("rect"),presSummarySegmentTwo=presSummary.append("rect"),presSummaryMidline=presSummary.append("line"),presSummaryLabelOne=presSummary.append("text"),presSummaryLabelTwo=presSummary.append("text"),presSummaryInit=function(){var t=$(".js-content-results").width(),e=parseInt(constants.presMantlePercentage)/100;presSummary.attr("height",presSummaryHeight).attr("width",t),presSummarySegmentOne.attr("x",0).attr("y",0).attr("width",e*t).attr("height",presSummaryHeight).style("fill","#008938"),presSummarySegmentTwo.attr("x",e*t).attr("y",0).attr("width",e*t).attr("height",presSummaryHeight).style("fill","#753da6"),presSummaryMidline.attr("x1",t/2).attr("y1",0).attr("x2",t/2).attr("y2",presSummaryHeight).attr("stroke-width",2).attr("stroke","black"),presSummaryLabelOne.attr("x",presSummaryLabelPadding).attr("y",presSummaryHeight/4).attr("dy",presSummaryHeight/2).classed("pres__summary-segment-label",!0).text(constants.presMantlePercentage),presSummaryLabelTwo.attr("x",t-presSummaryLabelPadding).attr("y",presSummaryHeight/4).attr("dy",presSummaryHeight/2).attr("text-anchor","end").classed("pres__summary-segment-label",!0).text(constants.presBrookPercentage)},presSummaryUpdate=function(){var t=$(".js-content-results").width(),e=parseInt(constants.presMantlePercentage)/100;presSummary.attr("width",t),presSummarySegmentOne.transition().attr("width",t*e),presSummarySegmentTwo.transition().attr("x",t*e).attr("width",(1-e)*t),presSummaryMidline.attr("x1",t/2).attr("x2",t/2),presSummaryLabelOne.text(constants.presMantlePercentage),presSummaryLabelTwo.attr("x",t-presSummaryLabelPadding).text(constants.presBrookPercentage)},presTableUpdate=function(){var t=(d3.select(".js-pres-table").html(""),d3.select(".js-pres-table").append("table").classed("table",!0)),e=(t.append("tr").classed("table__header",!0).selectAll("td").data(["Booth","Brook","%","Mantle","%","Informal","%","Total"]).enter().append("td").text(function(t){return t}),t.selectAll("tr").data(presData).enter().append("tr").classed("table__row",!0));e.selectAll("td").data(function(t){return d3.values(t)}).enter().append("td").text(function(t){return t})},honiSummaryNumberOfTickets=4,honiSummaryRowHeight=30,honiSummaryRowSpace=4,honiSummaryTopPad=14,honiSummaryHeight=honiSummaryNumberOfTickets*honiSummaryRowHeight*2+(honiSummaryNumberOfTickets-1)*honiSummaryRowSpace+honiSummaryTopPad,honiSummaryWidth=$(".js-honi-summary").width(),honiPrimary=d3.select(".js-honi-primary").append("svg"),honiPrimaryMidline=honiPrimary.append("line"),honiPrimaryHeight=7.6*honiSummaryRowHeight,honiPrimaryInit=function(){var t=$(".js-content-results").width();honiPrimary.attr("height",honiPrimaryHeight).attr("width",t);var e=honiPrimary.selectAll("g").data([{name:"TIME",percentage:"38.43%",multiplier:.3843,hex:"#fbd75d"},{name:"WET",percentage:"32.73%",multiplier:.3273,hex:"#6dcff6"},{name:"SIN",percentage:"27.00%",multiplier:.27,hex:"#bd8cbf"},{name:"Informal",percentage:"3.28%",multiplier:.0328,hex:"#b3b3aa"}]).enter().append("g").attr("transform",function(t,e){return"translate(0,"+(honiSummaryTopPad+e*honiSummaryRowHeight*2)+")"});e.append("text").text(function(t,e){return t.name+" – "+t.percentage}).classed("honi__ticket-label",!0),e.append("rect").attr("height",honiSummaryRowHeight).attr("width",function(e,n){return e.multiplier*t}).attr("transform",function(){return"translate(0,"+honiSummaryRowSpace+")"}).attr("fill",function(t,e){return t.hex});honiPrimaryMidline.attr("x1",t/2).attr("y1",0).attr("x2",t/2).attr("y2",honiSummaryHeight).attr("stroke-width",2).attr("stroke","black")},honiPreferences=d3.select(".js-honi-preferences").append("svg"),honiPreferencesInit=function(){var t=$(".js-content-results").width();honiPreferences.attr("height",4*honiSummaryRowHeight).attr("width",t);var e=honiPreferences.selectAll("g").data([{name:"WET",percentage:"53.97%",multiplier:.5397,hex:"#6dcff6"},{name:"TIME",percentage:"46.03%",multiplier:.4603,hex:"#fbd75d"}]).enter().append("g").attr("transform",function(t,e){return"translate(0,"+(honiSummaryTopPad+e*honiSummaryRowHeight*2)+")"});e.append("text").text(function(t,e){return t.name+" – "+t.percentage}).classed("honi__ticket-label",!0),e.append("rect").attr("height",honiSummaryRowHeight).attr("width",function(e,n){return e.multiplier*t}).attr("transform",function(){return"translate(0,"+honiSummaryRowSpace+")"}).attr("fill",function(t,e){return t.hex}),honiPreferences.append("line").attr("x1",t/2).attr("y1",0).attr("x2",t/2).attr("y2",honiSummaryHeight).attr("stroke-width",2).attr("stroke","black")},honiPrimaryTableUpdate=function(){var t=(d3.select(".js-honi-primary-table").html(""),d3.select(".js-honi-primary-table").append("table").classed("table",!0)),e=(t.append("tr").classed("table__header",!0).selectAll("td").data(["Booth","TIME","%","WET","%","SIN","%","Informal","%","Total"]).enter().append("td").text(function(t){return t}),t.selectAll("tr").data(honiPrimaryData).enter().append("tr").classed("table__row",!0));e.selectAll("td").data(function(t){return d3.values(t)}).enter().append("td").text(function(t){return t})},honiPreferenceTableUpdate=function(){var t=(d3.select(".js-honi-preferences-table").html(""),d3.select(".js-honi-preferences-table").append("table").classed("table",!0)),e=(t.append("tr").classed("table__header",!0).selectAll("td").data(["Booth","TIME","%","WET","%","Exhausted","%","Total"]).enter().append("td").text(function(t){return t}),t.selectAll("tr").data(honiPreferenceData).enter().append("tr").classed("table__row",!0));e.selectAll("td").data(function(t){return d3.values(t)}).enter().append("td").text(function(t){return t})},honiTotalsTableUpdate=function(){var t=(d3.select(".js-honi-totals-table").html(""),d3.select(".js-honi-totals-table").append("table").classed("table",!0)),e=(t.append("tr").classed("table__header",!0).selectAll("td").data(["Booth","TIME","%","WET","%","Total"]).enter().append("td").text(function(t){return t}),t.selectAll("tr").data(honiTotalsData).enter().append("tr").classed("table__row",!0));e.selectAll("td").data(function(t){return d3.values(t)}).enter().append("td").text(function(t){return t})},councilSummary=d3.select(".js-council-summary").append("svg"),councilPadding=6,councilRows=3,councilColumns=11,councilSummaryInit=function(){var t=$(".js-content-results").width(),e=(t-12*councilPadding)/11,n=councilRows*e+5*councilPadding;councilSummary.attr("width",t).attr("height",n);councilSummary.append("g").selectAll("circle").data([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]).enter().append("circle").attr("cx",e/2).attr("cy",e/2).attr("r",e/2).attr("transform",function(t,n){var a=Math.ceil((n+1)/councilRows),r=(a-1)*(e+councilPadding)+councilPadding,o=n%3,l=o*(councilPadding+e)+councilPadding;return"translate("+r+","+l+")"}).attr("stroke-width",1.5).attr("stroke","black").attr("fill","none")},councilSummaryUpdate=function(){var t=$(".js-content-results").width(),e=(t-12*councilPadding)/11,n=councilRows*e+5*councilPadding;councilSummary.attr("width",t).attr("height",n).html("");councilSummary.append("g").selectAll("circle").data(councilElected).enter().append("circle").attr("cx",e/2).attr("cy",e/2).attr("r",e/2).attr("transform",function(t,n){var a=Math.ceil((n+1)/councilRows),r=(a-1)*(e+councilPadding)+councilPadding,o=n%3,l=o*(councilPadding+e)+councilPadding;return"translate("+r+","+l+")"}).attr("fill",function(t){return constants[t.shortFaction]}).on("click",function(t,e){d3.select(".js-council-profile-name").text(t.name),d3.select(".js-council-profile-meta").text(t.ticket+" • "+t.faction),d3.select(".js-council-profile-votes").text("Elected with "+t.currentVote+" votes.")}),councilSummary.append("g").selectAll("circle").data([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]).enter().append("circle").attr("cx",e/2).attr("cy",e/2).attr("r",e/2).attr("transform",function(t,n){var a=Math.ceil((n+1)/councilRows),r=(a-1)*(e+councilPadding)+councilPadding,o=n%3,l=o*(councilPadding+e)+councilPadding;return"translate("+r+","+l+")"}).attr("stroke-width",1.5).attr("stroke","black").attr("fill","none")},councilSortedDescending=!1,councilTableUpdate=function t(e){var n=(d3.select(".js-council-table").html(""),d3.select(".js-council-table").append("table").classed("table",!0)),a=(n.append("thead").classed("table__header",!0).selectAll("td").data(["name","ticket","faction","primaryVote","currentVote"]).enter().append("th").text(function(t){return t}).on("click",function(e){sortedCouncilData=councilTableData.sort(function(t,n){var a=["name","ticket","faction"];if(a.indexOf(e)!=-1){var r=t[e].toLowerCase(),o=n[e].toLowerCase();return councilSortedDescending===!0?r<o?-1:r>o?1:0:r>o?-1:r<o?1:0}return councilSortedDescending===!0?n[e]-t[e]:t[e]-n[e]}),councilSortedDescending=councilSortedDescending!==!0,t(sortedCouncilData)}),n.selectAll("tr").data(e).enter().append("tr").classed("table__row",!0));a.selectAll("td").data(function(t){return d3.values(t)}).enter().append("td").text(function(t){return t})},nusSummary=d3.select(".js-nus-summary").append("svg"),nusPadding=6,nusRows=1,nusColumns=7,nusSummaryInit=function(){var t=$(".js-content-results").width(),e=(t-8*nusPadding)/7,n=nusRows*e+2*nusPadding;nusSummary.attr("width",t).attr("height",n);nusSummary.append("g").selectAll("circle").data([1,1,1,1,1,1,1]).enter().append("circle").attr("cx",e/2).attr("cy",e/2).attr("r",e/2).attr("transform",function(t,n){var a=n+1,r=(a-1)*(e+nusPadding)+nusPadding,o=nusPadding;return"translate("+r+","+o+")"}).attr("stroke-width",1.5).attr("stroke","black").attr("fill","none")},nusSummaryUpdate=function(){var t=$(".js-content-results").width(),e=(t-8*nusPadding)/7,n=nusRows*e+2*nusPadding;nusSummary.attr("width",t).attr("height",n).html("");nusSummary.append("g").selectAll("circle").data(nusElected).enter().append("circle").attr("cx",e/2).attr("cy",e/2).attr("r",e/2).attr("transform",function(t,n){var a=n+1,r=(a-1)*(e+nusPadding)+nusPadding,o=nusPadding;return"translate("+r+","+o+")"}).attr("fill",function(t){return constants[t.shortFaction]}).on("click",function(t,e){d3.select(".js-nus-profile-name").text(t.name),d3.select(".js-nus-profile-meta").text(t.ticket+" • "+t.faction),d3.select(".js-nus-profile-votes").text("Elected with "+t.currentVote+" votes.")}),nusSummary.append("g").selectAll("circle").data([1,1,1,1,1,1,1]).enter().append("circle").attr("cx",e/2).attr("cy",e/2).attr("r",e/2).attr("transform",function(t,n){var a=n+1,r=(a-1)*(e+nusPadding)+nusPadding,o=nusPadding;return"translate("+r+","+o+")"}).attr("stroke-width",1.5).attr("stroke","black").attr("fill","none")},nusSortedDescending=!1,nusTableUpdate=function t(e){var n=(d3.select(".js-nus-table").html(""),d3.select(".js-nus-table").append("table").classed("table",!0)),a=(n.append("thead").classed("table__header",!0).selectAll("td").data(["name","ticket","faction","primaryVote","currentVote"]).enter().append("th").text(function(t){return t}).on("click",function(e){sortednusData=nusTableData.sort(function(t,n){var a=["name","ticket","faction"];if(a.indexOf(e)!=-1){var r=t[e].toLowerCase(),o=n[e].toLowerCase();return nusSortedDescending===!0?r<o?-1:r>o?1:0:r>o?-1:r<o?1:0}return nusSortedDescending===!0?n[e]-t[e]:t[e]-n[e]}),nusSortedDescending=nusSortedDescending!==!0,t(sortednusData)}),n.selectAll("tr").data(e).enter().append("tr").classed("table__row",!0));a.selectAll("td").data(function(t){return d3.values(t)}).enter().append("td").text(function(t){return t})},updatesUpdate=function(){var t=d3.select(".js-updates-entries");t.html("");var e=t.selectAll("article").data(updatesData).enter().append("article").classed("updates__entry",!0);e.append("h5").classed("updates__heading",!0).text(function(t,e){return updatesData[e].heading}),e.append("p").classed("updates__meta",!0).text(function(t,e){return updatesData[e].meta}),e.append("div").classed("updates__body",!0).html(function(t,e){return updatesData[e].body})},tabsInit=function(){$("ul.tabs li").click(function(){var t=$(this).attr("data-tab");$("ul.tabs li").removeClass("tabs__tab--current"),$(".tabs__content").removeClass("tabs__content--current"),$(this).addClass("tabs__tab--current"),$("#"+t).addClass("tabs__content--current"),pymChild.sendHeight()})};$(window).resize(function(){update()});var init=function(){tabsInit(),presSummaryInit(),presTableUpdate(),honiPrimaryInit(),honiPreferencesInit(),councilSummaryInit(),nusSummaryInit(),tabletopInit(),pymChild.sendHeight()},update=function(){presSummaryUpdate(),presTableUpdate(),honiPrimaryTableUpdate(),honiPreferenceTableUpdate(),honiTotalsTableUpdate(),councilTableUpdate(councilTableData),councilSummaryUpdate(),nusTableUpdate(nusTableData),nusSummaryUpdate(),updatesUpdate(),copyUpdate(),pymChild.sendHeight()};$(document).ready(function(){init()});