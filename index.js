/**
 * TODO:
 * Zoomer
 * Search
 * Inset Map Location
 * style layer select
 * Table
 */

require([
  "esri/symbols/SimpleMarkerSymbol",
  "esri/layers/support/LabelClass",
  "esri/widgets/Search",
  "esri/widgets/FeatureTable",
  "esri/widgets/Expand",
  "esri/layers/FeatureLayer",
  "esri/Map",
  "esri/views/MapView",
], function (
  SimpleMarkerSymbol,
  LabelClass,
  Search,
  FeatureTable,
  Expand,
  FeatureLayer,
  Map,
  MapView
) {
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
    title: "Municipalities"
  }); 

  const countyBoundaries = new FeatureLayer({
    url: "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahCountyBoundaries/FeatureServer/0",
    title: "Counties"
  }); 

  const USCongressDistricts2012 = new FeatureLayer({
    url: "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/USCongressDistricts2012/FeatureServer/0",
    title: " 2012 US Congress Districts"
  }); 

  const UtahSenateDistricts2012 = new FeatureLayer({
    url: "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahSenateDistricts2012/FeatureServer/0",
    title: "2012 Utah Senate Districts"
  }); 

  const UtahHouseDistricts2012 = new FeatureLayer({
    url: "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahHouseDistricts2012/FeatureServer/0",
    title: "2012 Utah House Districts"
  });
  const RegionBoundaries = new FeatureLayer({
    url: "https://maps.udot.utah.gov/arcgis/rest/services/UDOT_Regions/MapServer/1",
    title: "UDOT Region Boundaries"
  });

  const mpLabel = new LabelClass({
    labelExpressionInfo: { expression: "$feature.Measure" },
    symbol: {
      type: "text", // autocasts as new TextSymbol()
      color: "black",
      haloSize: 1,
      haloColor: "white",
      font: {
        // autocast as new Font()
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
    }
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
    layers: [linesLayer, pointsLayer,mpLayer],
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

  view.whenLayerView(mpLayer).then(function(layer){
    mpView = layer;  
  });
  function toggleMP(){
    mpView.visible = !mpView.visible;
  }
  
  const searchWidget = new Search({
    view: view,
    allPlaceholder: "Search Project or Location",
    sources:[
      {
        layer: linesLayer,
        searchFields: ["PIN","PIN_DESC"],
        suggestionTemplate:"{PIN}: {PIN_DESC}",
        displayField: "PIN",
        exactMatch: false,
        // outFields: ["PIN","PIN_DESC"],
        name: "UDOT Projects",
        placeholder: "example: 16716"
      },{
        layer: municipalBoundaries,
        searchFields: ["NAME", "SHORTDESC"],
        displayField: "NAME",
        exactMatch: false,
        name: "Municipal Boundaries",
        placeholder: "example: Salt Lake City"
      },{
        layer:countyBoundaries,
        searchFields: ["NAME"],
        displayField: "NAME",
        exactMatch: false,
        name: "County Boundaries",
        placeholder: "example: Salt Lake County"
      },{
        layer:USCongressDistricts2012,
        searchFields: ["DISTRICT"],
        displayField: "DISTRICT",
        exactMatch: false,
        name: "Congressional Districts",
        placeholder: "example: 2"
      },{
        layer:UtahSenateDistricts2012,
        searchFields: ["DIST"],
        displayField: "DIST",
        exactMatch: false,
        name: "Utah Senate Districts",
        placeholder: "example: 27"
      },{
        layer:UtahHouseDistricts2012,
        searchFields: ["DIST"],
        displayField: "DIST",
        exactMatch: false,
        name: "Utah House Districts",
        placeholder: "example: 61"
      },{
        layer:RegionBoundaries,
        searchFields: ["NAME"],
        displayField: "NAME",
        exactMatch: false,
        name: "UDOT Region Boundaries",
        placeholder: "example: Region 3"
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
  mpCheck.addEventListener("click", toggleMP);

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
