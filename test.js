var view, bldgResults, parcelResults, symbol;
require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/MapImageLayer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/tasks/IdentifyTask",
  "esri/tasks/support/IdentifyParameters",
  "dojo/on",
  "dojo/parser",
  "esri/Color",
  "dijit/registry",
  "dijit/form/Button",
  "dijit/layout/ContentPane",
  "dijit/layout/TabContainer",
  "dojo/domReady!",
], function (
  esriConfig,
  Map,
  MapView,
  MapImageLayer,
  SimpleFillSymbol,
  SimpleLineSymbol,
  IdentifyTask,
  IdentifyParameters,
  on,
  parser,
  Color,
  registry
) {
  esriConfig.request.proxyUrl = "proxy/proxy.ashx";
  parser.parse();
  var identifyTask, identifyParams;
  map = new Map({ basemap: "streets" });
  view = new MapView({
    container: "mapDiv",
    map: map,
    center: [-83.275, 42.573],
    zoom: 18,
  });
  view.when(initFunctionality);
  var landBaseLayer = new MapImageLayer({
    url: "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/BloomfieldHillsMichigan/Parcels/MapServer",
    opacity: 0.2,
  });
  view.popup.watch("visible", function (evt) {
    if (evt) {
      registry.byId("tabs").resize();
    }
  });
  map.add(landBaseLayer);
  function initFunctionality() {
    view.on("click", doIdentify);
    identifyTask = new IdentifyTask({
      url: "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/BloomfieldHillsMichigan/Parcels/MapServer",
    });
    identifyParams = new IdentifyParameters();
    identifyParams.tolerance = 3;
    identifyParams.returnGeometry = true;
    identifyParams.layerIds = [0, 2];
    identifyParams.layerOption = "all";
    identifyParams.width = view.width;
    identifyParams.height = view.height;
    //view.popup.resize(415, 200);
    view.popup.content = registry.byId("tabs").domNode;
    view.popup.title = "Identify Results";
    symbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new Color([255, 0, 0]),
        2
      ),
      new Color([255, 255, 0, 0.25])
    );
  }
  function doIdentify(event) {
    var tabs = document.getElementById("tabs");
    tabs.style.top = "";
    tabs.style.left = "";
    tabs.style.position = "";
    view.graphics.removeAll();
    identifyParams.geometry = event.mapPoint;
    identifyParams.mapExtent = view.extent;
    identifyTask.execute(identifyParams).then(function (idResults) {
      addToMap(idResults, event);
    });
  }
  function addToMap(idResults, event) {
    bldgResults = { displayFieldName: null, features: [] };
    parcelResults = { displayFieldName: null, features: [] };
    for (var i = 0, il = idResults.results.length; i < il; i++) {
      var idResult = idResults.results[i];
      if (idResult.layerId === 0) {
        if (!bldgResults.displayFieldName) {
          bldgResults.displayFieldName = idResult.displayFieldName;
        }
        bldgResults.features.push(idResult.feature);
      } else if (idResult.layerId === 2) {
        if (!parcelResults.displayFieldName) {
          parcelResults.displayFieldName = idResult.displayFieldName;
        }
        parcelResults.features.push(idResult.feature);
      }
    }
    registry
      .byId("bldgTab")
      .set("content", buildingResultTabContent(bldgResults));
    registry
      .byId("parcelTab")
      .set("content", parcelResultTabContent(parcelResults));
    view.popup.open({ location: event.mapPoint });
  }
  function buildingResultTabContent(results) {
    var template = "";
    var features = results.features;
    template += "<i>Total features returned: " + features.length + "</i>";
    template += "<table border='1'>";
    template += "<tr><th>ID</th><th>Address</th></tr>";
    var parcelId;
    var fullSiteAddress;
    for (var i = 0, il = features.length; i < il; i++) {
      parcelId = features[i].attributes["PARCELID"];
      fullSiteAddress = features[i].attributes["Full Site Address"];
      template += "<tr>";
      template +=
        "<td>" +
        parcelId +
        " <a href='#' onclick='showFeature(bldgResults.features[" +
        i +
        "]); return false;'>(show)</a></td>";
      template += "<td>" + fullSiteAddress + "</td>";
      template += "</tr>";
    }
    template += "</table>";
    return template;
  }
  function parcelResultTabContent(results) {
    var template = "";
    var features = results.features;
    template = "<i>Total features returned: " + features.length + "</i>";
    template += "<table border='1'>";
    template +=
      "<tr><th>ID</th><th>Year Built</th><th>School District</th><th>Description</th></tr>";
    var parcelIdNumber;
    var residentialYearBuilt;
    var schoolDistrictDescription;
    var propertyDescription;
    for (var i = 0, il = features.length; i < il; i++) {
      parcelIdNumber = features[i].attributes["Parcel Identification Number"];
      residentialYearBuilt = features[i].attributes["Residential Year Built"];
      schoolDistrictDescription =
        features[i].attributes["School District Description"];
      propertyDescription = features[i].attributes["Property Description"];
      template += "<tr>";
      template +=
        "<td>" +
        parcelIdNumber +
        " <a href='#' onclick='showFeature(parcelResults.features[" +
        i +
        "]); return false;'>(show)</a></td>";
      template += "<td>" + residentialYearBuilt + "</td>";
      template += "<td>" + schoolDistrictDescription + "</td>";
      template += "<td>" + propertyDescription + "</td>";
      template += "</tr>";
    }
    template += "</table>";
    return template;
  }
});
function showFeature(feature) {
  view.graphics.removeAll();
  feature.symbol = symbol;
  view.graphics.add(feature);
}
