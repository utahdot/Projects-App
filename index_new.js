
require([
  "esri/config",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Locate",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/layers/support/LabelClass",
  "esri/widgets/Search",
  "esri/widgets/FeatureTable",
  "esri/widgets/Expand",
  "esri/layers/FeatureLayer",
  "esri/Map",
  "esri/views/MapView",
  "dojo/dom-class",
  "dojo/parser",
  "dijit/layout/TabContainer",
  "dijit/layout/ContentPane",
], function (
  esriConfig,
  BasemapGallery,
  Locate,
  SimpleMarkerSymbol,
  LabelClass,
  Search,
  FeatureTable,
  Expand,
  FeatureLayer,
  Map,
  MapView,
  domClass
) {

  const epmPopUpText =
    '<b><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#ffffff;background-color:#0b5588;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">PROJECT INFORMATION </span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">PIN:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {PIN}</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Project Name:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {PIN_DESC}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Region:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {REGION_CD}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Status:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {PIN_STAT_NM}</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Program:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {PROGRAM}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Description:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {PUBLIC_DESC}</span></p><br /><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#ffffff;background-color:#0b5588;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">PROJECT CONTACTS </span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Public Contact:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {PUB_CTC_NM}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Phone: </span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">{PUB_CTC_PH}</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Email:  </span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">{PUB_CTC_EMAIL}</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">*If the contact information is blank please contact your </span><a href="https://www.udot.utah.gov/main/f?p=100:pg:0:::1:T,V:38" rel="nofollow ugc" style="text-decoration:none;"><span style="font-size:10pt;font-family:Verdana;color:#1155cc;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Region office</span></a><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> for more information.   </span></p><br /><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#ffffff;background-color:#0b5588;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">DATES </span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Start Year: </span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">{FORECAST_ST_YR}</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Start Date:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {START_DAT}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">End Date:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {EPM_PLAN_END_DATE}</span><span style="font-size:10pt;font-family:Verdana;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">*If the schedule information is blank please contact your </span><a href="https://www.udot.utah.gov/main/f?p=100:pg:0:::1:T,V:38" rel="nofollow ugc" style="text-decoration:none;"><span style="font-size:10pt;font-family:Verdana;color:#1155cc;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Region office</span></a><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> for more information. </span><span style="font-size:10pt;font-family:Verdana;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">  </span><span style="font-size:10pt;font-family:Verdana;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#ffffff;background-color:#0b5588;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">PROJECT FUNDING </span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Project Value: </span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${PROJECT_VALUE}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Federal Dollars:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> ${FED_DOLLARS}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">State Dollars:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> ${STATE_DOLLARS}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Total Expenditures:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> ${TOTAL_EXPENDITURES}</span></p><br /><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#ffffff;background-color:#0b5588;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">ADDITIONAL INFORMATION </span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Information Page:</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><a href="https://www.udot.utah.gov/projectpages/f?p=250:2007:0::NO:2007:P2007_EPM_PROJ_XREF_NO,P2007_PROJECT_TYPE_IND_FLAG:{PROJ_XREF_NO}" rel="nofollow ugc" target="_blank">Click for more information</a><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /><br />Traffic Impacts:</span><span style="font-size:10pt;font-family:Verdana;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><a href="https://udottraffic.utah.gov/construction.aspx?tab=0" rel="nofollow ugc" target="_blank">Click to launch UDOT Traffic</a><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Roadway Imagery:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> </span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><a href="https://168.178.125.102/roadview.asp?Route={ROUTE_NAME}&amp;Mile={START_ACCUM}" rel="nofollow ugc" target="_blank">Click to launch Roadview Explorer</a></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Data Download Link:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> </span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><a href="https://data-uplan.opendata.arcgis.com/datasets/epm-all-projects-as-lines" rel="nofollow ugc" target="_blank">Click to launch Open Data</a></p></b>';

    let selectorClass = document.querySelectorAll(".layerSelect");

    selectorClass.forEach((e) => {
    e.addEventListener("click", toggleLayers);
  });

  let mpCheck = document.querySelector("#mpCheck");

  // let tableCheck = document.querySelector("#tableCheck");

  // mapLayers object
  const mapLayers = {
    Planned: { point: null, line: null },
    Finished: { point: null, line: null },
    InDesign: { point: null, line: null },
    Studies: { point: null, line: null },
    Construction: { point: null, line: null },
    SubstantiallyComplete: { point: null, line: null },
    AllProjects: { point: null, line: null },
  };

  // layer definition queries
  // ??? which feature service are these using?
  const layerQueries = {
    Finished: {
      definitionExpression:
        "PIN_STAT_NM = 'Physically Complete' OR PIN_STAT_NM = 'Contract Complete' OR PIN_STAT_NM = 'Region Review' OR PIN_STAT_NM = 'Central Review' OR PIN_STAT_NM = 'Contract Closed Out' OR PIN_STAT_NM = 'Close Out' OR PIN_STAT_NM = 'Closed'",
      color: "red",
    },
    InDesign: {
      definitionExpression:
        "PROJ_TYP_NM <> 'Studies' AND ( PIN_STAT_NM = 'Active' OR PIN_STAT_NM = 'Concept Scoping' OR PIN_STAT_NM = 'Advertised' OR PIN_STAT_NM = 'Awarded' OR PIN_STAT_NM = 'Concept Active' OR PIN_STAT_NM = 'Concept Cmplt' OR PIN_STAT_NM = 'Scoping')",
      color: "yellow",
    },
    Planned: {
      definitionExpression:
        "PROJ_TYP_NM <> 'Studies' AND ( PIN_STAT_NM = 'STIP' OR PIN_STAT_NM = 'Funding' OR (PIN_STAT_NM = 'Proposed' AND REGION_PRTY <999))",
      color: "black",
    },
    Studies: {
      definitionExpression:
        "(PUBLIC_DESC LIKE '%stud%' OR PUBLIC_DESC LIKE '%STUD%' OR PUBLIC_DESC LIKE '%Stud%' OR PIN_DESC LIKE '%stud%' OR PIN_DESC LIKE '%STUD%' OR PIN_DESC LIKE '%Stud%' OR PROJ_TYP_NM = 'Studies') AND (PIN_STAT_NM <> 'Physically Complete' AND PIN_STAT_NM <> 'Contract Complete' AND PIN_STAT_NM <> 'Region Review' AND PIN_STAT_NM <> 'Central Review' AND PIN_STAT_NM <> 'Contract Closed Out' AND PIN_STAT_NM <> 'Close Out' AND PIN_STAT_NM <> 'Closed')",
      color: "blue",
    },
    Construction: {
      definitionExpression:
        "PROJ_TYP_NM <> 'Studies' AND (PIN_STAT_NM = 'Under Construction')",
      color: "green",
    },
    SubstantiallyComplete: {
      definitionExpression:
        "PROJ_TYP_NM <> 'Studies' AND (PIN_STAT_NM = 'Substantially Compl')",
      color: "orange",
    },
    AllProjects: {
      definitionExpression: "1=1",
      color: "purple",
    },
  };

  const epmPopup = {
    content: epmPopUpText,
    title: "{PIN_DESC}",
  };

  let plannedLinesView;
  const plannedLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    definitionExpression: layerQueries.Planned.definitionExpression,
    title: "Planned Projects",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-line",
        width: 2,
        color: layerQueries.Planned.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let plannedPointsView;
  const plannedPoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    definitionExpression: layerQueries.Planned.definitionExpression,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 6,
        color: layerQueries.Planned.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let finishedLinesView;
  const finishedLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    definitionExpression: layerQueries.Finished.definitionExpression,
    title: "Finished Projects",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-line",
        width: 2,
        color: layerQueries.Finished.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let finishedPointsView;
  const finishedPoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    definitionExpression: layerQueries.Finished.definitionExpression,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 6,
        color: layerQueries.Finished.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let inDesignLinesView;
  const inDesignLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    definitionExpression: layerQueries.InDesign.definitionExpression,
    title: "In Design Projects",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-line",
        width: 2,
        color: layerQueries.InDesign.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let inDesignPointsView;
  const inDesignPoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    definitionExpression: layerQueries.InDesign.definitionExpression,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 6,
        color: layerQueries.InDesign.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let studiesLinesView;
  const studiesLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    definitionExpression: layerQueries.Studies.definitionExpression,
    title: "Studies Projects",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-line",
        width: 2,
        color: layerQueries.Studies.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let studiesPointsView;
  const studiesPoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    definitionExpression: layerQueries.Studies.definitionExpression,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 6,
        color: layerQueries.Studies.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let constructionLinesView;
  const constructionLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    definitionExpression: layerQueries.Construction.definitionExpression,
    title: "Construction Projects",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-line",
        width: 2,
        color: layerQueries.Construction.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let constructionPointsView;
  const constructionPoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    definitionExpression: layerQueries.Construction.definitionExpression,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 6,
        color: layerQueries.Construction.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let SubstantiallyCompleteLinesView;
  const SubstantiallyCompleteLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    definitionExpression:
      layerQueries.SubstantiallyComplete.definitionExpression,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-line",
        width: 2,
        color: layerQueries.SubstantiallyComplete.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let SubstantiallyCompletePointsView;
  const SubstantiallyCompletePoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    definitionExpression:
      layerQueries.SubstantiallyComplete.definitionExpression,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 6,
        color: layerQueries.SubstantiallyComplete.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let AllProjectsLinesView;
  const AllProjectsLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    definitionExpression: layerQueries.AllProjects.definitionExpression,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-line",
        width: 2,
        color: layerQueries.AllProjects.color,
      },
    },
    popupTemplate: epmPopup,
  });

  let AllProjectsPointsView;
  const AllProjectsPoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    definitionExpression: layerQueries.AllProjects.definitionExpression,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 6,
        color: layerQueries.AllProjects.color,
      },
    },
    popupTemplate: epmPopup,
  });

  // these FeatureLayers get referenced in the Search widget
  const municipalBoundaries = new FeatureLayer({
    url: "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahMunicipalBoundaries/FeatureServer/0",
    title: "Municipalities",
  });

  const countyBoundaries = new FeatureLayer({
    url: "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahCountyBoundaries/FeatureServer/0",
    title: "Counties",
  });

  const USCongressDistricts2012 = new FeatureLayer({
    url: "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/USCongressDistricts2012/FeatureServer/0",
    title: " 2012 US Congress Districts",
  });

  const UtahSenateDistricts2012 = new FeatureLayer({
    url: "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahSenateDistricts2012/FeatureServer/0",
    title: "2012 Utah Senate Districts",
  });

  const UtahHouseDistricts2012 = new FeatureLayer({
    url: "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahHouseDistricts2012/FeatureServer/0",
    title: "2012 Utah House Districts",
  });
  const RegionBoundaries = new FeatureLayer({
    url: "https://maps.udot.utah.gov/arcgis/rest/services/UDOT_Regions/MapServer/1",
    title: "UDOT Region Boundaries",
  });


  // labels for the mpLayer (mile posts)
  const mpLabel = new LabelClass({
    labelExpressionInfo: { expression: "$feature.Measure" },
    symbol: {
      type: "text",
      color: "black",
      haloSize: 1,
      haloColor: "white",
      font: {
        family: "Ubuntu Mono",
        size: 9,
        weight: "bold",
      },
    },
    labelPlacement: "center-center",
  });

  const selectSymbol = new SimpleMarkerSymbol({
    color: "lime",
    outline: {
      color: [128, 128, 128, 0.5],
      width: "0.6px",
    },
  });

  // milepost FeatureLayer
  let mpView;
  const mpLayer = new FeatureLayer({
    url: "https://maps.udot.utah.gov/randh/rest/services/ALRS_DT/Mile_Point_Measure_PNT_ALRS_OPENDATA/MapServer/0",
    title: "UDOT Mileposts",
    labelingInfo: mpLabel,
    renderer: {
      type: "simple",
      symbol: selectSymbol,
    },
  });


  // set up the Map and MapView
  // use API key
  esriConfig.apiKey = "AAPKc422669b0fbe46a2b56d697c4dd3384cYslFfknNEQtB3WgUxoiEsPrfUr2viZq0XYQqCSdSjTKTldmVSiccSYqaz_2hLWPa";

  const map = new Map({
    basemap: "arcgis-topographic",
    layers: [
      plannedLines,
      plannedPoints,
      mpLayer,
      finishedLines,
      finishedPoints,
      inDesignLines,
      inDesignPoints,
      studiesLines,
      studiesPoints,
      constructionLines,
      constructionPoints,
      SubstantiallyCompleteLines,
      SubstantiallyCompletePoints,
      AllProjectsLines,
      AllProjectsPoints,
    ],
  });

  const view = new MapView({
    map: map,
    center: [-111.891, 40.7608],
    zoom: 13,
    container: "viewDiv",
    constraints: {
      snapToZoom: false
    }
  });


  view.popup.defaultPopupTemplateEnabled = true;

  // toggling the map layers
  // when the layer's checkbox is checked or unchecked, the point and line featureLayers are turned on or off

  function toggleLayers() {
    try {
      selectorClass.forEach((i) => {
        if (i.checked) {
          if (i.value == "mp") {
            mpView.visible = true;
          } else {
            mapLayers[i.value].point.visible = true;
            mapLayers[i.value].line.visible = true;
          }
        } else {
          if (i.value == "mp") {
            mpView.visible = false;
          } else {
            mapLayers[i.value].point.visible = false;
            mapLayers[i.value].line.visible = false;
          }
        }
      });
      if (mpCheck.checked) {
        mpView.visible = true;
      } else {
        mpView.visible = false;
      }
    } catch (error) {
      console.log("initializing...");
    }
  }

  // call toggleLayers() to toggle map layers
  // each "Layer" in the widget is two separate feature classes (line and point)

  // "Planned" layer
  view.whenLayerView(plannedLines).then(function (layer) {
    plannedLinesView = layer;
    mapLayers.Planned.line = plannedLinesView;
    toggleLayers();
  });
  view.whenLayerView(plannedPoints).then(function (layer) {
    plannedPointsView = layer;
    mapLayers.Planned.point = plannedPointsView;
    toggleLayers();
  });

  // "Finished" layer
  view.whenLayerView(finishedLines).then(function (layer) {
    finishedLinesView = layer;
    mapLayers.Finished.line = finishedLinesView;
    toggleLayers();
  });
  view.whenLayerView(finishedPoints).then(function (layer) {
    finishedPointsView = layer;
    mapLayers.Finished.point = finishedPointsView;
    toggleLayers();
  });

  // "In Design" layer
  view.whenLayerView(inDesignLines).then(function (layer) {
    inDesignLinesView = layer;
    mapLayers.InDesign.line = inDesignLinesView;
    toggleLayers();
  });
  view.whenLayerView(inDesignPoints).then(function (layer) {
    inDesignPointsView = layer;
    mapLayers.InDesign.point = inDesignPointsView;
    toggleLayers();
  });

  // "Studies" layer
  view.whenLayerView(studiesLines).then(function (layer) {
    studiesLinesView = layer;
    mapLayers.Studies.line = studiesLinesView;
    toggleLayers();
  });
  view.whenLayerView(studiesPoints).then(function (layer) {
    studiesPointsView = layer;
    mapLayers.Studies.point = studiesPointsView;
    toggleLayers();
  });

  // "Construction" layer
  view.whenLayerView(constructionLines).then(function (layer) {
    constructionLinesView = layer;
    mapLayers.Construction.line = constructionLinesView;
    toggleLayers();
  });
  view.whenLayerView(constructionPoints).then(function (layer) {
    constructionPointsView = layer;
    mapLayers.Construction.point = constructionPointsView;
    toggleLayers();
  });

  // "Substantially Complete" layer
  view.whenLayerView(SubstantiallyCompleteLines).then(function (layer) {
    SubstantiallyCompleteLinesView = layer;
    mapLayers.SubstantiallyComplete.line = SubstantiallyCompleteLinesView;
    toggleLayers();
  });
  view.whenLayerView(SubstantiallyCompletePoints).then(function (layer) {
    SubstantiallyCompletePointsView = layer;
    mapLayers.SubstantiallyComplete.point = SubstantiallyCompletePointsView;
    toggleLayers();
  });

  // "All Projects" layer
  view.whenLayerView(AllProjectsLines).then(function (layer) {
    AllProjectsLinesView = layer;
    mapLayers.AllProjects.line = AllProjectsLinesView;
    toggleLayers();
  });
  view.whenLayerView(AllProjectsPoints).then(function (layer) {
    AllProjectsPointsView = layer;
    mapLayers.AllProjects.point = AllProjectsPointsView;
    toggleLayers();
  });

  // "Mile Posts" layer
  view.whenLayerView(mpLayer).then(function (layer) {
    mpView = layer;
    toggleLayers();
  });


  // Event handler for toggling the table view
  tableCheck.addEventListener("click", toggleTable);

  function toggleTable() {
    domClass.toggle("tabs", "dijitHidden");
  }


  // widgets

  const searchWidget = new Search({
    view: view,
    allPlaceholder: "Search Project or Location",
    sources: [
      {
        layer: AllProjectsLines,
        searchFields: ["PIN", "PIN_DESC"],
        suggestionTemplate: "{PIN}: {PIN_DESC}",
        displayField: "PIN",
        exactMatch: false,
        name: "UDOT Projects",
        placeholder: "example: 16716",
      },
      {
        layer: municipalBoundaries,
        searchFields: ["NAME", "SHORTDESC"],
        displayField: "NAME",
        exactMatch: false,
        name: "Municipal Boundaries",
        placeholder: "example: Salt Lake City",
      },
      {
        layer: countyBoundaries,
        searchFields: ["NAME"],
        displayField: "NAME",
        exactMatch: false,
        name: "County Boundaries",
        placeholder: "example: Salt Lake County",
      },
      {
        layer: USCongressDistricts2012,
        searchFields: ["DISTRICT"],
        displayField: "DISTRICT",
        exactMatch: false,
        name: "Congressional Districts",
        placeholder: "example: 2",
      },
      {
        layer: UtahSenateDistricts2012,
        searchFields: ["DIST"],
        displayField: "DIST",
        exactMatch: false,
        name: "Utah Senate Districts",
        placeholder: "example: 27",
      },
      {
        layer: UtahHouseDistricts2012,
        searchFields: ["DIST"],
        displayField: "DIST",
        exactMatch: false,
        name: "Utah House Districts",
        placeholder: "example: 61",
      },
      {
        layer: RegionBoundaries,
        searchFields: ["NAME"],
        displayField: "NAME",
        exactMatch: false,
        name: "UDOT Region Boundaries",
        placeholder: "example: Region 3",
      },
    ],
  });


  // widget definitions

  // "Find my location" widget
  const locateWidget = new Locate({
    view: view,
  });

  // Basemap gallery
  const basemapGallery = new BasemapGallery({
    view: view,
  });

  // Expand widget. Opens/Hides the basemapGallery
  const basemapExpand = new Expand({
    view: view,
    expanded: false,
    expandIconClass: "esri-icon-collection",
    content: basemapGallery,
    group: "top-left",
  });

  // Expand widget
  // expands the Layer List div: "#layerQuery"
  const listExpand = new Expand({
    view: view,
    expanded: true,
    label: "Layer List",
    expandIconClass: "esri-icon-legend",
    content: document.getElementById("layerQuery"),
    group: "top-left",
  });

  // add widgets to map view window
  view.ui.add([searchWidget, tableCheck], "top-right");
  view.ui.add([listExpand, locateWidget, basemapExpand], "top-left");


  // ??? this seems to just write to the console?
  searchWidget.on("select-result", function (event) {
    console.log("The selected search result: ", event.source);
  });

  // feature tables

  const plannedTable = new FeatureTable({
    layer: plannedLines,
    view: view,
    container: document.getElementById("plannedTable"),
  });

  const finishedTable = new FeatureTable({
    layer: finishedLines,
    view: view,
    container: document.getElementById("finishedTable"),
  });

  const inDesignTable = new FeatureTable({
    layer: inDesignLines,
    view: view,
    container: document.getElementById("inDesignTable"),
  });

  const studiesTable = new FeatureTable({
    layer: studiesLines,
    view: view,
    container: document.getElementById("studiesTable"),
  });

  const constructionTable = new FeatureTable({
    layer: constructionLines,
    view: view,
    container: document.getElementById("constructionTable"),
  });

  const substantiallyCompleteTable = new FeatureTable({
    layer: SubstantiallyCompleteLines,
    view: view,
    container: document.getElementById("substantiallyCompleteTable"),
  });

  const allProjectsTable = new FeatureTable({
    layer: AllProjectsLines,
    view: view,
    container: document.getElementById("allProjectsTable"),
  });
});
