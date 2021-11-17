
require([
    "esri/config",
    "esri/Map",
    "esri/Graphic",
    "esri/Color",
    "esri/views/MapView",
    "esri/core/watchUtils",
    "esri/layers/FeatureLayer",
    "esri/layers/GroupLayer",
    "esri/layers/support/LabelClass",
    "esri/widgets/FeatureTable",
    "esri/widgets/LayerList",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Search",
    "esri/widgets/Expand",
    "esri/widgets/Locate",
], (
    esriConfig,
    Map,
    Graphic,
    Color,
    MapView,
    watchUtils,
    FeatureLayer,
    GroupLayer,
    LabelClass,
    FeatureTable,
    LayerList,
    BasemapGallery,
    Search,
    Expand,
    Locate,
    ) => {

        // API key for accessing newer Esri basemaps
        esriConfig.apiKey = "AAPKc422669b0fbe46a2b56d697c4dd3384cYslFfknNEQtB3WgUxoiEsPrfUr2viZq0XYQqCSdSjTKTldmVSiccSYqaz_2hLWPa"

        // ** FeatureLayer definitions
        // Stored as objects for use with points and lines layers
        const layerQueries = {
            finished: {
                definitionExpression:
                    "PIN_STAT_NM IN ('Central Review', 'Close Out', 'Closed', 'Contract Closed Out', 'Contract Complete', 'Physically Complete', 'Region Review')",
                color: "red",
            },
            inDesign: {
                definitionExpression:
                    "PROJ_TYP_NM <> 'Studies' AND PIN_STAT_NM IN ('Active', 'Concept Scoping', 'Advertised', 'Awarded', 'Concept Active', 'Concept Cmplt', 'Scoping')",
                color: "yellow",
            },
            planned: {
                definitionExpression:
                    "PROJ_TYP_NM <> 'Studies' AND (PIN_STAT_NM IN ('STIP', 'Funding') OR (PIN_STAT_NM = 'Proposed' AND REGION_PRTY < 999))",
                color: "black",
            },
            studies: {
                definitionExpression:
                    "(UPPER(PIN_DESC) LIKE '%STUD%' OR UPPER(PUBLIC_DESC) LIKE '%STUD%' OR PROJ_TYP_NM = 'Studies') AND PIN_STAT_NM NOT IN ('Central Review', 'Close Out', 'Closed', 'Contract Closed Out', 'Contract Complete', 'Physically Complete', 'Region Review')",
                color: "blue",
            },
            construction: {
                definitionExpression:
                    "PROJ_TYP_NM <> 'Studies' AND PIN_STAT_NM = 'Under Construction'",
                color: "green",
            },
            substantiallyComplete: {
                definitionExpression:
                    "PROJ_TYP_NM <> 'Studies' AND PIN_STAT_NM = 'Substantially Compl'",
                color: "orange",
            },
            allProjects: {
                definitionExpression:
                    "1=1",
                color: "purple",
            },
        };

        // set default symbology attributes
        const layerSymbols = {
            lineWidth: 2,
            pointSize: 6
        };

        const epmPopup = {
            title: '{PIN_DESC}',
            content: [
                {
                    type: "text",
                    text: "<b>PROJECT INFORMATION</b>" // see if you can style this using a <span>
                },
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            label: "PIN",
                            fieldName: "PIN",
                        },
                        {
                            label: "Region",
                            fieldName: "REGION_CD",
                        },
                        {
                            label: "Status",
                            fieldName: "PIN_STAT_NM",
                        },
                        {
                            label: "Program",
                            fieldName: "PROGRAM",
                        },
                    ]
                },
                {
                    type: "text",
                    text: "<b>DESCRIPTION:</b><p>{PUBLIC_DESC}</p>"
                },
                {
                    type: "text",
                    text: "<b>PROJECT CONTACTS</b>"
                },
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            label: "Public Contact",
                            fieldName: "PUB_CTC_NM",
                        },
                        {
                            label: "Phone",
                            fieldName: "PUB_CTC_PH",
                        },
                        {
                            label: "Email",
                            fieldName: "PUB_CTC_EMAIL",
                        },
                    ]
                },
                {
                    type: "text",
                    text: "*If the contact information is blank, please contact your <a href='https://www.udot.utah.gov/connect/about-us/regional-offices/'>Region office</a>"
                },
                {
                    type: "text",
                    text: "<b>DATES</b>"
                },
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            label: "Start Year",
                            fieldName: "FORECAST_ST_YR",
                        },
                        {
                            label: "Start Date",
                            fieldName: "START_DAT",
                        },
                        {
                            label: "End Date",
                            fieldName: "EPM_PLAN_END_DATE",
                        },
                    ]
                },
                {
                    type: "text",
                    text: "*If the schedule information is blank, please contact your <a href='https://www.udot.utah.gov/connect/about-us/regional-offices/'>Region office</a>"
                },
                {
                    type: "text",
                    text: "<b>PROJECT FUNDING</b>"
                },
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            label: "Project Value",
                            fieldName: "",
                        },
                        {
                            label: "Federal Dollars",
                            fieldName: "",
                        },
                        {
                            label: "State Dollars",
                            fieldName: "",
                        },
                        {
                            label: "Total Expenditures",
                            fieldName: "",
                        },
                    ]
                },
            ]
        };


        // ** FeatureLayers, FeatureLayerViews, and their GroupLayers

        // Planned
        let plannedLinesView;  // FeatureLayerView
        const plannedLines = new FeatureLayer({
            title: "Planned Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.planned.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: layerSymbols.lineWidth,
                    color: layerQueries.planned.color,
                },
            },
            popupTemplate: epmPopup,
        });

        let plannedPointsView;
        const plannedPoints = new FeatureLayer({
            title: "Planned Projects (points)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
            definitionExpression: layerQueries.planned.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    size: layerSymbols.pointSize,
                    color: layerQueries.planned.color,
                },
            },
            popupTemplate: epmPopup,
        });

        const groupPlanned = new GroupLayer({
            title: "Planned Projects",
            layers: [plannedLines, plannedPoints],
            visibilityMode: "independent",
            visible: true,
        });


        // finished
        let finishedLinesView;
        const finishedLines = new FeatureLayer({
            title: "Finished Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.finished.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: layerSymbols.lineWidth,
                    color: layerQueries.finished.color,
                },
            },
            popupTemplate: epmPopup,
        });

        let finishedPointsView;
        const finishedPoints = new FeatureLayer({
            title: "Finished Projects (points)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
            definitionExpression: layerQueries.finished.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    size: layerSymbols.pointSize,
                    color: layerQueries.finished.color,
                },
            },
            popupTemplate: epmPopup,
        });

        const groupFinished = new GroupLayer({
            title: "Finished Projects",
            layers: [finishedLines, finishedPoints],
            visibilityMode: "independent",
            visible: false
        });


        // In Design
        let inDesignLinesView;
        const inDesignLines = new FeatureLayer({
            title: "In Design Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.inDesign.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: layerSymbols.lineWidth,
                    color: layerQueries.inDesign.color,
                },
            },
            popupTemplate: epmPopup,
        });

        let inDesignPointsView;
        const inDesignPoints = new FeatureLayer({
            title: "In Design Projects (points)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
            definitionExpression: layerQueries.inDesign.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    size: layerSymbols.pointSize,
                    color: layerQueries.inDesign.color,
                },
            },
            popupTemplate: epmPopup,
        });

        const groupInDesign = new GroupLayer({
            title: "In Design Projects",
            layers: [inDesignLines, inDesignPoints],
            visibilityMode: "independent",
            visible: false
        });


        // Studies
        let studiesLinesView;
        const studiesLines = new FeatureLayer({
            title: "Studies Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.studies.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: layerSymbols.lineWidth,
                    color: layerQueries.studies.color,
                },
            },
            popupTemplate: epmPopup,
        });

        let studiesPointsView;
        const studiesPoints = new FeatureLayer({
            title: "Studies Projects (points)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
            definitionExpression: layerQueries.studies.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    size: layerSymbols.pointSize,
                    color: layerQueries.studies.color,
                },
            },
            popupTemplate: epmPopup,
        });

        const groupStudies = new GroupLayer({
            title: "Studies Projects",
            layers: [studiesLines, studiesPoints],
            visibilityMode: "independent",
            visible: false
        });


        // Construction
        let constructionLinesView;
        const constructionLines = new FeatureLayer({
            title: "Construction Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.construction.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: layerSymbols.lineWidth,
                    color: layerQueries.construction.color,
                },
            },
            popupTemplate: epmPopup,
        });

        let constructionPointsView;
        const constructionPoints = new FeatureLayer({
            title: "Construction Projects (points)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
            definitionExpression: layerQueries.construction.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    size: layerSymbols.pointSize,
                    color: layerQueries.construction.color,
                },
            },
            popupTemplate: epmPopup,
        });

        const groupConstruction = new GroupLayer({
            title: "Construction Projects",
            layers: [constructionLines, constructionPoints],
            visibilityMode: "independent",
            visible: false
        });


        // Substantially Complete
        let substantiallyCompleteLinesView;
        const substantiallyCompleteLines = new FeatureLayer({
            title: "Substantially Complete Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.substantiallyComplete.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: layerSymbols.lineWidth,
                    color: layerQueries.substantiallyComplete.color,
                },
            },
            popupTemplate: epmPopup,
        });

        let substantiallyCompletePointsView;
        const substantiallyCompletePoints = new FeatureLayer({
            title: "Substantially Complete Projects (points)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
            definitionExpression: layerQueries.substantiallyComplete.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    size: layerSymbols.pointSize,
                    color: layerQueries.substantiallyComplete.color,
                },
            },
            popupTemplate: epmPopup,
        });

        const groupSubstantiallyComplete = new GroupLayer({
            title: "Substantially Complete Projects",
            layers: [substantiallyCompleteLines, substantiallyCompletePoints],
            visibilityMode: "independent",
            visible: false
        });


        // All Projects
        // * This is the layer used for selection, and export to CSV
        let allProjectsLinesView;
        const allProjectsLines = new FeatureLayer({
            title: "All Projects (linear)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_All_Projects_as_Lines/MapServer/0",
            definitionExpression: layerQueries.allProjects.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    width: layerSymbols.lineWidth,
                    color: layerQueries.allProjects.color,
                },
            },
            popupTemplate: epmPopup,
        });

        let allProjectsPointsView;
        const allProjectsPoints = new FeatureLayer({
            title: "All Projects (points)",
            url: "https://maps.udot.utah.gov/central/rest/services/EPM/EPM_AllProjectsPoints/MapServer/0",
            definitionExpression: layerQueries.allProjects.definitionExpression,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    size: layerSymbols.pointSize,
                    color: layerQueries.allProjects.color,
                },
            },
            popupTemplate: epmPopup,
        });

        const groupAllProjects = new GroupLayer({
            title: "All Projects",
            layers: [allProjectsLines, allProjectsPoints],
            visibilityMode: "independent",
            visible: false,
        });


        // UDOT Milepost layers

        // labels for the mpLayer (mile posts)
        const mpLabel = new LabelClass({
            labelExpressionInfo: { expression: "'Mile ' + TextFormatting.NewLine + $feature.MP" },
            symbol: {
                type: "text",
                color: "black",
                haloSize: 1.5,
                haloColor: "white",
                font: {
                    family: "Ubuntu Mono",
                    size: 9,
                    weight: "bold",
                },
            },
            labelPlacement: "center-right",
            minScale: 25000,
        });

        const mpLabel10th = new LabelClass({
            labelExpressionInfo: { expression: "$feature.MP" },
            symbol: {
                type: "text",
                color: "black",
                haloSize: 0.8,
                haloColor: "white",
                font: {
                    family: "Ubuntu Mono",
                    size: 7,
                    weight: "bold",
                },
            },
            labelPlacement: "center-right",
            minScale: 25000,
        });

        const mpLayer = new FeatureLayer({
            title: "UDOT Mileposts",
            url: "https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/UDOTMileposts/FeatureServer/0",
            visible: true,
            minScale: 25000,
            labelingInfo: mpLabel,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    style: "square",
                    size: 8,
                    color: "white",
                    outline: {
                        width: 1,
                        color: "black",
                    }
                }
            },
        });

        // *** ToDo: create scale-dependent renderer for the 10th mile points
        // *** ToDo: create labels for the 10th mile points

        const mpLayer10th = new FeatureLayer({
            title: "UDOT Tenth Mile Reference Points",
            url: "https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/UDOTTenthMileRefPoints/FeatureServer/0",
            visible: true,
            minScale: 8000,
            labelingInfo: mpLabel10th,
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    style: "square",
                    size: 5,
                    color: "white",
                    outline: {
                        width: 0.5,
                        color: "black",
                    }
                }
            },
        });

        const groupMileposts = new GroupLayer({
            title: "UDOT Mileposts",
            layers: [mpLayer10th, mpLayer],
            visibilityMode: "independent",
            visible: true,
        })


        // ** Map and MapView
        const map = new Map({
            basemap: "arcgis-navigation",
            layers: [
                groupMileposts,
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
                    position: "top-right",
                }
            },
            highlightOptions: {
                color: "white",
                fillOpacity: 1,
                haloColor: new Color("#4d86c5"),   // UDOT blue
                haloOpacity: 0.8,
            },
        });

        // Stuff to do after the view is loaded
        view.when(() => {
            console.log("View Ready")

        });

        // set up the LayerViews for each FeatureLayer

        let featureLayerView;   // this is for the test code, below, to change appearance of
                                // non-selected features.  Delete later, when that's set on
                                // all featureLayerViews
        // planned
        view.whenLayerView(plannedLines).then((layer) => {
            plannedLinesView = layer;
            featureLayerView = plannedLinesView;
        });
        view.whenLayerView(plannedPoints).then((layer) => {
            plannedPointsView = layer;
        });

        // finished
        view.whenLayerView(finishedLines).then((layer) => {
            finishedLinesView = layer;
        });
        view.whenLayerView(finishedPoints).then((layer) => {
            finishedPointsView = layer;
        });

        // in design
        view.whenLayerView(inDesignLines).then((layer) => {
            inDesignLinesView = layer;
        });
        view.whenLayerView(inDesignPoints).then((layer) => {
            inDesignPointsView = layer;
        });

        // studies
        view.whenLayerView(studiesLines).then((layer) => {
            studiesLinesView = layer;
        });
        view.whenLayerView(studiesPoints).then((layer) => {
            studiesPointsView = layer;
        });

        // construction
        view.whenLayerView(constructionLines).then((layer) => {
            constructionLinesView = layer;
        });
        view.whenLayerView(constructionPoints).then((layer) => {
            constructionPointsView = layer;
        });

        // substantially complete
        view.whenLayerView(substantiallyCompleteLines).then((layer) => {
            substantiallyCompleteLinesView = layer;
        });
        view.whenLayerView(substantiallyCompletePoints).then((layer) => {
            substantiallyCompletePointsView = layer;
        });

        // all projects
        view.whenLayerView(allProjectsLines).then((layer) => {
            allProjectsLinesView = layer;
        });
        view.whenLayerView(allProjectsPoints).then((layer) => {
            allProjectsPointsView = layer;
        });


        // ** WIDGETS

        // LayerList widget
        let layerList = new LayerList({
            view: view,
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


        // Search widget
        // Additional FeatureLayers
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


        // Locate widget
        let locateWidget = new Locate({
            view: view,
            graphic: new Graphic({
                symbol: { type: "simple-marker" }
            })
        });
        view.ui.add(locateWidget, "top-left");


        // Tabbed Div widget
        // shows/hides the tabbed table Div
        tabDivToggle = () => {
            view.ui.add("btn-tabDiv", "top-right");
            const btn = document.getElementById("btn-tabDiv");
            const tabDiv = document.getElementById("tabDiv");

            // listen for clicks,  toggle visibility
            btn.addEventListener("click", () => {
                if (tabDiv.style.display === "none") {
                    tabDiv.style.display = "block";
                } else {
                    tabDiv.style.display = "none";
                }
            });
        };
        tabDivToggle();



        // ** FeatureTables
        // These go in the tabbed Calcite component widget at the bottom of the map

        // Configure field formats:
        //  "Number and Date formatting is not yet supported"
        //   https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-FeatureTable.html


        // Change the column labels to be more human-readable.
        const fieldConfigs = [
            {
                name: "PROJECT_ID",
                label: "Project ID",
            },
        ];

        // create the new FeatureTables based on the FeatureLayers created above
        const plannedTable = new FeatureTable({
            layer: plannedLines,
            view: view,
            container: document.getElementById("tabPlanned"),
            highlightOnRowSelectEnabled: false,
            // fieldConfigs: fieldConfigs,
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

        /*
         *  Functions for handling the selection of features from the map/tables,
         *  and exporting those selections to CSV files
         */


        // Handle Selected Features
        // sync the layerview effects and feature table selection
        // based on: https://developers.arcgis.com/javascript/latest/sample-code/highlight-features-by-geometry/

        // this array will keep track of the selected features' objectIDs
        // to sync the layerview effects and the feature table selection
        let selectedFeatures = [];

        // test on the plannedTable line layer first
        let featureTable = plannedTable; // Todo: register this event handler to all layers in the view


        // listen for the featureTable's 'selection-change' event
        featureTable.on("selection-change", (changes) => {

            console.log("Table selection change:", changes);

            changes.removed.forEach((item) => {   // loop through the removed objects array
                // if a feature is removed in the selection-change event, its objectID appears in the
                // changes.removed array

                const data = selectedFeatures.find((d) => {
                    // find() executes a function for each element in an array with parameter d
                    // and returns the location in the array of the first item that is true

                    // if the current item in the removed features array is in the selectedFeatures array
                    // return the objectId of that time, or return undefined
                    return d === item.objectId;
                });

                // use the splice() function to remove the item from the selectedFeatures array
                if (data) {
                    selectedFeatures.splice(selectedFeatures.indexOf(data), 1);
                }
            });

            changes.added.forEach((item) => {   // loop through the added objects array
                // add the objectId of each added item to the selectedFeatures array

                selectedFeatures.push(item.objectId);
            });

            // set a visual effect on the excluded items to make them appear subdued
            featureLayerView.effect = {
                filter: {
                    objectIds: selectedFeatures
                },
                excludedEffect: "blur(5px) grayscale(90%) opacity(40%)"
            };
        });


        // *** CSV Export
        // Save selected item(s) to a text file
        // https://www.youtube.com/watch?v=3gX2oM5CRbo

        let resultFeatures = [];

        function setupCSV() {
            // create UI button
            view.ui.add("btn-exportDiv", "top-right");
            const btn = document.getElementById("btn-exportDiv");  // FIX:  This is not in the correct spot on the UI
            btn.addEventListener("click", () => {
                alert("This is not yet functional");

                if (resultFeatures.length) {
                    // export to csv
                    const attrs = resultFeatures.map(a => a.attributes);
                    const headers = {};
                    const entry = attrs[0];

                    for (let key in entry) {
                        if (entry.hasOwnProperty(key)) {
                            headers[key] = key;
                        }
                    }

                    exportCSVFile(headers, attrs, "export");
                }
            });
        };
        setupCSV();








        // end of select feature handlers


        // CSV export functions
        // https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2
        function convertToCSV(objArray) {
            const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
            let str = "";

            for (let i = 0; i < array.length; i++) {
                let line = "";
                for (let index in array[i]) {
                    if (line != "") {
                        line += ",";
                    }
                    line += array[i][index];
                }
                str += line + "\r\n";
            }

            return str;
        }

        function exportCSVFile(headers, items, fileTitle) {
            if (headers) {
                items.unshift(headers);
            }

            // Convert Object to JSON
            let jsonObject = JSON.stringify(items);

            const csv = convertToCSV(jsonObject);

            const exportedFilenmae = fileTitle + ".csv" || "export.csv";

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

            if (navigator.msSaveBlob) {
                // IE 10+
                navigator.msSaveBlob(blob, exportedFilenmae);
            } else {
                const link = document.createElement("a");
                if (link.download !== undefined) {
                    // feature detection
                    // Browsers that support HTML5 download attribute
                    const url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", exportedFilenmae);
                    link.style.visibility = "hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        }

        // end of CSV Export



        // ** Asynchronous stuff
        // When first loading the map, watch for the view to finish updating
        // make any changes to the UI here:

        // there is probably an event that fires when this happens. Cant' find it yet.
        watchUtils.whenFalseOnce(view, "updating", () => {

            // wait for the View to finish updating
            console.log("View finished updating");

            // expand the LayerList widget
            layerListExpand.expand();

        });

});
