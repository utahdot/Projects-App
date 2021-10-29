
require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/FeatureTable",
    "esri/core/watchUtils",
    "esri/widgets/Legend",
    "esri/widgets/Expand",

], (
    esriConfig,
    Map,
    MapView,
    FeatureLayer,
    FeatureTable,
    watchUtils,
    Legend,
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


        const plannedLines = new FeatureLayer({
            title: "Planned Projects",
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

        const finishedLines = new FeatureLayer({
            title: "Finished Projects",
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

        const inDesignLines = new FeatureLayer({
            title: "In Design Projects",
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

        // view.when(() => { })

        const map = new Map({
            basemap: "arcgis-navigation",
            layers: [
                inDesignLines,
                finishedLines,
                plannedLines,
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

        // FeatureTables

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

});
