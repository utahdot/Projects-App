
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

        esriConfig.apiKey = "AAPKc422669b0fbe46a2b56d697c4dd3384cYslFfknNEQtB3WgUxoiEsPrfUr2viZq0XYQqCSdSjTKTldmVSiccSYqaz_2hLWPa"

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
