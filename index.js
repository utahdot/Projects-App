/**
 * TODO:
 * Zoomer
 * popups
 * Inset Map Location
 */

require([
  "esri/PopupTemplate",
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
], function (
  PopupTemplate,
  BasemapGallery,
  Locate,
  SimpleMarkerSymbol,
  LabelClass,
  Search,
  FeatureTable,
  Expand,
  FeatureLayer,
  Map,
  MapView
) {
  const epmPopUpText =
    '<b><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#ffffff;background-color:#0b5588;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">PROJECT INFORMATION </span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">PIN:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {PIN}</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Project Name:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {PIN_DESC}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Region:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {REGION_CD}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Status:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {PIN_STAT_NM}</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Program:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {PROGRAM}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Description:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {PUBLIC_DESC}</span></p><br /><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#ffffff;background-color:#0b5588;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">PROJECT CONTACTS </span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Public Contact:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {PUB_CTC_NM}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Phone: </span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">{PUB_CTC_PH}</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Email:  </span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">{PUB_CTC_EMAIL}</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">*If the contact information is blank please contact your </span><a href="https://www.udot.utah.gov/main/f?p=100:pg:0:::1:T,V:38" rel="nofollow ugc" style="text-decoration:none;"><span style="font-size:10pt;font-family:Verdana;color:#1155cc;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Region office</span></a><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> for more information.   </span></p><br /><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#ffffff;background-color:#0b5588;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">DATES </span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Start Year: </span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">{FORECAST_ST_YR}</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Start Date:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {START_DAT}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">End Date:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> {EPM_PLAN_END_DATE}</span><span style="font-size:10pt;font-family:Verdana;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">*If the schedule information is blank please contact your </span><a href="https://www.udot.utah.gov/main/f?p=100:pg:0:::1:T,V:38" rel="nofollow ugc" style="text-decoration:none;"><span style="font-size:10pt;font-family:Verdana;color:#1155cc;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Region office</span></a><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> for more information. </span><span style="font-size:10pt;font-family:Verdana;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">  </span><span style="font-size:10pt;font-family:Verdana;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#ffffff;background-color:#0b5588;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">PROJECT FUNDING </span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Project Value: </span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">${PROJECT_VALUE}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Federal Dollars:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> ${FED_DOLLARS}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">State Dollars:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> ${STATE_DOLLARS}</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Total Expenditures:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> ${TOTAL_EXPENDITURES}</span></p><br /><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#ffffff;background-color:#0b5588;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">ADDITIONAL INFORMATION </span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Information Page:</span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><a href="https://www.udot.utah.gov/projectpages/f?p=250:2007:0::NO:2007:P2007_EPM_PROJ_XREF_NO,P2007_PROJECT_TYPE_IND_FLAG:{PROJ_XREF_NO}" rel="nofollow ugc" target="_blank">Click for more information</a><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /><br />Traffic Impacts:</span><span style="font-size:10pt;font-family:Verdana;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><a href="https://udottraffic.utah.gov/construction.aspx?tab=0" rel="nofollow ugc" target="_blank">Click to launch UDOT Traffic</a><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Roadway Imagery:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> </span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><a href="https://168.178.125.102/roadview.asp?Route={ROUTE_NAME}&amp;Mile={START_ACCUM}" rel="nofollow ugc" target="_blank">Click to launch Roadview Explorer</a></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><br /></span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Data Download Link:</span><span style="font-size:10pt;font-family:Verdana;color:#696969;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> </span></p><p style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><a href="https://data-uplan.opendata.arcgis.com/datasets/epm-all-projects-as-lines" rel="nofollow ugc" target="_blank">Click to launch Open Data</a></p></b>';
  let selectorClass = document.querySelectorAll(".layerSelect");
  let mpCheck = document.querySelector("#mpCheck");
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

  let linesView;
  const linesLayer = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    title: "EPM Projects",
    definitionExpression:
      "PROJ_TYP_NM <> 'Studies' AND ( PIN_STAT_NM = 'STIP' OR PIN_STAT_NM = 'Funding' OR (PIN_STAT_NM = 'Proposed' AND REGION_PRTY <999))",
    renderer: {
      type: "simple",
      symbol: { type: "simple-line", width: 2, color: "black" },
    },
  });

  linesLayer.popupTemplate = {
    content: epmPopUpText,
    title: "{PIN_DESC}",
  };

  let pointsView;
  const pointsLayer = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    definitionExpression:
      "PROJ_TYP_NM <> 'Studies' AND ( PIN_STAT_NM = 'STIP' OR PIN_STAT_NM = 'Funding' OR (PIN_STAT_NM = 'Proposed' AND REGION_PRTY <999))",
    renderer: {
      type: "simple",
      symbol: { type: "simple-marker", size: 6, color: "black" },
    },
  });
  pointsLayer.popupTemplate = {
    content: epmPopUpText,
    title: "{PIN_DESC}",
  };
  const map = new Map({
    basemap: "gray",
    layers: [linesLayer, pointsLayer, mpLayer],
  });

  const view = new MapView({
    map: map,
    center: [-111.891, 40.7608],
    zoom: 13,
    container: "viewDiv",
  });
  view.popup.defaultPopupTemplateEnabled = true;

  view.whenLayerView(linesLayer).then(function (layer) {
    linesView = layer;
    const featureTable = new FeatureTable({
      layer: linesLayer,
      view: view,
      container: document.getElementById("tableDiv"),
    });

    linesLayer.watch("loaded", () => {
      watchUtils.whenFalse(view, "updating", () => {
        // Get the new extent of view/map whenever map is updated
        if (view.extent) {
          // Filter and show only the visible features in the feature table
          featureTable.filterGeometry = view.extent;
        }
      });
    });
  });

  view.whenLayerView(pointsLayer).then(function (layer) {
    pointsView = layer;
  });

  view.whenLayerView(mpLayer).then(function (layer) {
    mpView = layer;
    toggleMP();
  });

  function toggleMP() {
    if (mpCheck.checked) {
      mpView.visible = true;
    } else {
      mpView.visible = false;
    }
  }

  const searchWidget = new Search({
    view: view,
    allPlaceholder: "Search Project or Location",
    sources: [
      {
        layer: linesLayer,
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

  const locateWidget = new Locate({
    view: view,
  });
  const basemapGallery = new BasemapGallery({
    view: view,
  });
  const basemapExpand = new Expand({
    view: view,
    expanded: false,
    expandIconClass: "esri-icon-collection",
    content: basemapGallery,
    group: "top-left",
  });

  view.ui.add([searchWidget], "top-right");

  const listExpand = new Expand({
    view: view,
    expanded: true,
    expandIconClass: "esri-icon-legend",
    content: document.getElementById("layerQuery"),
    group: "top-left",
  });

  view.ui.add([listExpand, locateWidget, basemapExpand], "top-left");

  // const zoomerExpand = new Expand({
  //   view: view,
  //   expanded: false,
  //   expandIconClass: "esri-icon-zoom-to-object",
  //   content:document.getElementById("zoomer"),
  //   group: "top-left"
  // });

  /**Zoomer Code */
  // const zoomButtons = document.querySelectorAll(".zoomer-button-entry");

  // zoomButtons.forEach((e) => {
  //   e.addEventListener("click", toggleZoomTool);
  // });

  // function toggleZoomTool(event){
  //   console.log(event)
  // }

  selectorClass.forEach((e) => {
    e.addEventListener("click", swapLayer);
  });

  mpCheck.addEventListener("click", toggleMP);

  function swapLayer(e) {
    const query = layerQueries[e.target.id].definitionExpression;
    const color = layerQueries[e.target.id].color;
    filter = { where: query };
    linesView.filter = filter;
    linesLayer.renderer.symbol.color = color;
    pointsView.filter = filter;
    pointsLayer.renderer.symbol.color = color;
    linesLayer.definitionExpression = query;
  }
});
