/**
 * TODO:
 * Table
 * Zoomer
 * Search
 * Inset Map Location
 */

require([
  "esri/widgets/FeatureTable",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/widgets/LayerList",
  "esri/layers/GroupLayer",
  "esri/layers/FeatureLayer",
  "esri/Map",
  "esri/views/MapView",
], function (
  FeatureTable,
  Legend,
  Expand,
  LayerList,
  GroupLayer,
  FeatureLayer,
  Map,
  MapView
) {

  const layerQueries = {

    "Finished": {
      definitionExpression:
      "PIN_STAT_NM = 'Physically Complete' OR PIN_STAT_NM = 'Contract Complete' OR PIN_STAT_NM = 'Region Review' OR PIN_STAT_NM = 'Central Review' OR PIN_STAT_NM = 'Contract Closed Out' OR PIN_STAT_NM = 'Close Out' OR PIN_STAT_NM = 'Closed'",
      color: "red"
    },
    "In Design": {
      definitionExpression:
      "PROJ_TYP_NM <> 'Studies' AND ( PIN_STAT_NM = 'Active' OR PIN_STAT_NM = 'Concept Scoping' OR PIN_STAT_NM = 'Advertised' OR PIN_STAT_NM = 'Awarded' OR PIN_STAT_NM = 'Concept Active' OR PIN_STAT_NM = 'Concept Cmplt' OR PIN_STAT_NM = 'Scoping')",
      color: "yellow"
    },
    "Planned":{
      definitionExpression:
      "PROJ_TYP_NM <> 'Studies' AND ( PIN_STAT_NM = 'STIP' OR PIN_STAT_NM = 'Funding' OR (PIN_STAT_NM = 'Proposed' AND REGION_PRTY <999))",
      color: "black"
    },
    "Studies":{
      definitionExpression:
      "(PUBLIC_DESC LIKE '%stud%' OR PUBLIC_DESC LIKE '%STUD%' OR PUBLIC_DESC LIKE '%Stud%' OR PIN_DESC LIKE '%stud%' OR PIN_DESC LIKE '%STUD%' OR PIN_DESC LIKE '%Stud%' OR PROJ_TYP_NM = 'Studies') AND (PIN_STAT_NM <> 'Physically Complete' AND PIN_STAT_NM <> 'Contract Complete' AND PIN_STAT_NM <> 'Region Review' AND PIN_STAT_NM <> 'Central Review' AND PIN_STAT_NM <> 'Contract Closed Out' AND PIN_STAT_NM <> 'Close Out' AND PIN_STAT_NM <> 'Closed')",
      color: "blue"
    },
    "Construction":{
      definitionExpression:
      "PROJ_TYP_NM <> 'Studies' AND (PIN_STAT_NM = 'Under Construction')",
      color: "green"

    },
    "Substantially Complete":{
      definitionExpression:
      "PROJ_TYP_NM <> 'Studies' AND (PIN_STAT_NM = 'Under Construction')",
      color: "orange"
    },
    "All Projects"


  }

  const lines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    title: "All Projects - Lines",
    renderer: {
      type: "simple",
      symbol: { type: "simple-line", width: 2, color: "purple" },
    },
  });
  const points = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    title: "All Projects - Points",
    renderer: {
      type: "simple",
      symbol: { type: "simple-marker", size: 6, color: "purple" },
    },
  });

  const map = new Map({
    basemap: "gray",
    layers: [
      finished,
      inDesign,
      planned,
      studies,
      construction,
      substComplt,
      all,
    ],
  });

  const view = new MapView({
    map: map,
    center: [-111.891, 40.7608], // Longitude, latitude
    zoom: 13, // Zoom level
    container: "viewDiv", // Div element
  });
  view.popup.defaultPopupTemplateEnabled = true
  const layerList = new LayerList({ view: view });

  const legend = new Legend({
    view: view,
    layerInfos: [
      {
        layer: finished,
      },
      {
        layer: inDesign,
      },
      {
        layer: planned,
      },
      {
        layer: studies,
      },
      {
        layer: construction,
      },
      {
        layer: substComplt,
      },
      {
        layer: all,
      },
    ],
  });
  const legendExpand = new Expand({
    view: view,
    content: legend,
    group: "top-left",
  });
  const listExpand = new Expand({
    view: view,
    content: layerList,
    group: "top-left",
  });

  view.ui.add([listExpand, legendExpand], "top-left");
});
