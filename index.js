/**
 * TODO:
 * Zoomer
 * Search
 * Inset Map Location
 * style layer select
 * Table
 */

require([
  "esri/widgets/Search",
  "esri/widgets/FeatureTable",
  "esri/widgets/Expand",
  "esri/layers/FeatureLayer",
  "esri/Map",
  "esri/views/MapView",
], function (
  Search,
  FeatureTable,
  Expand,
  FeatureLayer,
  Map,
  MapView
) {
  selectorClass = document.querySelectorAll(".layerSelect");
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

  const map = new Map({
    basemap: "gray",
    layers: [linesLayer, pointsLayer],
  });

  const view = new MapView({
    map: map,
    center: [-111.891, 40.7608], // Longitude, latitude
    zoom: 13, // Zoom level
    container: "viewDiv", // Div element
  });
  view.popup.defaultPopupTemplateEnabled = true;

  view.whenLayerView(linesLayer).then(function(layer){
    linesView = layer;

    const featureTable = new FeatureTable({
      layer: linesLayer,
      view: view,
      container: document.getElementById("tableDiv")
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
  view.whenLayerView(pointsLayer).then(function(layer){
    pointsView = layer;
  });

  const searchWidget = new Search({
    view: view,
    allPlaceholder: "Search Project or Location",
    sources:[
      {
        layer: linesLayer,
        searchFields: ["PIN","PIN_DESC"],
        displayField: "PIN_DESC",
        exactMatch: false,
        // outFields: ["PIN","PIN_DESC"],
        name: "UDOT Projects",
        placeholder: "example: 3708"
      },
    ]
  });
  // Adds the search widget below other elements in
  // the top left corner of the view
  view.ui.add(searchWidget, {
    position: "top-right"
  });

  const listExpand = new Expand({
    view: view,
    expanded: true,
    expandIconClass: "esri-icon-legend",
    content: document.getElementById("layerQuery"),
    group: "top-left"
  });
  // const zoomerExpand = new Expand({
  //   view: view,
  //   expanded: false,
  //   expandIconClass: "esri-icon-zoom-to-object",
  //   content:document.getElementById("zoomer"),
  //   group: "top-left"
  // });

  
  view.ui.add([listExpand], "top-left");


  /**Zoomer Code */
  const zoomButtons = document.querySelectorAll(".zoomer-button-entry");

  zoomButtons.forEach((e) => {
    e.addEventListener("click", toggleZoomTool);
  });

  function toggleZoomTool(event){
    console.log(event)
  }

  selectorClass.forEach((e) => {
    e.addEventListener("click", swapLayer);
  });

  function swapLayer(e) {
    const query = layerQueries[e.target.id].definitionExpression;
    const color = layerQueries[e.target.id].color;
    filter = {where: query};
    linesView.filter = filter;
    linesLayer.renderer.symbol.color = color;
    pointsView.filter = filter;
    pointsLayer.renderer.symbol.color = color;
    linesLayer.definitionExpression = query;
  };


});
