
require([
    "esri/config",
    "esri/Map",
    "esri/Graphic",
    "esri/Color",
    "esri/views/MapView",
    "esri/core/watchUtils",
    "esri/geometry/Extent",
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
    Extent,
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

        // array tracks the selected feature objectIDs
        // uses: sync the selections on map and featureTables, and export features as CSV
        let selectedFeatures = [];


        /***********************************************************
         *  FeatureLayers, FeatureLayerViews, and their GroupLayers
         ***********************************************************/
        // set default symbology attributes
        const layerSymbols = {
            lineWidth: 2,
            pointSize: 6
        };

        // Popup Formatting and Styling
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

        // FeatureLayer attributes: SQL Query and Color
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


        /***********************************************************
         *  FeatureLayer instantiations
         ***********************************************************/

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
        // 1 mile and 1/10 mile points

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


        // UDOT Milepost featureLayers

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


        /***********************************************************
         *  Map and MapView
         ***********************************************************/

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


        /***********************************************************
         *  Asynchronous Stuff
         ***********************************************************/

        // view is loaded
        view.when(() => {
            console.log("View Ready");

            // Listen for the click on the view and select any associated row in the table
            view.on("immediate-click", (event) => {
                view.hitTest(event).then((response) => {
                    const candidate = response.results.find((result) => {
                        console.log(result.graphic.layer);
                        // return result.graphic && result.graphic.layer && result.graphic.layer === plannedLines;  // TEST on plannedLines
                    });
                // Select the rows of the clicked feature
                // candidate && plannedLines.selectRows(candidate.graphic);
            });

          });
        });

        // view (and all layers) finished updating after initial load
        watchUtils.whenFalseOnce(view, "updating", () => {
            // wait for the View to finish updating
            console.log("View finished updating");

            // expand the LayerList widget
            layerListExpand.expand();
        });


        /***********************************************************
         *  FeatureTables
         ***********************************************************/

        // create the new FeatureTables based on the FeatureLayers created above
        // add tables to the tabbed Calcite component widget

        // Configure field formats:
        //  "Number and Date formatting is not yet supported"
        //   https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-FeatureTable.html

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

        /***********************************************************
         *  Layer functions: Event listeners and asynch functions
         ***********************************************************/

        // array of objects (for looping over FeatureLayers and FeatureTables)
        var udotProjects = [
            {
                featLayer: plannedLines,
                layerView: plannedLinesView,
                featTable: plannedTable,
                groupLyr: groupPlanned,
            }, {
                featLayer: plannedPoints,
                layerView: plannedPointsView,
            }, {
                featLayer: finishedLines,
                layerView: finishedLinesView,
                featTable: finishedTable,
                groupLyr: groupFinished,
            }, {
                featLayer: finishedPoints,
                layerView: finishedPointsView,
            }, {
                featLayer: inDesignLines,
                layerView: inDesignLinesView,
                featTable: inDesignTable,
                groupLyr: groupInDesign,
            }, {
                featLayer: inDesignPoints,
                layerView: inDesignPointsView,
            }, {
                featLayer: studiesLines,
                layerView: studiesLinesView,
                featTable: studiesTable,
                groupLyr: groupStudies,
            }, {
                featLayer: studiesPoints,
                layerView: studiesPointsView,
            }, {
                featLayer: constructionLines,
                layerView: constructionLinesView,
                featTable: constructionTable,
                groupLyr: groupConstruction,
            }, {
                featLayer: constructionPoints,
                layerView: constructionPointsView,
            }, {
                featLayer: substantiallyCompleteLines,
                layerView: substantiallyCompleteLinesView,
                featTable: substantiallyCompleteTable,
                groupLyr: groupSubstantiallyComplete,
            }, {
                featLayer: substantiallyCompletePoints,
                layerView: substantiallyCompletePointsView,
            }, {
                featLayer: allProjectsLines,
                layerView: allProjectsLinesView,
                featTable: allProjectsTable,
                groupLyr: groupAllProjects,
            }, {
                featLayer: allProjectsPoints,
                layerView: allProjectsPointsView,
            },
        ];

        // ** LOOP THROUGH LAYERS and TABLES

        udotProjects.forEach((lyr) => {

            // set up the LayerViews for each FeatureLayer (asynch)

            view.whenLayerView(lyr.featLayer).then((layer) => {
                lyr.layerView = layer;
            });

            // Event Listeners: listen for when the view is updated
            // assign spatial filters to featureTables to only show projects in the view extent
            // TODO: Add a button or checkbox to toggle this function

            if (lyr.featTable) {
                lyr.featLayer.watch("loaded", () => {

                    watchUtils.whenFalse(view, "updating", () => {

                        // BUG? This is clearing the selected features whenever the table is updated

                        if (view.extent) {

                            lyr.featTable.filterGeometry = view.extent;
                            // "When modifying this property, the FeatureTable will completely refresh and re-query for all features."

                            console.log("featureTable geometry updated: ", lyr.featLayer.title);
                            console.log("selected: ", selectedFeatures);

                        }
                    });
                });

                // Event Listeners: listen for the 'selection-change' event on each featureTable
                // and update the selectedFeatures array with added/removed objectIDs

                lyr.featTable.on("selection-change", (changes) => {

                    console.log("Table selection change:", changes);

                    // loop through the changes.removed array
                    changes.removed.forEach((item) => {

                        const data = selectedFeatures.find((d) => {
                            // find() executes a function for each element in an array
                            // if the current item in the removed features array is in the selectedFeatures array
                            // return the objectId of that item, or return undefined

                            console.log("d:", d);

                            return d === item.objectId;
                        });

                        if (data) {
                            // use the splice() function to remove the item from the selectedFeatures array
                            selectedFeatures.splice(selectedFeatures.indexOf(data), 1);
                        }
                    });

                    changes.added.forEach((item) => {
                        // loop through the added objects array from the event
                        // add the objectId of each added item to the selectedFeatures array

                        selectedFeatures.push(item.objectId);
                    });

                    // at this point, the selectedFeatures array should contain the objectIDs of all
                    // selected items in all featureTables

                    console.log("selectedFeatures:", selectedFeatures);
                });
            }
        });


        // ** WIDGETS

        // Zoom to Utah Extent
        zoomToUtah = () => {
            view.ui.add("btn-zoomUtah", "top-left");
            const btn = document.getElementById("btn-zoomUtah");

            // listen for clicks, then update zoom extent
            btn.addEventListener("click", () => {
                view.extent = new Extent({  // state boundaries in lat/lon
                    xmin: -114,
                    ymin: 37,
                    xmax: -109,
                    ymax: 42,
                    spatialReference: {wkid: 4326},
                });
                view.zoom = view.zoom - 1;  // zoom out one zoom level
            });
        };
        zoomToUtah();

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




        /*
         *  Functions for exporting selectedFeatures array to CSV files
         */


        // CSV export functions
        // Based on: https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable


        function exportCSVFile(CSVstring, fileTitle) {

            const exportedFilenmae = fileTitle + ".csv" || "export.csv";
            const blob = new Blob([CSVstring], { type: "text/csv;charset=utf-8;" });

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


        function setupCSV() {
            // create UI button and the event handler

            view.ui.add("btn-exportDiv", "top-right");
            const btn = document.getElementById("btn-exportDiv");

            btn.addEventListener("click", () => {

                if (selectedFeatures.length) {
                    // set up the query on the allProjectsLines featureLayer
                    let query = allProjectsLines.createQuery();

                    query.returnGeometry = false;
                    query.where = `OBJECTID IN (${selectedFeatures})`;
                    query.outFields = ['*'];

                    allProjectsLines.queryFeatures(query)
                        .then(function(response) {

                            let projectsJSON = response.toJSON();     // convert the query response to JSON
                            let features = projectsJSON['features'];  // returns an array of feature objects
                            let fields = Object.keys(features[0]['attributes']);  // get the field names as an array of strings

                            // build the CSV string

                            // return the field value for a given key
                            // change null values to empty strings
                            let replacer = function(key, value) {return value === null ? '' : value}

                            let csv = features.map(function(row) {
                                // step through the features array
                                // each feature object is a row

                                return fields.map(function(fieldName) {
                                    // step through the array of field name strings
                                    // create an array of Stringified values, or empty strings for Nulls

                                    return JSON.stringify(row["attributes"][fieldName], replacer);

                                    // convert that array to a comma-separated string
                                }).join(',')

                                // return an array of strings
                                // each string is a row of field values, separated by a comma
                            })

                            // add header column data
                            // convert the array of header strings to a single string of comma-separated keys
                            // insert the string at the front of the array of rows
                            csv.unshift(fields.join(','));

                            // convert the entire array to a string
                            // separate each row with crlf
                            csv = csv.join('\r\n');

                            // send the string to the export file function
                            exportCSVFile(csv, "export");
                    });

                }
            });
        };
        setupCSV();

        // end of CSV Export

});
