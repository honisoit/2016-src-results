// Straight up get pym.js working
var pymChild = new pym.Child();

/**
 * Grab the data from our Google Sheet and clean it up a little
 */
var sheetURL = 'https://docs.google.com/spreadsheets/d/1YrPVj8O8ZrZaByz8wMhS56N8rL7e2hK-in_cyWlrq4I/pubhtml';

var rawData = {};
var constants = {presMantlePercentage: "50%", presBrookPercentage: "50%"};
var updatesData = {};
var presData = [{"booth":"Pre-poll","brook":null,"brookPercentage":"-","mantle":null,"mantlePercentage":"-","informal":null,"informalPercentage":"-","total":0},
{"booth":"JFR","brook":null,"brookPercentage":"-","mantle":null,"mantlePercentage":"-","informal":null,"informalPercentage":"-","total":0},
{"booth":"Fisher","brook":null,"brookPercentage":"-","mantle":null,"mantlePercentage":"-","informal":null,"informalPercentage":"-","total":0},
{"booth":"Manning","brook":null,"brookPercentage":"-","mantle":null,"mantlePercentage":"-","informal":null,"informalPercentage":"-","total":0},
{"booth":"Cumberland","brook":null,"brookPercentage":"-","mantle":null,"mantlePercentage":"-","informal":null,"informalPercentage":"-","total":0},
{"booth":"Engineering","brook":null,"brookPercentage":"-","mantle":null,"mantlePercentage":"-","informal":null,"informalPercentage":"-","total":0},
{"booth":"SCA","brook":null,"brookPercentage":"-","mantle":null,"mantlePercentage":"-","informal":null,"informalPercentage":"-","total":0},
{"booth":"The Con","brook":null,"brookPercentage":"-","mantle":null,"mantlePercentage":"-","informal":null,"informalPercentage":"-","total":0},
{"booth":"Declaration","brook":null,"brookPercentage":"-","mantle":null,"mantlePercentage":"-","informal":null,"informalPercentage":"-","total":0},
{"booth":"Postal","brook":null,"brookPercentage":"-","mantle":null,"mantlePercentage":"-","informal":null,"informalPercentage":"-","total":0},
{"booth":"Total","brook":0,"brookPercentage":"-","mantle":0,"mantlePercentage":"-","informal":0,"informalPercentage":"-","total":0}];
var honiData = [{"name":"Time","primaryVote":500,"preferenceVote":-500,"finalVote":0,"colorPreferences":"#ffcc33","colorPrimary":"#ffcc33"},
{"name":"Wet","primaryVote":600,"preferenceVote":400,"finalVote":1000,"colorPreferences":"#ffcc33","colorPrimary":"#99cccc"},
{"name":"Sin","primaryVote":700,"preferenceVote":100,"finalVote":800,"colorPreferences":"#ffcc33","colorPrimary":"#cc99ff"},
{"name":"Informal","primaryVote":50,"preferenceVote":0,"finalVote":50,"colorPreferences":"#ffcc33","colorPrimary":"#999"}];
var councilData = {};
var councilElected = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];
var councilSeats = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];

var tabletopInit = function tabletopInit() {
  Tabletop.init({
    key: sheetURL,
    callback: processData,
    simpleSheet: false,
  })
};

var processData = function processData(data, tabletop) {
  constants = data.constants.elements['0'];
  updatesData = data.updates.elements;
  updatesData = updatesData.reverse();
  presData = data.pres.elements;
  honiPrimaryData = data.honiprimary.elements;
  honiPreferenceData = data.honipreferences.elements;
  honiTotalsData = data.honitotals.elements;
  councilData = data.council.elements;
  councilElected = councilData.filter(function(candidate) {
    if (candidate.elected === '1') {
      return true;
    } else {
      return false;
    };
  });

  update();
};

/**
 * Copy
 */
var copyUpdate = function copyUpdate() {
  // General
  d3.select('.js-header-title').text(constants.title);
  d3.select('.js-header-standfirst').html(constants.headerStandfirst);
  d3.select('.js-footer-footnotes').html(constants.footnotes);

  // Pres
  d3.select('.js-pres-turnout').text(constants.presTurnout);
  d3.select('.js-pres-booths').text(constants.presBoothsCounted + '/' + constants.numberOfBooths);
  d3.select('.js-pres-standfirst').html(constants.presStandfirst);
  d3.select('.js-pres-footnotes').html(constants.presFootnotes);

  // Honi
  d3.select('.js-honi-turnout').text(constants.honiTurnout);
  d3.select('.js-honi-booths').text(constants.honiBoothsCounted + '/' + constants.numberOfBooths);
  d3.select('.js-honi-standfirst').html(constants.honiStandfirst);
  d3.select('.js-honi-footnotes').html(constants.honiFootnotes);
  d3.select('.js-honi-primary-analysis').html(constants.honiPrimaryAnalysis);
  d3.select('.js-honi-preference-analysis').html(constants.honiPreferenceAnalysis);

  // Council
  d3.select('.js-council-standfirst').html(constants.councilStandfirst);
  d3.select('.js-council-footnotes').html(constants.councilFootnotes);
  d3.select('.js-council-quota').text(constants.councilQuota);
  d3.select('.js-council-turnout').text(constants.councilTurnout);

  // NUS
  d3.select('.js-nus-standfirst').html(constants.nusStandfirst);
  d3.select('.js-nus-footnotes').html(constants.nusFootnotes);
  d3.select('.js-nus-quota').text(constants.nusQuota);
  d3.select('.js-nus-turnout').text(constants.nusTurnout);
};

/**
 * President Summary
 */

var presWinningPercentage = 48;
var presSummaryHeight = 40;
// How far from the edge of the graphic should the bar label appear
var presSummaryLabelPadding = 15;

// Elements of the summary graphic
var presSummary = d3.select('.js-pres-summary').append('svg');
var presSummarySegmentOne = presSummary.append('rect');
var presSummarySegmentTwo = presSummary.append('rect');
var presSummaryMidline = presSummary.append('line');
var presSummaryLabelOne = presSummary.append('text');
var presSummaryLabelTwo = presSummary.append('text');


// Initiate the pres summary
var presSummaryInit = function presSummaryInit() {
  var presSummaryWidth = $('.js-content-results').width();
  var presMantleMultiplier = parseInt(constants.presMantlePercentage) / 100;
  presSummary
    .attr('height', presSummaryHeight)
    .attr('width', presSummaryWidth);

  presSummarySegmentOne
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', presMantleMultiplier * presSummaryWidth)
    .attr('height', presSummaryHeight)
    .style('fill', '#008938');

  presSummarySegmentTwo
    .attr('x', presMantleMultiplier * presSummaryWidth)
    .attr('y', 0)
    .attr('width', presMantleMultiplier * presSummaryWidth)
    .attr('height', presSummaryHeight)
    .style('fill', '#753da6');

  presSummaryMidline
    .attr('x1', presSummaryWidth/2)
    .attr('y1', 0)
    .attr('x2', presSummaryWidth/2)
    .attr('y2', presSummaryHeight)
    .attr('stroke-width', 2)
    .attr('stroke', 'black');

  presSummaryLabelOne
    .attr('x', presSummaryLabelPadding)
    .attr('y', presSummaryHeight/4)
    .attr('dy', presSummaryHeight/2)
    .classed('pres__summary-segment-label', true)
    .text(constants.presMantlePercentage);

  presSummaryLabelTwo
    .attr('x', presSummaryWidth - presSummaryLabelPadding)
    .attr('y', presSummaryHeight/4)
    .attr('dy', presSummaryHeight/2)
    .attr('text-anchor', 'end')
    .classed('pres__summary-segment-label', true)
    .text(constants.presBrookPercentage);
};

// Update the pres summary with data
var presSummaryUpdate = function presSummaryUpdate() {
  var presSummaryWidth = $('.js-content-results').width();
  var presMantleMultiplier = parseInt(constants.presMantlePercentage) / 100;

  presSummary
    .attr('width', presSummaryWidth);

  presSummarySegmentOne
    .transition()
    .attr('width', presSummaryWidth * presMantleMultiplier);

  presSummarySegmentTwo
    .transition()
    .attr('x', presSummaryWidth * presMantleMultiplier)
    .attr('width', (1 - presMantleMultiplier) * presSummaryWidth);

  presSummaryMidline
    .attr('x1', presSummaryWidth/2)
    .attr('x2', presSummaryWidth/2);

  presSummaryLabelOne
    .text(constants.presMantlePercentage);

  presSummaryLabelTwo
    .attr('x', presSummaryWidth - presSummaryLabelPadding)
    .text(constants.presBrookPercentage);
};

/**
 * President tables
 */
var presTableUpdate = function presTableUpdate() {
  var wipeTableContents = d3.select('.js-pres-table').html('');

  var table = d3.select('.js-pres-table').append('table').classed('table', true);

  var tableHeader = table.append('tr').classed('table__header', true)
    .selectAll('td')
    .data(["Booth", "Brook", "%", "Mantle", "%", "Informal", "%", "Total"]).enter()
    .append('td')
    .text(function(d) {
      return d;
    });

  var tableRows = table.selectAll('tr')
    .data(presData).enter()
    .append('tr')
    .classed('table__row', true);

  var tableCells = tableRows.selectAll('td')
    .data(function(d) {
      return d3.values(d);
    }).enter()
    .append('td')
    .text(function(d) { return d; });

};

/**
 * Honi Summary setup
 */
var honiSummaryNumberOfTickets = 4;
var honiSummaryRowHeight = 30;
var honiSummaryRowSpace = 4;
var honiSummaryTopPad = 14;
var honiSummaryHeight = (honiSummaryNumberOfTickets * honiSummaryRowHeight * 2) + ((honiSummaryNumberOfTickets - 1) * honiSummaryRowSpace) + honiSummaryTopPad;
var honiSummaryWidth = $('.js-honi-summary').width();

/**
 * Honi Primary Summary
 */
var honiPrimary = d3.select('.js-honi-primary').append('svg');
var honiPrimaryMidline = honiPrimary.append('line');
var honiPrimaryHeight = honiSummaryRowHeight * 7.6;

var honiPrimaryInit = function honiPrimaryInit() {
    var honiSummaryWidth = $('.js-content-results').width();

    honiPrimary
      .attr('height', honiPrimaryHeight)
      .attr('width', honiSummaryWidth);

    var honiPrimaryBlock = honiPrimary.selectAll('g')
      .data([{
        name: "TIME",
        percentage: "38.43%",
        multiplier: 0.3843,
        hex: "#fbd75d"
      },{
        name: "WET",
        percentage: "32.73%",
        multiplier: 0.3273,
        hex: "#6dcff6"
      },{
        name: "SIN",
        percentage: "27.00%",
        multiplier: 0.27,
        hex: "#bd8cbf"
      },{
        name: "Informal",
        percentage: "3.28%",
        multiplier: 0.0328,
        hex: "#b3b3aa"
      }])
      .enter().append('g')
      .attr('transform', function(d, i) {
        return 'translate(0,' + ( honiSummaryTopPad + (i) * honiSummaryRowHeight * 2) + ')';
      });

    var honiBlockLabels = honiPrimaryBlock
      .append('text')
      .text(function(d, i) {
        return d.name + ' – ' + d.percentage;
      })
      .classed('honi__ticket-label', true);

    var honiBlockSegment = honiPrimaryBlock
      .append('rect')
      .attr('height', honiSummaryRowHeight)
      .attr('width', function(d,i) {
        return d.multiplier * honiSummaryWidth;
      })
      .attr('transform', function() { return 'translate(0,' + honiSummaryRowSpace + ')'; })
      .attr('fill', function(d,i) {
        return d.hex;
      });

    honiPrimaryMidline
      .attr('x1', honiSummaryWidth/2)
      .attr('y1', 0)
      .attr('x2', honiSummaryWidth/2)
      .attr('y2', honiSummaryHeight)
      .attr('stroke-width', 2)
      .attr('stroke', 'black');
};

/**
 * Honi Preference Summary
 */

var honiPreferences = d3.select('.js-honi-preferences').append('svg');

var honiPreferencesInit = function honiPreferencesInit() {
   var honiSummaryWidth = $('.js-content-results').width();

   honiPreferences
     .attr('height', honiSummaryRowHeight * 4)
     .attr('width', honiSummaryWidth);

   var honiPreferencesBlock = honiPreferences.selectAll('g')
     .data([{
       name: "WET",
       percentage: "53.97%",
       multiplier: 0.5397,
       hex: "#6dcff6"
     },{
       name: "TIME",
       percentage: "46.03%",
       multiplier: 0.4603,
       hex: "#fbd75d"
     }])
     .enter().append('g')
     .attr('transform', function(d, i) {
       return 'translate(0,' + ( honiSummaryTopPad + (i) * honiSummaryRowHeight * 2) + ')';
     });

   var honiBlockLabels = honiPreferencesBlock
     .append('text')
     .text(function(d, i) {
       return d.name + ' – ' + d.percentage;
     })
     .classed('honi__ticket-label', true);

   var honiBlockSegment = honiPreferencesBlock
     .append('rect')
     .attr('height', honiSummaryRowHeight)
     .attr('width', function(d,i) { return d.multiplier * honiSummaryWidth; })
     .attr('transform', function() { return 'translate(0,' + honiSummaryRowSpace + ')'; })
     .attr('fill', function(d,i) { return d.hex; });

   var honiPreferencesMidline = honiPreferences.append('line')
     .attr('x1', honiSummaryWidth/2)
     .attr('y1', 0)
     .attr('x2', honiSummaryWidth/2)
     .attr('y2', honiSummaryHeight)
     .attr('stroke-width', 2)
     .attr('stroke', 'black');
};

/**
 * Honi Primary table update
 */
var honiPrimaryTableUpdate = function honiPrimaryTableUpdate() {
 var wipeTableContents = d3.select('.js-honi-primary-table').html('');

 var table = d3.select('.js-honi-primary-table').append('table').classed('table', true);

 var tableHeader = table.append('tr').classed('table__header', true)
   .selectAll('td')
   .data(["Booth", "TIME", "%", "WET", "%", "SIN", "%", "Informal", "%", "Total"]).enter()
   .append('td')
   .text(function(d) {
     return d;
   });

 var tableRows = table.selectAll('tr')
   .data(honiPrimaryData).enter()
   .append('tr')
   .classed('table__row', true);

 var tableCells = tableRows.selectAll('td')
   .data(function(d) {
     return d3.values(d);
   }).enter()
   .append('td')
   .text(function(d) { return d; });
};

/**
 * Honi Preference table update
 */
var honiPreferenceTableUpdate = function honiPreferenceTableUpdate() {
 var wipeTableContents = d3.select('.js-honi-preferences-table').html('');

 var table = d3.select('.js-honi-preferences-table').append('table').classed('table', true);

 var tableHeader = table.append('tr').classed('table__header', true)
   .selectAll('td')
   .data(["Booth", "TIME", "%", "WET", "%", "Exhausted", "%", "Total"]).enter()
   .append('td')
   .text(function(d) {
     return d;
   });

 var tableRows = table.selectAll('tr')
   .data(honiPreferenceData).enter()
   .append('tr')
   .classed('table__row', true);

 var tableCells = tableRows.selectAll('td')
   .data(function(d) {
     return d3.values(d);
   }).enter()
   .append('td')
   .text(function(d) { return d; });

};

/**
 * Honi Totals table update
 */
var honiTotalsTableUpdate = function honiTotalsTableUpdate() {
 var wipeTableContents = d3.select('.js-honi-totals-table').html('');

 var table = d3.select('.js-honi-totals-table').append('table').classed('table', true);

 var tableHeader = table.append('tr').classed('table__header', true)
   .selectAll('td')
   .data(["Booth", "TIME", "%", "WET", "%", "Total"]).enter()
   .append('td')
   .text(function(d) {
     return d;
   });

 var tableRows = table.selectAll('tr')
   .data(honiTotalsData).enter()
   .append('tr')
   .classed('table__row', true);

 var tableCells = tableRows.selectAll('td')
   .data(function(d) {
     return d3.values(d);
   }).enter()
   .append('td')
   .text(function(d) { return d; });

};

/**
 * Council summary
 */
var councilSummary = d3.select('.js-council-summary').append('svg');
var councilPadding = 6;
var councilRows = 3;
var councilColumns = 11;

var councilSummaryInit = function councilSummaryInit() {
  var councilWidth = $('.js-content-results').width();
  var councilSeatDiameter = (councilWidth - (12 * councilPadding)) / 11;
  var councilHeight = (councilRows * councilSeatDiameter) + (5 * councilPadding);

  councilSummary
    .attr('width', councilWidth)
    .attr('height', councilHeight);

  var councilSeats = councilSummary.append('g')
    .selectAll('circle')
    .data([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
  .enter()
    .append('circle')
    .attr('cx', councilSeatDiameter/2)
    .attr('cy', councilSeatDiameter/2)
    .attr('r', councilSeatDiameter/2)
    .attr('transform', function(d, i) {
      var xPosition = Math.ceil((i+1) / councilRows);
      var xOffset = ((xPosition - 1) * (councilSeatDiameter + councilPadding)) + councilPadding;
      var yPosition = (i) % 3;
      var yOffset = (yPosition * (councilPadding + councilSeatDiameter)) + councilPadding;
      return 'translate(' + xOffset + ',' + yOffset + ')';
    })
    .attr('stroke-width', 1.5)
    .attr('stroke', 'black')
    .attr('fill', 'none');
};

var councilSummaryUpdate = function councilSummaryUpdate() {
  var councilWidth = $('.js-content-results').width();
  var councilSeatDiameter = (councilWidth - (12 * councilPadding)) / 11;
  var councilHeight = (councilRows * councilSeatDiameter) + (5 * councilPadding);

  councilSummary
    .attr('width', councilWidth)
    .attr('height', councilHeight)
    .html('');



  var councilCandidates = councilSummary.append('g')
    .selectAll('circle')
  .data(councilElected).enter()
    .append('circle')
    .attr('cx', councilSeatDiameter/2)
    .attr('cy', councilSeatDiameter/2)
    .attr('r', councilSeatDiameter/2)
    .attr('transform', function(d, i) {
      var xPosition = Math.ceil((i+1) / councilRows);
      var xOffset = ((xPosition - 1) * (councilSeatDiameter + councilPadding)) + councilPadding;
      var yPosition = (i) % 3;
      var yOffset = (yPosition * (councilPadding + councilSeatDiameter)) + councilPadding;
      return 'translate(' + xOffset + ',' + yOffset + ')';
    })
    .attr('fill', function(d) {
      return constants[d.shortFaction];
    })
    .on('click', function(d, i) {
      d3.select('.js-council-profile-name').text(d.name);
      d3.select('.js-council-profile-meta').text(d.ticket + ' • ' + d.faction);
      d3.select('.js-council-profile-votes').text('Elected with ' + d.currentVote + ' votes.');
    });

  var councilSeats = councilSummary.append('g')
    .selectAll('circle')
    .data([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
  .enter()
    .append('circle')
    .attr('cx', councilSeatDiameter/2)
    .attr('cy', councilSeatDiameter/2)
    .attr('r', councilSeatDiameter/2)
    .attr('transform', function(d, i) {
      var xPosition = Math.ceil((i+1) / councilRows);
      var xOffset = ((xPosition - 1) * (councilSeatDiameter + councilPadding)) + councilPadding;
      var yPosition = (i) % 3;
      var yOffset = (yPosition * (councilPadding + councilSeatDiameter)) + councilPadding;
      return 'translate(' + xOffset + ',' + yOffset + ')';
    })
    .attr('stroke-width', 1.5)
    .attr('stroke', 'black')
    .attr('fill', 'none');
};

/**
 * Council table update
 */

var councilSortedDescending = false;

var councilTableUpdate = function councilTableUpdate(data) {
  var wipeTableContents = d3.select('.js-council-table').html('');

  var table = d3.select('.js-council-table').append('table').classed('table', true);

  var tableHeader = table.append('thead').classed('table__header', true)
   .selectAll('td')
   .data(["Position", "name", "ticket", "faction", "primaryVote", "currentVote"]).enter()
   .append('th')
   .text(function(d) {
     return d;
   })
   .on('click', function(d) {
     console.log(d);
     sortedCouncilData = councilData.sort(function(a, b){
        var stringHeaders = ["name", "ticket", "faction"];
        if (stringHeaders.indexOf(d) != -1) {
          // Sort with the alphabet
          var nameA=a[d].toLowerCase(), nameB=b[d].toLowerCase();
          if (councilSortedDescending === true) {
            //sort string ascending
            if (nameA < nameB) {
              return -1;
            } if (nameA > nameB) {
              return 1;
            } else {
              return 0;
            };
          } else {
            //sort string descending
            if (nameA > nameB) {
              return -1;
            } if (nameA < nameB) {
              return 1;
            } else {
              return 0;
            };
          };
        } else {
          // Sort as numbers
          if (councilSortedDescending === true) {
            //sort numbers ascending
            return b[d] - a[d];
          } else {
            //sort numbers descending
            return a[d] - b[d];
          };
        };
     });
     if (councilSortedDescending === true) {
       councilSortedDescending = false;
     } else {
       councilSortedDescending = true;
     };
     councilTableUpdate(sortedCouncilData);
   });

  var tableRows = table.selectAll('tr')
   .data(data).enter()
   .append('tr')
   .classed('table__row', true);

  var tableCells = tableRows.selectAll('td')
    .data(function(d) {
      return d3.values(d);
    }).enter()
    .append('td')
    .text(function(d) { return d; });
};

/**
 * updates (the blog feature)
 */
var updatesUpdate = function updateUpdates() {
  var entries = d3.select('.js-updates-entries');

  // Remove the existing content of the blogs
  entries.html('');

  var entry = entries.selectAll('article')
    .data(updatesData)
    .enter()
    .append('article')
    .classed('updates__entry', true);

  var entryHeading = entry.append('h5')
    .classed('updates__heading', true)
    .text(function(d, i) { return updatesData[i].heading; });

  var entryMeta = entry.append('p')
    .classed('updates__meta', true)
    .text(function(d, i) { return updatesData[i].meta; });

  var entryBody = entry.append('div')
    .classed('updates__body', true)
    .html(function(d, i) { return updatesData[i].body; });
};

/**
 * Set up the tabs
 */
var tabsInit = function tabsInit() {
  $('ul.tabs li').click(function(){
    var tab_id = $(this).attr('data-tab');

    $('ul.tabs li').removeClass('tabs__tab--current');
    $('.tabs__content').removeClass('tabs__content--current');

    $(this).addClass('tabs__tab--current');
    $('#'+tab_id).addClass('tabs__content--current');

    // Update the height of the parent iframme
    pymChild.sendHeight()
  })
};

/**
 * Set up some listeners
 */

// Update everything on the window resizing
$(window).resize(function() {
  update();
});

/**
 * Initialise everything
 */
var init = function init() {
  tabsInit();
  presSummaryInit();
  presTableUpdate();
  honiPrimaryInit();
  honiPreferencesInit();
  councilSummaryInit();
  tabletopInit();
  pymChild.sendHeight()
};

/**
 * Update all of the things
 */
var update = function update() {
  // president
  presSummaryUpdate();
  presTableUpdate();

  // honi

  honiPrimaryTableUpdate();
  honiPreferenceTableUpdate();
  honiTotalsTableUpdate();

  // council
  councilTableUpdate(councilData);
  councilSummaryUpdate();

  // general
  updatesUpdate();
  copyUpdate();
  pymChild.sendHeight()
};

$(document).ready(function(){
  init();
});
