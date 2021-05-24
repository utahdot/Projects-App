require(["esri/layers/GroupLayer", "esri/layers/FeatureLayer", "esri/Map", "esri/views/MapView"], function (GroupLayer, FeatureLayer, Map, MapView) {
  const finishedLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    renderer: {type: "simple", symbol: {type: "simple-line", width: 2, color: "red"}},
    definitionExpression: "PIN_STAT_NM = 'Physically Complete' OR PIN_STAT_NM = 'Contract Complete' OR PIN_STAT_NM = 'Region Review' OR PIN_STAT_NM = 'Central Review' OR PIN_STAT_NM = 'Contract Closed Out' OR PIN_STAT_NM = 'Close Out' OR PIN_STAT_NM = 'Closed'"
  });
  const finishedPoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    renderer: {type: "simple", symbol: {type: "simple-marker", size: 6, color: "red"}},
    definitionExpression: "PIN_STAT_NM = 'Physically Complete' OR PIN_STAT_NM = 'Contract Complete' OR PIN_STAT_NM = 'Region Review' OR PIN_STAT_NM = 'Central Review' OR PIN_STAT_NM = 'Contract Closed Out' OR PIN_STAT_NM = 'Close Out' OR PIN_STAT_NM = 'Closed'"

  });
  const finished = new GroupLayer({
    title: "Finished",
    visible: true,
    visibilityMode: "inherited",
    listMode: "hide-children",
    layers: [finishedLines,finishedPoints],
  });

  const inDesignLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    renderer: {type: "simple", symbol: {type: "simple-line", width: 2, color: "yellow"}},
    definitionExpression: "PROJ_TYP_NM <> 'Studies' AND ( PIN_STAT_NM = 'Active' OR PIN_STAT_NM = 'Concept Scoping' OR PIN_STAT_NM = 'Advertised' OR PIN_STAT_NM = 'Awarded' OR PIN_STAT_NM = 'Concept Active' OR PIN_STAT_NM = 'Concept Cmplt' OR PIN_STAT_NM = 'Scoping')"
  });
  const inDesignPoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    renderer: {type: "simple", symbol: {type: "simple-marker", size: 6, color: "yellow"}},
    definitionExpression: "PROJ_TYP_NM <> 'Studies' AND ( PIN_STAT_NM = 'Active' OR PIN_STAT_NM = 'Concept Scoping' OR PIN_STAT_NM = 'Advertised' OR PIN_STAT_NM = 'Awarded' OR PIN_STAT_NM = 'Concept Active' OR PIN_STAT_NM = 'Concept Cmplt' OR PIN_STAT_NM = 'Scoping')"

  });
  const inDesign = new GroupLayer({
    title: "In Design",
    visible: true,
    visibilityMode: "inherited",
    listMode: "hide-children",
    layers: [inDesignLines,inDesignPoints],
  });

  const plannedLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    renderer: {type: "simple", symbol: {type: "simple-line", width: 2, color: "black"}},
    definitionExpression: "PROJ_TYP_NM <> 'Studies' AND ( PIN_STAT_NM = 'STIP' OR PIN_STAT_NM = 'Funding' OR (PIN_STAT_NM = 'Proposed' AND REGION_PRTY <999))"
  });
  const plannedPoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    renderer: {type: "simple", symbol: {type: "simple-marker", size: 6, color: "black"}},
    definitionExpression: "PROJ_TYP_NM <> 'Studies' AND ( PIN_STAT_NM = 'STIP' OR PIN_STAT_NM = 'Funding' OR (PIN_STAT_NM = 'Proposed' AND REGION_PRTY <999))"

  });
  const planned = new GroupLayer({
    title: "Planned",
    visible: true,
    visibilityMode: "inherited",
    listMode: "hide-children",
    layers: [plannedLines,plannedPoints],
  });

  const studiesLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    renderer: {type: "simple", symbol: {type: "simple-line", width: 2, color: "blue"}},
    definitionExpression: "(PUBLIC_DESC LIKE '%stud%' OR PUBLIC_DESC LIKE '%STUD%' OR PUBLIC_DESC LIKE '%Stud%' OR PIN_DESC LIKE '%stud%' OR PIN_DESC LIKE '%STUD%' OR PIN_DESC LIKE '%Stud%' OR PROJ_TYP_NM = 'Studies') AND (PIN_STAT_NM <> 'Physically Complete' AND PIN_STAT_NM <> 'Contract Complete' AND PIN_STAT_NM <> 'Region Review' AND PIN_STAT_NM <> 'Central Review' AND PIN_STAT_NM <> 'Contract Closed Out' AND PIN_STAT_NM <> 'Close Out' AND PIN_STAT_NM <> 'Closed')"
  });
  const studiesPoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    renderer: {type: "simple", symbol: {type: "simple-marker", size: 6, color: "blue"}},
    definitionExpression: "(PUBLIC_DESC LIKE '%stud%' OR PUBLIC_DESC LIKE '%STUD%' OR PUBLIC_DESC LIKE '%Stud%' OR PIN_DESC LIKE '%stud%' OR PIN_DESC LIKE '%STUD%' OR PIN_DESC LIKE '%Stud%' OR PROJ_TYP_NM = 'Studies') AND (PIN_STAT_NM <> 'Physically Complete' AND PIN_STAT_NM <> 'Contract Complete' AND PIN_STAT_NM <> 'Region Review' AND PIN_STAT_NM <> 'Central Review' AND PIN_STAT_NM <> 'Contract Closed Out' AND PIN_STAT_NM <> 'Close Out' AND PIN_STAT_NM <> 'Closed')"

  });
  const studies = new GroupLayer({
    title: "Studies",
    visible: true,
    visibilityMode: "inherited",
    listMode: "hide-children",
    layers: [studiesLines,studiesPoints],
  });

  const constructionLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    renderer: {type: "simple", symbol: {type: "simple-line", width: 2, color: "green"}},
    definitionExpression: "PROJ_TYP_NM <> 'Studies' AND (PIN_STAT_NM = 'Under Construction')"
  });
  const constructionPoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    renderer: {type: "simple", symbol: {type: "simple-marker", size: 6, color: "green"}},
    definitionExpression: "PROJ_TYP_NM <> 'Studies' AND (PIN_STAT_NM = 'Under Construction')"

  });
  const construction = new GroupLayer({
    title: "Construction",
    visible: true,
    visibilityMode: "inherited",
    listMode: "hide-children",
    layers: [constructionLines,constructionPoints],
  });

  const substCompltLines = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
    renderer: {type: "simple", symbol: {type: "simple-line", width: 2, color: "orange"}},
    definitionExpression: "PROJ_TYP_NM <> 'Studies' AND (PIN_STAT_NM = 'Under Construction')"
  });
  const substCompltPoints = new FeatureLayer({
    url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
    renderer: {type: "simple", symbol: {type: "simple-marker", size: 6, color: "orange"}},
    definitionExpression: "PROJ_TYP_NM <> 'Studies' AND (PIN_STAT_NM = 'Under Construction')"

  });
  const substComplt = new GroupLayer({
    title: "Construction",
    visible: true,
    visibilityMode: "inherited",
    listMode: "hide-children",
    layers: [substCompltLines,substCompltPoints],
  });

  const map = new Map({
    basemap: "gray", 
    layers: [finished,inDesign,planned, studies, construction, substComplt]
  });

  const view = new MapView({
    map: map,
    center: [-111.891, 40.7608], // Longitude, latitude
    zoom: 13, // Zoom level
    container: "viewDiv", // Div element
  });
});
