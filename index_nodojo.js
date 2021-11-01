
require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/core/watchUtils",
    "esri/layers/FeatureLayer",
    "esri/layers/GroupLayer",
    "esri/widgets/FeatureTable",
    "esri/widgets/LayerList",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Search",
    "esri/widgets/Expand",

], (
    esriConfig,
    Map,
    MapView,
    watchUtils,
    FeatureLayer,
    GroupLayer,
    FeatureTable,
    LayerList,
    BasemapGallery,
    Search,
    Expand,
    ) => {

        // API key for accessing newer Esri basemaps
        esriConfig.apiKey = "AAPKc422669b0fbe46a2b56d697c4dd3384cYslFfknNEQtB3WgUxoiEsPrfUr2viZq0XYQqCSdSjTKTldmVSiccSYqaz_2hLWPa"

        // Object storing layer definitions as objects
        // SQL definition queries for use with points and lines layers
        // symbology color
        const layerQueries = {
            Finished: {
                definitionExpression:
                    "PIN_STAT_NM IN ('Central Review', 'Close Out', 'Closed', 'Contract Closed Out', 'Contract Complete', 'Physically Complete', 'Region Review')",
                color: "red",
            },
            InDesign: {
                definitionExpression:
                    "PROJ_TYP_NM <> 'Studies' AND PIN_STAT_NM IN ('Active', 'Concept Scoping', 'Advertised', 'Awarded', 'Concept Active', 'Concept Cmplt', 'Scoping')",
                color: "yellow",
            },
            Planned: {
                definitionExpression:
                    "PROJ_TYP_NM <> 'Studies' AND (PIN_STAT_NM IN ('STIP', 'Funding') OR (PIN_STAT_NM = 'Proposed' AND REGION_PRTY < 999))",
                color: "black",
            },
            Studies: {
                definitionExpression:
                    "(UPPER(PIN_DESC) LIKE '%STUD%' OR UPPER(PUBLIC_DESC) LIKE '%STUD%' OR PROJ_TYP_NM = 'Studies') AND PIN_STAT_NM NOT IN ('Central Review', 'Close Out', 'Closed', 'Contract Closed Out', 'Contract Complete', 'Physically Complete', 'Region Review')",
                color: "blue",
            },
            Construction: {
                definitionExpression:
                    "PROJ_TYP_NM <> 'Studies' AND PIN_STAT_NM = 'Under Construction'",
                color: "green",
            },
            SubstantiallyComplete: {
                definitionExpression:
                    "PROJ_TYP_NM <> 'Studies' AND PIN_STAT_NM = 'Substantially Compl'",
                color: "orange",
            },
            AllProjects: {
                definitionExpression:
                    "1=1",
                color: "purple",
            },
        };


        // FeatureLayers and their GroupLayers

        // Planned
        const plannedLines = new FeatureLayer({
            title: "Planned Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.Planned.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: 2,
                    color: layerQueries.Planned.color,
                },
            },
        });

        const plannedPoints = new FeatureLayer({
            title: "Planned Projects (points)",
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
        });

        const groupPlanned = new GroupLayer({
            title: "Planned Projects",
            layers: [plannedLines, plannedPoints],
            visibilityMode: "independent",
            visible: true,
        });


        // Finished
        const finishedLines = new FeatureLayer({
            title: "Finished Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.Finished.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: 2,
                    color: layerQueries.Finished.color,
                },
            },
        });

        const finishedPoints = new FeatureLayer({
            title: "Finished Projects (points)",
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
        });

        const groupFinished = new GroupLayer({
            title: "Finished Projects",
            layers: [finishedLines, finishedPoints],
            visibilityMode: "independent",
            visible: false
        });


        // In Design
        const inDesignLines = new FeatureLayer({
            title: "In Design Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.InDesign.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: 2,
                    color: layerQueries.InDesign.color,
                },
            },
        });

        const inDesignPoints = new FeatureLayer({
            title: "In Design Projects (points)",
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
        });

        const groupInDesign = new GroupLayer({
            title: "In Design Projects",
            layers: [inDesignLines, inDesignPoints],
            visibilityMode: "independent",
            visible: false
        });


        // Studies
        const studiesLines = new FeatureLayer({
            title: "Studies Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.Studies.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: 2,
                    color: layerQueries.Studies.color,
                },
            },
        });

        const studiesPoints = new FeatureLayer({
            title: "Studies Projects (points)",
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
        });

        const groupStudies = new GroupLayer({
            title: "Studies Projects",
            layers: [studiesLines, studiesPoints],
            visibilityMode: "independent",
            visible: false
        });


        // Construction
        const constructionLines = new FeatureLayer({
            title: "Construction Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.Construction.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: 2,
                    color: layerQueries.Construction.color,
                },
            },
        });

        const constructionPoints = new FeatureLayer({
            title: "Construction Projects (points)",
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
        });

        const groupConstruction = new GroupLayer({
            title: "Construction Projects",
            layers: [constructionLines, constructionPoints],
            visibilityMode: "independent",
            visible: false
        });


        // Substantially Complete
        const substantiallyCompleteLines = new FeatureLayer({
            title: "Substantially Complete Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.SubstantiallyComplete.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: 2,
                    color: layerQueries.SubstantiallyComplete.color,
                },
            },
        });

        const SubstantiallyCompletePoints = new FeatureLayer({
            title: "Substantially Complete Projects (points)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
            definitionExpression: layerQueries.SubstantiallyComplete.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    size: 6,
                    color: layerQueries.SubstantiallyComplete.color,
                },
            },
        });

        const groupSubstantiallyComplete = new GroupLayer({
            title: "Substantially Complete Projects",
            layers: [substantiallyCompleteLines, SubstantiallyCompletePoints],
            visibilityMode: "independent",
            visible: false
        });


        // All Projects
        const allProjectsLines = new FeatureLayer({
            title: "All Projects (linear)",
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
        });

        const allProjectsPoints = new FeatureLayer({
            title: "All Projects (points)",
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
        });

        const groupAllProjects = new GroupLayer({
            title: "All Projects",
            layers: [allProjectsLines, allProjectsPoints],
            visibilityMode: "independent",
            visible: false
        });


        // ADD: mileposts layer here


        // new Map object
        const map = new Map({
            basemap: "arcgis-navigation",
            layers: [
                //mile posts
                groupAllProjects,
                groupSubstantiallyComplete,
                groupConstruction,
                groupStudies,
                groupInDesign,
                groupFinished,
                groupPlanned,
            ],
        });

        const view = new MapView({
            map: map,
            center: [-111.90121, 40.76203],
            zoom: 12,
            container: "viewDiv",
            popup: {
                dockEnabled: true,
                dockOptions: {
                    buttonEnabled: false,
                    breakpoint: false,
                }
            }
        });


        // LayerList widget
        let layerList = new LayerList({
            view: view
        });

        // LayerList Expand widget
        let layerListExpand = new Expand({
            expandIconClass: "esri-icon-layer-list",
            view: view,
            expandTooltip: "Expand Layer List",
            content: layerList
        });
        view.ui.add(layerListExpand, {
            position: "top-left"
        });

        // BasemapGallery widget
        let basemapGallery = new BasemapGallery({
            view: view
        });

        // BasemapGallery Expand widget
        let basemapGalleryExpand = new Expand({
            expandIconClass: "esri-icon-basemap",
            view: view,
            expandTooltip: "Basemap Gallery",
            content: basemapGallery
        });
        view.ui.add(basemapGalleryExpand, {
            position: "top-right"
        });



        // Search widget FeatureLayers

        const municipalBoundaries = new FeatureLayer({
            url: "https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/UtahMunicipalBoundaries/FeatureServer/0",
            title: "Municipalities"
        });
        const countyBoundaries = new FeatureLayer({
            url: "https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/UtahCountyBoundaries/FeatureServer/0",
            title: "Counties"
        });
        const USCongressDistricts = new FeatureLayer({
            url: "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/USCongressDistricts2002/FeatureServer/0",
            title: "US Congressional District (2012)"
        });
        const UtahSenateDistricts = new FeatureLayer({
            url: "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahSenateDistricts2002/FeatureServer/0",
            title: "Utah Senate Districts (2012)"
        });
        const UtahHouseDistricts = new FeatureLayer({
            url: "https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahHouseDistricts2002/FeatureServer/0",
            title: "Utah House Districts (2012)"
        });
        const RegionBoundaries = new FeatureLayer({
            url: "https://maps.udot.utah.gov/arcgis/rest/services/UDOT_Regions/MapServer/1",
            title: "UDOT Region Boundaries"
        });



        // Search widget
        let searchWidget = new Search({
            view: view,
            allPlaceholder: "Search Project or Location",
            locationEnabled: true,
            autoSelect: true,
            popupEnabled: true,
            includeDefaultSources: false,  // removes the Esri geocoding service (may not be wanted)
            sources: [
                {
                    layer: allProjectsLines,
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
                    layer: USCongressDistricts,
                    searchFields: ["DISTRICT"],
                    displayField: "DISTRICT",
                    exactMatch: false,
                    name: "Congressional Districts",
                    placeholder: "example: 2",
                },
                {
                    layer: UtahSenateDistricts,
                    searchFields: ["DIST"],
                    displayField: "DIST",
                    exactMatch: false,
                    name: "Utah Senate Districts",
                    placeholder: "example: 27",
                },
                {
                    layer: UtahHouseDistricts,
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

        // Search Expand widget
        let searchExpand = new Expand({
            expandIconClass: "esri-icon-search",
            view: view,
            expandTooltip: "Search Tool",
            content: searchWidget
        });
        view.ui.add(searchExpand, {
            position: "top-right"
        });


        // FeatureTables
        // These go in the tabbed Calcite component widget at the bottom of the map
        // ToDo: Find a way to expand/collapse this widget

        const plannedTable = new FeatureTable({
            layer: plannedLines,
            view: view,
            container: document.getElementById("tabPlanned"),
        });

        const finishedTable = new FeatureTable({
            layer: finishedLines,
            view: view,
            container: document.getElementById("tabFinished"),
        });

        const inDesignTable = new FeatureTable({
            layer: inDesignLines,
            view: view,
            container: document.getElementById("tabInDesign"),
        });

        const studiesTable = new FeatureTable({
            layer: studiesLines,
            view: view,
            container: document.getElementById("tabStudies"),
        });

        const constructionTable = new FeatureTable({
            layer: constructionLines,
            view: view,
            container: document.getElementById("tabConstruction"),
        });

        const substantiallyCompleteTable = new FeatureTable({
            layer: substantiallyCompleteLines,
            view: view,
            container: document.getElementById("tabSubstantiallyComplete"),
        });

        const allProjectsTable = new FeatureTable({
            layer: allProjectsLines,
            view: view,
            container: document.getElementById("tabAllProjects"),
        });
});
