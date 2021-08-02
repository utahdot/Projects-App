///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define(['dojo/_base/declare'
  , 'dojo/_base/lang'
  , 'dojo/_base/html'
  , 'dojo/on'
  , 'dojo/Deferred'
  , 'dijit/_WidgetsInTemplateMixin'
  , 'jimu/BaseWidget'
  , 'dijit/form/Select'
  , 'dijit/form/Button'
  , 'dijit/form/TextBox'
  , 'dijit/form/Textarea'
  , 'dijit/form/CheckBox'
  , 'dojo/data/ObjectStore'
  , 'dojo/store/Memory'
  , 'esri/graphic'
  , 'esri/tasks/query'
  , 'esri/tasks/QueryTask'
  , 'esri/geometry/Polygon'
  , 'esri/geometry/Polyline'
  , 'esri/geometry/Circle'
  , 'esri/geometry/Point'
  , 'esri/geometry/geometryEngine'
  , 'esri/layers/GraphicsLayer'
  , 'esri/Color'
  , 'esri/symbols/SimpleFillSymbol'
  , 'esri/symbols/SimpleLineSymbol'
  , 'esri/request'
  , 'esri/SpatialReference'
  , 'jimu/LayerInfos/LayerInfos'
  , 'esri/layers/FeatureLayer'
  , 'jimu/dijit/LoadingIndicator'
  ],
  function(declare, lang, html, on, Deferred, _WidgetsInTemplateMixin
      , BaseWidget, Select, Button, TextBox, Textarea
      , CheckBox, ObjectStore, Memory, Graphic, Query, QueryTask, Polygon
      , Polyline, Circle, Point, geometryEngine, GraphicsLayer, Color
      , SimpleFillSymbol, SimpleLineSymbol, esriRequest, SpatialReference
      , LayerInfos, FeatureLayer, LoadingIndicator) {
    var clazz = declare([BaseWidget, _WidgetsInTemplateMixin],
    { baseClass: 'jimu-widget-zoomer'
    , tempZoomerLayer: null
    , legislativeDistricts: null
    , zoomType: null
    , timeout: null
    , listMaintenanceStations: null
    , zoomerPolygon: null
    , zoomerQuery: null
    , postCreate: function()
      {
        this.inherited(arguments);
        if (!this.loading) {
          this.loading = new LoadingIndicator();
        }
        this.loading.placeAt(this.domNode);
        this._initializeDetailsCounty();
        this._initializeDetailsBoundary();
        this._initializeDetailsCity();
        this._initializeDetailsLegislative();
        if(this.config.udotPmAndRe)
        {
          this._initializeDetailsProject();
        }
        this._initializeDetailsDistricts();
        this._initializeDetailsRoutes();
        
        if(this.config.interfaceAttributeTable)
        {
          html.setStyle(this.interfaceAttributeTable, 'display', 'block');
        }
        
        html.setStyle(this.zoomerTypeCity, 'display', 'block');
        html.setStyle(this.zoomerTypeCounty, 'display', 'block');
        html.setStyle(this.zoomerTypeBoundary, 'display', 'block');
        html.setStyle(this.zoomerTypeLegislative, 'display', 'block');
        if(this.config.udotPmAndRe)
        {
          html.setStyle(this.zoomerTypeProject, 'display', 'block');
        }
        html.setStyle(this.zoomerTypeDistrict, 'display', 'block');
        html.setStyle(this.zoomerTypeRoutes, 'display', 'block');
        this.loading.hide();
      }
      
    , onOpen: function()
      {
        if(this.tempZoomerLayer)
          this.tempZoomerLayer.show();
      }
      
    , onClose: function()
      {
        this._hideMessage();
        this._hideInfoWindow();
      }
      
    , startup: function()
      {
        this.inherited(arguments);
        this._setDetailsHideAll();
        html.setStyle(this.zoomerDefault, 'display', 'block');
        this._resetAndAddTempZoomerLayer();
        this._bindEvents();
      }
      
    , _resetAndAddTempZoomerLayer: function()
      {
        this._removeTempZoomerLayer();
        this.tempZoomerLayer = new GraphicsLayer();
        this.map.addLayer(this.tempZoomerLayer);
      }
      
    , _removeTempZoomerLayer: function()
      {
        if(this.tempZoomerLayer)
          this.map.removeLayer(this.tempZoomerLayer);
        this.tempZoomerLayer = null;
      }
      
    , _setDetailsHideAll: function()
      {
        html.setStyle(this.zoomerDefault, 'display', 'none');
        html.setStyle(this.zoomerCountyDetails, 'display', 'none');
        html.setStyle(this.zoomerBoundaryDetails, 'display', 'none');
        html.setStyle(this.zoomerCityDetails, 'display', 'none');
        html.setStyle(this.zoomerLegislativeDetails, 'display', 'none');
        html.setStyle(this.zoomerProjectDetails, 'display', 'none');
        html.setStyle(this.zoomerDistrictDetails, 'display', 'none');
        html.setStyle(this.zoomerRoutesDetails, 'display', 'none');
        html.setStyle(this.zoomerShareDetails, 'display', 'none');
      }
      
    , _displayMessage: function(p_message, p_title, p_timeout)
      {
        var l_timeout = 5000;
        if(typeof p_timeout !== 'undefined')
          l_timeout = p_timeout;
        if(this.timeout)
        {
          window.clearTimeout(this.timeout);
          this.timeout = null;
        }
        this.zoomerMessage.innerHTML = '';
        if(typeof p_title !== 'undefined' && p_title.length)
          this.zoomerMessage.innerHTML = '<b>' + p_title + '</b>: ';
        if(typeof p_message !== 'undefined' && p_message.length)
          this.zoomerMessage.innerHTML += p_message;
        html.setStyle(this.zoomerMessage, 'display', 'block');
        
        this.timeout = window.setTimeout(lang.hitch(this, function()
          {
            this._hideMessage();
          }), l_timeout);
      }
      
    , _hideMessage: function()
      {
        this.zoomerMessage.innerHTML = '';
        html.setStyle(this.zoomerMessage, 'display', 'none');
      }
      
    , _hideInfoWindow: function()
      {
        if(this.map && this.map.infoWindow)
        {
          this.map.infoWindow.hide();
          this.map.infoWindow.setTitle('');
          this.map.infoWindow.setContent('');
        }
      }
      
    , _initializeDetailsCounty: function()
      {
      }
      
    , _initializeDetailsBoundary: function()
      {
        /* Urban Area */
        this.loading.show();
        var l_url = "//maps.udot.utah.gov/arcgis/rest/"
          + "services/uplan/Boundaries/MapServer/2";
        var queryTask = new QueryTask(l_url);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = [ 'NAME' ];
        query.where = '1=1';
        //query.where = 'NAME IS NOT NULL';
        
        queryTask.execute(query, lang.hitch(this, function(results)
          {
            var l_store_result = new Array();
            for(i=0; i<results.features.length; i++)
            {
              l_store_result.push(results.features[i].attributes['NAME']);
            }
            l_store_result.sort();
            l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item != ary[pos - 1];
              });
            l_store_data = new Array();
            if(l_store_result.length)
            {
              for(i=0; i<l_store_result.length; i++)
              {
                l_store_data.push(
                  { value: l_store_result[i]
                  , label: l_store_result[i]
                  });
              }
              this.selectBoundaryUA.addOption(l_store_data);
            }
            this.loading.hide();
          }));
        /* Urban Cluster / Small Urban */
        this.loading.show();
        var l_url = "//maps.udot.utah.gov/arcgis/rest/"
          + "services/uplan/Boundaries/MapServer/3";
        var queryTask = new QueryTask(l_url);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = [ 'NAME' ];
        query.where = '1=1';
        //query.where = 'NAME IS NOT NULL';
        
        queryTask.execute(query, lang.hitch(this, function(results)
          {
            var l_store_result = new Array();
            for(i=0; i<results.features.length; i++)
            {
              l_store_result.push(results.features[i].attributes['NAME']);
            }
            l_store_result.sort();
            l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item != ary[pos - 1];
              });
            l_store_data = new Array();
            if(l_store_result.length)
            {
              for(i=0; i<l_store_result.length; i++)
              {
                l_store_data.push(
                  { value: l_store_result[i]
                  , label: l_store_result[i]
                  });
              }
              this.selectBoundaryUCSU.addOption(l_store_data);
            }
            this.loading.hide();
          }));
        /* Metropolitan Planning Organization */
        this.loading.show();
        var l_url = "//maps.udot.utah.gov/arcgis/rest/"
          + "services/uplan/Boundaries/MapServer/4";
        var queryTask = new QueryTask(l_url);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = [ 'NAME' ];
        query.where = '1=1';
        //query.where = 'NAME IS NOT NULL';
        
        queryTask.execute(query, lang.hitch(this, function(results)
          {
            var l_store_result = new Array();
            for(i=0; i<results.features.length; i++)
            {
              l_store_result.push(results.features[i].attributes['NAME']);
            }
            l_store_result.sort();
            l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item != ary[pos - 1];
              });
            l_store_data = new Array();
            if(l_store_result.length)
            {
              for(i=0; i<l_store_result.length; i++)
              {
                l_store_data.push(
                  { value: l_store_result[i]
                  , label: l_store_result[i]
                  });
              }
              this.selectBoundaryMPO.addOption(l_store_data);
            }
            this.loading.hide();
          }));
        /* Rural Planning Organization */
        this.loading.show();
        var l_url = "//maps.udot.utah.gov/arcgis/rest/"
          + "services/uplan/Boundaries/MapServer/5";
        var queryTask = new QueryTask(l_url);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = [ 'NAME' ];
        query.where = '1=1';
        //query.where = 'NAME IS NOT NULL';
        queryTask.execute(query, lang.hitch(this, function(results)
          {
            var l_store_result = new Array();
            for(i=0; i<results.features.length; i++)
            {
              l_store_result.push(results.features[i].attributes['NAME']);
            }
            l_store_result.sort();
            l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item != ary[pos - 1];
              });
            l_store_data = new Array();
            if(l_store_result.length)
            {
              for(i=0; i<l_store_result.length; i++)
              {
                l_store_data.push(
                  { value: l_store_result[i]
                  , label: l_store_result[i]
                  });
              }
              this.selectBoundaryRPO.addOption(l_store_data);
            }
            this.loading.hide();
          }));
      }
      
    , _initializeDetailsCity: function()
      {
        this.loading.show();
        esri.config.defaults.io.proxyUrl = this.config.proxyUrl;
        var l_url = this.config.AGRCAPIURL + 'search/'
          + this.config.AGRCAPICityFeatureClass
          + '/NAME,FIPS'
          + '?apiKey=' + this.config.AGRCAPIKey;
        var l_request = esriRequest
          (
            { url: l_url
            , handleAs: "json"
            }
          , { useProxy: this.config.proxyAGRC }
          );
        l_request.then
          ( lang.hitch(this, function(response)
            {
              var l_store_result = new Array();
              for(i=0; i<response.result.length; i++)
              {
                l_store_result.push(
                  { label: response.result[i].attributes.name
                  , value: response.result[i].attributes.fips
                  });
              }
              // Sort the array. Because it contains object, the compare
              // function needs to be included as well.
              l_store_result.sort(function(a,b){return a.label>b.label});
              // Remove duplicates. Without this, e.g. Bluffdale will show up
              // twice because it straddles two counties.
              l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item.label != ary[pos-1].label;
              });
              // Add the array to the city selection dropdown.
              this.selectCity.addOption(l_store_result);
              this.loading.hide();
            })
          , lang.hitch(this, function(error)
            {
              console.log(error);
              this.loading.hide();
            })
          );
      }
      
    , _initializeDetailsLegislative: function()
      {
        this.loading.show();
        esri.config.defaults.io.proxyUrl = this.config.proxyUrl;
        var l_url = "//maps.udot.utah.gov/imap/"
          + "COMMON.map_pkg.json_politicaldistricts";
        var l_request = esriRequest
          (
            { url: l_url
            , handleAs: "json"
            }
          , { useProxy: this.config.proxyMapsUDOT }
          );
        l_request.then
          ( lang.hitch(this, function(response)
            {
              this.legislativeDistricts = response.districts;
              var l_store_data = new Array();
              for(i=0; i<this.legislativeDistricts.length; i++)
              {
                l_store_data.push(
                  { value: i
                  , label: this.legislativeDistricts[i].display
                  });
              }
              this.selectLegislative.addOption(l_store_data);
              this.loading.hide();
            })
          , lang.hitch(this, function(error)
            {
              console.error(error);
              this.loading.hide();
            })
          );
      }
      
    , _initializeDetailsProject: function()
      {
        this.loading.show();
        var l_url = "//maps.udot.utah.gov/arcgis/rest/"
          + "services/EPM_AllProjects/MapServer/0";
        var queryTask = new QueryTask(l_url);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields =
          [ 'PROJECT_MANAGER'
          , 'UDOT_RESIDENT_ENGINEER'
          , 'CNSLT_RESIDENT_ENGINEER'
          ];
        query.where = '1=1';
        queryTask.execute(query, lang.hitch(this, function(results)
          {
            var l_store_result = new Array();
            for(i=0; i<results.features.length; i++)
            {
              l_store_result.push(
                results.features[i].attributes['PROJECT_MANAGER']
              );
            }
            l_store_result.sort();
            l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item != ary[pos - 1];
              });
            l_store_data = new Array();
            if(l_store_result.length)
            {
              for(i=0; i<l_store_result.length; i++)
              {
                l_store_data.push(
                  { value: l_store_result[i]
                  , label: l_store_result[i]
                  });
              }
              this.selectProjectProgramManager.addOption(l_store_data);
            }
            
            l_store_result = new Array();
            for(i=0; i<results.features.length; i++)
            {
              l_store_result.push(
                results.features[i].attributes['UDOT_RESIDENT_ENGINEER']
              );
            }
            l_store_result.sort();
            l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item != ary[pos - 1];
              });
            l_store_data = new Array();
            if(l_store_result.length)
            {
              for(i=0; i<l_store_result.length; i++)
              {
                l_store_data.push(
                  { value: l_store_result[i]
                  , label: l_store_result[i]
                  });
              }
              this.selectProjectUDOTResidentEngineer.addOption(l_store_data);
            }
            
            l_store_result = new Array();
            for(i=0; i<results.features.length; i++)
            {
              l_store_result.push(
                results.features[i].attributes['CNSLT_RESIDENT_ENGINEER']
              );
            }
            l_store_result.sort();
            l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item != ary[pos - 1];
              });
            l_store_data = new Array();
            if(l_store_result.length)
            {
              for(i=0; i<l_store_result.length; i++)
              {
                l_store_data.push(
                  { value: l_store_result[i]
                  , label: l_store_result[i]
                  });
              }
              this.selectProjectConsultantResidentEngineer.addOption
                ( l_store_data );
            }
            this.loading.hide();
          }));
      }
      
    , _initializeDetailsDistricts: function()
      {
        this.loading.show();
        var l_url = "//services.arcgis.com/pA2nEVnB6tquxgOW/arcgis/rest/"
          + "services/ShedPolygonsByRoutes/FeatureServer/0";
        var queryTask = new QueryTask(l_url);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = [ 'CREW_NAME' ];
        query.where = '1=1';
        queryTask.execute(query, lang.hitch(this, function(results)
          {
            var l_store_result = new Array();
            for(i=0; i<results.features.length; i++)
            {
              l_store_result.push(results.features[i].attributes['CREW_NAME']);
            }
            l_store_result.sort();
            l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item != ary[pos - 1];
              });
            l_store_data = new Array();
            if(l_store_result.length)
            {
              for(i=0; i<l_store_result.length; i++)
              {
                l_store_data.push(
                  { value: l_store_result[i]
                  , label: l_store_result[i]
                  });
              }
              this.listMaintenanceStations = l_store_data;
            }
            this._populateMaintenanceStations();
            this.loading.hide();
          }));
      }
      
    , _populateMaintenanceStations: function()
      {
        var l_selectedRegion = dijit.byId('selectDistrict').get('value');
        var l_options = new Array();
        l_options.push(
          { value: l_selectedRegion
          , label: "-- Zoom to Region --"
          });
        if(this.listMaintenanceStations && this.listMaintenanceStations.length)
        {
          for(i=0; i<this.listMaintenanceStations.length; i++)
          {
            if(this.listMaintenanceStations[i].value[0] === l_selectedRegion)
              l_options.push(this.listMaintenanceStations[i]);
          }
          while(this.selectStation.options.length)
          {
            this.selectStation.removeOption(0);
          }
        }
        this.selectStation.addOption(l_options);
        this.selectStation.reset();
      }
      
    , _initializeDetailsRoutes: function()
      {
        this.loading.show();
        var l_url = "//maps.udot.utah.gov/arcgis/rest/"
          + "services/LRSRoutes/MapServer/0";
        var queryTask = new QueryTask(l_url);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = [ 'ROUTE_NAME' ];
        query.where = "ROUTE_TYPE = 'M' "
          + "AND ROUTE_NAME LIKE '0%' "
          + "AND ROUTE_DIR IN ('P', 'N')";
        queryTask.execute(query, lang.hitch(this, function(results)
          {
            var l_store_result = new Array();
            for(i=0; i<results.features.length; i++)
            {
              l_store_result.push(results.features[i].attributes['ROUTE_NAME']);
            }
            l_store_result.sort();
            l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item != ary[pos - 1];
              });
            var l_store_data = new Array();
            if(l_store_result.length)
            {
              l_store_data.push(
                { value: ''
                , label: '--- Route ---'
                });
              for(i=0; i<l_store_result.length; i++)
              {
                l_store_data.push(
                  { value: l_store_result[i]
                  , label: l_store_result[i]
                  });
              }
              while(this.selectRoutes.options.length)
              {
                this.selectRoutes.removeOption(0);
              }
              this.selectRoutes.addOption(l_store_data);
            }
            this.loading.hide();
          }));
      }
      
    , _changedRoute: function()
      {
        var selectRoute = dijit.byId('selectRoutes');
        var selectInterchange = dijit.byId('selectInterchange');
        var selectRamp = dijit.byId('selectRamp');
        selectRamp.set('value', '');
        selectInterchange.set('value', '');
        if(selectRoute.get('value'))
        {
          this._populateRouteInterchanges();
        }
        else
        {
          html.setStyle(this.routeInterchangeRow, 'display', 'none');
          html.setStyle(this.routeRampRow, 'display', 'none');
        }
      }
      
    , _changedInterchange: function()
      {
        var selectInterchange = dijit.byId('selectInterchange');
        if(selectInterchange.get('value'))
        {
          this._populateRouteRamps();
        }
        else
        {
          html.setStyle(this.routeRampRow, 'display', 'none');
        }
      }
      
    , _changedRamp: function()
      {
      }
      
    , _filterRoutesByPolygon: function()
      {
        this.loading.show();
        var l_url = "//maps.udot.utah.gov/arcgis/rest/"
          + "services/LRSRoutes/MapServer/0";
        var queryTask = new QueryTask(l_url);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = [ 'ROUTE_NAME' ];
        query.geometry = this.zoomerPolygon;
        query.where = "ROUTE_TYPE = 'M' "
          + "AND ROUTE_NAME LIKE '0%' "
          + "AND ROUTE_DIR IN ('P', 'N')";
        queryTask.execute(query, lang.hitch(this, function(results)
          {
            var l_store_result = new Array();
            for(i=0; i<results.features.length; i++)
            {
              l_store_result.push(results.features[i].attributes['ROUTE_NAME']);
            }
            l_store_result.sort();
            l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item != ary[pos - 1];
              });
            var l_store_data = new Array();
            if(l_store_result.length)
            {
              l_store_data.push(
                { value: ''
                , label: '--- Route ---'
                });
              for(i=0; i<l_store_result.length; i++)
              {
                l_store_data.push(
                  { value: l_store_result[i]
                  , label: l_store_result[i]
                  });
              }
              while(this.selectRoutes.options.length)
              {
                this.selectRoutes.removeOption(0);
              }
              this.selectRoutes.addOption(l_store_data);
            }
            this.loading.hide();
          }));
      }
    
    , _populateRouteInterchanges: function()
      {
        this.loading.show();
        var selectRoute = dijit.byId('selectRoutes');
        var l_url = "//maps.udot.utah.gov/arcgis/rest/"
          + "services/LRSRoutes/MapServer/0";
        var queryTask = new QueryTask(l_url);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = [ 'FULL_ROUTE_NAME' ];
        query.where = "ROUTE_TYPE = 'R' "
          + "AND ROUTE_NAME LIKE '0%' "
          + "AND ROUTE_DIR IN ('P', 'N') "
          + "AND FULL_ROUTE_NAME LIKE '" + selectRoute.get('value') + "%'";
        queryTask.execute(query, lang.hitch(this, function(results)
          {
            var l_store_result = new Array();
            for(i=0; i<results.features.length; i++)
            {
              l_store_result.push(
                results.features[i].attributes['FULL_ROUTE_NAME'].substr(0, 9)
              );
            }
            l_store_result.sort();
            l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item != ary[pos - 1];
              });
            var l_store_data = new Array();
            if(l_store_result.length)
            {
              l_store_data.push(
                { value: ''
                , label: '--- Interchange ---'
                });
              for(i=0; i<l_store_result.length; i++)
              {
                l_store_data.push(
                  { value: l_store_result[i]
                  , label: l_store_result[i]
                  });
              }
              while(this.selectInterchange.options.length)
              {
                this.selectInterchange.removeOption(0);
              }
              this.selectInterchange.addOption(l_store_data);
              if(l_store_data.length)
              {
                html.setStyle
                  ( this.routeInterchangeRow
                  , 'display'
                  , 'table-row'
                  );
                html.setStyle(this.routeRampRow, 'display', 'none');
              }
            }
            else
            {
              html.setStyle(this.routeInterchangeRow, 'display', 'none');
              html.setStyle(this.routeRampRow, 'display', 'none');
            }
            this.loading.hide();
          }));          
      }
      
    , _populateRouteRamps: function()
      {
        this.loading.show();
        var selectInterchange = dijit.byId('selectInterchange');
        var l_url = "//maps.udot.utah.gov/arcgis/rest/"
          + "services/LRSRoutes/MapServer/0";
        var queryTask = new QueryTask(l_url);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = [ 'FULL_ROUTE_NAME' ];
        query.where = "ROUTE_TYPE = 'R' "
          + "AND ROUTE_DIR IN ('P', 'N') "
          + "AND FULL_ROUTE_NAME LIKE '"
          + selectInterchange.get('value').substr(0, 9) + "%'";
        queryTask.execute(query, lang.hitch(this, function(results)
          {
            var l_store_result = new Array();
            for(i=0; i<results.features.length; i++)
            {
              l_store_result.push(
                results.features[i].attributes['FULL_ROUTE_NAME']
              );
            }
            l_store_result.sort();
            l_store_result = l_store_result.filter(function(item, pos, ary)
              {
                return !pos || item != ary[pos - 1];
              });
            var l_store_data = new Array();
            if(l_store_result.length)
            {
              l_store_data.push(
                { value: ''
                , label: '--- Ramp ---'
                });
              for(i=0; i<l_store_result.length; i++)
              {
                l_store_data.push(
                  { value: l_store_result[i]
                  , label: l_store_result[i].substr(9)
                  });
              }
              while(this.selectRamp.options.length)
              {
                this.selectRamp.removeOption(0);
              }
              this.selectRamp.addOption(l_store_data);
              if(l_store_data.length)
                html.setStyle(this.routeRampRow, 'display', 'table-row');
            }
            else
            {
              html.setStyle(this.routeRampRow, 'display', 'none');
            }
            this.loading.hide();
          }));
      }
    
    , _zoomToCounty: function()
      {
        this.loading.show();
        esri.config.defaults.io.proxyUrl = this.config.proxyUrl;
        var selectCounty = dijit.byId('selectCounty');
        var l_url = this.config.AGRCAPIURL + 'search/'
          + this.config.AGRCAPICountyFeatureClass
          + '/NAME,FIPS,shape@'
          + '?predicate=FIPS%3D' + selectCounty.get('value')
          + '&spatialReference=' + this.config.spatialReference
          + '&apiKey=' + this.config.AGRCAPIKey;
        var l_request = esriRequest
          ( { url: l_url
            , handleAs: "json" }
          , { useProxy: this.config.proxyAGRC }
          );
        l_request.then
          ( lang.hitch(this, function(response)
            {
              if(response.result.length && response.result[0].geometry)
              {
                if(response.result && response.status === 200)
                {
                  var l_polygon = new Polygon(response.result[0].geometry);
                  this._zoomToPolygon(l_polygon);
                  this._displayMessage
                    ( response.result[0].attributes.name, 'County');
                }
                this.loading.hide();
              }
            })
          , lang.hitch(this, function(error)
            {
              console.log(error)
              this.loading.hide();
            })
          );
      }
      
    , _zoomToBoundary: function()
      {
        this.loading.show();
        var l_validSelection = false;
        var selectBoundaryUA = dijit.byId('selectBoundaryUA');
        var selectBoundaryUCSU = dijit.byId('selectBoundaryUCSU');
        var selectBoundaryMPO = dijit.byId('selectBoundaryMPO');
        var selectBoundaryRPO = dijit.byId('selectBoundaryRPO');
        var l_url = "//maps.udot.utah.gov/arcgis/rest/"
          + "services/uplan/Boundaries/MapServer/";
        var l_boundary = { "title": '', "message": '' };
        var query = new Query();
        query.returnGeometry = true;
        query.outSpatialReference = 
          new SpatialReference(this.config.spatialReference);
        if(this.radioBoundaryUA.checked
          && selectBoundaryUA.get('value').length)
        {
          l_url += '2';
          query.where = "NAME = '" + selectBoundaryUA.get('value') + "'";
          l_boundary.title = this.nls.urbanArea;
          l_boundary.message = selectBoundaryUA.get('value');
          l_validSelection = true;
        }
        else if(this.radioBoundaryUCSU.checked
          && selectBoundaryUCSU.get('value').length)
        {
          l_url += '3';
          query.where = "NAME = '" + selectBoundaryUCSU.get('value') + "'";
          l_boundary.title = this.nls.urbanClusterSmallUrban;
          l_boundary.message = selectBoundaryUCSU.get('value');
          l_validSelection = true;
        }
        else if(this.radioBoundaryMPO.checked
          && selectBoundaryMPO.get('value').length)
        {
          l_url += '4';
          query.where = "NAME = '" + selectBoundaryMPO.get('value') + "'";
          l_boundary.title = this.nls.metropolitanPlanningOrganization;
          l_boundary.message = selectBoundaryMPO.get('value');
          l_validSelection = true;
        }
        else if(this.radioBoundaryRPO.checked
          && selectBoundaryRPO.get('value').length)
        {
          l_url += '5';
          query.where = "NAME = '" + selectBoundaryRPO.get('value') + "'";
          l_boundary.title = this.nls.ruralPlanningOrganization;
          l_boundary.message = selectBoundaryRPO.get('value');
          l_validSelection = true;
        }
        var queryTask = new QueryTask(l_url);
        if(l_validSelection)
        {
          queryTask.execute(query, lang.hitch(this, function(results)
            {
              if(results.features.length && results.features[0].geometry)
              {
                var l_polygon = new Polygon(results.features[0].geometry);
                this._zoomToPolygon(l_polygon);
                this._displayMessage(l_boundary.message, l_boundary.title);
              }
              this.loading.hide();
            }));
        }
        else
        {
          this._displayMessage('Select something');
          this.loading.hide();
        }
      }
      
    , _zoomToCity: function()
      {
        this.loading.show();
        esri.config.defaults.io.proxyUrl = this.config.proxyUrl;
        var selectCity = dijit.byId('selectCity');
        var textAddress = dijit.byId('textAddress');
        if(!textAddress.get('value').length)
        {
          var l_url = this.config.AGRCAPIURL + 'search/'
            + this.config.AGRCAPICityFeatureClass
            + '/NAME,FIPS,shape@'
            + '?predicate=FIPS%3D' + selectCity.get('value')
            + '&spatialReference=' + this.config.spatialReference
            + '&apiKey=' + this.config.AGRCAPIKey;
          var l_request = esriRequest
            ( { url: l_url
              , handleAs: "json" }
            , { useProxy: this.config.proxyAGRC }
            );
          l_request.then
            ( lang.hitch(this, function(response)
              {
                if(response.result.length && response.result[0].geometry)
                {
                  var l_polygon;
                  // Sometime, cities straddle two counties, e.g. Bluffdale
                  // and so, two (or theoretically more) results are returned.
                  // In that case, create polygons for each and merge them.
                  // In most cases, only one geometry is returned, so the data
                  // needs not be wrangled and a simpler single statement is
                  // enough.
                  if(response.result.length > 1)
                  {
                    var l_temp_polygon = new Array();
                    for(var i=0; i<response.result.length; i++)
                    {
                      l_temp_polygon.push(
                        new Polygon(response.result[i].geometry)
                      );
                    }
                    l_polygon = geometryEngine.union(l_temp_polygon);
                  }
                  else
                    l_polygon = new Polygon(response.result[0].geometry);
                  this._zoomToPolygon(l_polygon);
                  if(this.config.eastereggProvo
                    && this.nls.messageProvo
                    && this.nls.messageProvo.length
                    && response.result[0].attributes.name === 'Provo')
                  {
                    this._displayMessage(this.nls.messageProvo);
                  }
                  else
                  {
                    this._displayMessage
                      ( response.result[0].attributes.name, 'City');
                  }
                }
                this.loading.hide();
              })
            , lang.hitch(this, function(error)
              {
                console.log(error);
                this.loading.hide();
              })
            );
        }
        else
        {
          var l_cityname;
          var l_cityoptions = selectCity.getOptions();
          for(i=0; i<l_cityoptions.length; i++)
          {
            if(l_cityoptions[i].selected)
              l_cityname = l_cityoptions[i].label;
          }
          
/*
          var l_url = this.config.AGRCAPIURL + 'geocode/'
            + textAddress.get('value') + '/' + l_cityname
            + '?spatialReference=' + this.config.spatialReference
            + '&format=esrijson'
            + '&apiKey=' + this.config.AGRCAPIKey;
*/
          var l_url = '//maps.udot.utah.gov/imap/'
            + 'COMMON.map_pkg.json_addressgeocode'
            + '?p_streetaddress=' + textAddress.get('value')
            + '&p_zipcodeorcity=' + l_cityname;
          var l_request = esriRequest
            ( { url: l_url
              , handleAs: "json" }
            , { useProxy: this.config.proxyMapsUDOT }
            );
          l_request.then
            ( lang.hitch(this, function(response)
              {
                if(response.errorcode === -20102)
                {
                  this._displayMessage('No address candidate found with a score of 65 or better', 'City Address');
                }
                if(!response.errorcode && response.total >= 1)
                {
                  //var l_point = new Point(response.result.geometry);
                  var l_point = new Point
                    ( response.addresses[0].x
                    , response.addresses[0].y
                    , new SpatialReference({ wkid: 26912 })
                    );
                  var l_score = response.addresses[0].score;
                  var l_matchaddress = response.addresses[0].matchaddress;
                  var l_radius = 500 * 1/(l_score-60);
                  var l_circle = new Circle(l_point, {"radius": l_radius});
                  this._zoomToPolygon(l_circle);
                  this._displayMessage
                    ( l_matchaddress + ', Score ' 
                    + l_score + '%', 'City Address'
                    );
                }
                this.loading.hide();
              })
            , lang.hitch(this, function(error)
              {
                var l_response = 'Address not found!';
                if(error.responseText)
                {
                  try {
                    l_response = JSON.parse(error.responseText);
                  }
                  catch(e)
                  { }
                }
                this._displayMessage(l_response.message, 'City Address');
                this.loading.hide();
              })
            );
        }
      }
      
    , _zoomToLegislative: function()
      {
        this.loading.show();
        esri.config.defaults.io.proxyUrl = this.config.proxyUrl;
        var selectLeg = dijit.byId('selectLegislative');
        var l_url = this.config.AGRCAPIURL + 'search/';
        switch(this.legislativeDistricts[selectLeg.get('value')].house)
        {
          case 'House':
            l_url += this.config.AGRCAPIStateHouseFeatureClass
              + '/shape@'
              + '?predicate=DIST%3D'
              + this.legislativeDistricts[selectLeg.get('value')].district_id;
            break;
          case 'Senate':
            l_url += this.config.AGRCAPIStateSenateFeatureClass
              + '/shape@'
              + '?predicate=DIST%3D'
              + this.legislativeDistricts[selectLeg.get('value')].district_id;
            break;
          case 'USCongress':
            l_url += this.config.AGRCAPIUSCongressFeatureClass
              + '/shape@'
              + '?predicate=DISTRICT%3D'
              + this.legislativeDistricts[selectLeg.get('value')].district_id;
            break;
          default:
            console.log('Unsure what kind of district to pick');
            return;
        }
        l_url += '&spatialReference=' + this.config.spatialReference
          + '&apiKey=' + this.config.AGRCAPIKey;
        var l_request = esriRequest
          ( { url: l_url
            , handleAs: "json" }
          , { useProxy: this.config.proxyAGRC }
          );
        l_request.then
          ( lang.hitch(this, function(response)
            {
              if(response.result.length && response.result[0].geometry)
              {
                if(response.result && response.status === 200)
                {
                  var l_polygon = new Polygon(response.result[0].geometry);
                  this._zoomToPolygon(l_polygon);
                  this._displayMessage
                    ( this.legislativeDistricts[selectLeg.get('value')].display
                    , 'Legislature'
                    );
                }
                this.loading.hide();
              }
            })
          , lang.hitch(this, function(error)
            {
              console.log(error)
              this.loading.hide();
            })
          );
      }
      
    , _zoomToProject: function()
      {
        this.loading.show();
        var l_selectProgramManager
          , l_selectUDOTResidentEngineer
          , l_selectConsultantResidentEngineer;
        var l_url = "//maps.udot.utah.gov/arcgis/rest/"
          + "services/EPM_AllProjects/MapServer/0";
        var queryTask = new QueryTask(l_url);
        var query = new Query();
        var l_display, l_header;
        query.returnGeometry = true;
        query.outSpatialReference =
          new SpatialReference(this.config.spatialReference);
        if(this.radioProgramManager.checked
          && this.selectProjectProgramManager.get('value'))
        {
          l_selectProgramManager =
            this.selectProjectProgramManager.get('value');
          query.where = "PROJECT_MANAGER = '" + l_selectProgramManager + "'";
          l_display = l_selectProgramManager;
          l_header = 'Program Manager';
        }
        else if(this.radioUDOTResidentEngineer.checked
          && this.selectProjectUDOTResidentEngineer.get('value'))
        {
          l_selectUDOTResidentEngineer =
            this.selectProjectUDOTResidentEngineer.get('value');
          query.where = "UDOT_RESIDENT_ENGINEER = '"
            + l_selectUDOTResidentEngineer + "'";
          l_display = l_selectUDOTResidentEngineer;
          l_header = 'UDOT Resident Engineer';
        }
        else if(this.radioConsultantResidentEngineer.checked
          && this.selectProjectConsultantResidentEngineer.get('value'))
        {
          l_selectConsultantResidentEngineer =
            this.selectProjectConsultantResidentEngineer.get('value');
          query.where = "CNSLT_RESIDENT_ENGINEER = '"
            + l_selectConsultantResidentEngineer + "'";
          l_display = l_selectConsultantResidentEngineer;
          l_header = 'Consultant Resident Engineer';
        }
        queryTask.execute(query, lang.hitch(this, function(results)
          {
            if(results.features.length && results.features[0].geometry)
            {
              l_polygons = new Array();
              for(var i=0; i<results.features.length; i++)
              {
                if(results.features[i].geometry)
                {
                  l_polygons.push
                    ( new geometryEngine.buffer
                      ( results.features[i].geometry
                      , 20
                      , 'meters'
                      )
                    );
                }
              }
              var l_union = geometryEngine.union(l_polygons);
              this._zoomToPolygonAndQuery(l_union, query.where);
            }
            this._displayMessage(l_display, l_header);
            this.loading.hide();
          }));
      }
      
    , _zoomToDistrict: function()
      {
        this.loading.show();
        var l_selectDistrict = dijit.byId('selectDistrict').get('value');
        var l_selectStation = dijit.byId('selectStation').get('value');
        if(l_selectDistrict && l_selectDistrict === l_selectStation)
        {
          var l_url = "//maps.udot.utah.gov/arcgis/rest/"
            + "services/UDOT_Regions/MapServer/1";
          var queryTask = new QueryTask(l_url);
          var query = new Query();
          query.returnGeometry = true;
          query.outSpatialReference = 
            new SpatialReference(this.config.spatialReference);
          query.where = 'REGION = ' + l_selectDistrict;
          queryTask.execute(query, lang.hitch(this, function(results)
            {
              if(results.features.length && results.features[0].geometry)
              {
                var l_polygon = new Polygon(results.features[0].geometry);
                this._zoomToPolygon(l_polygon);
                this._displayMessage
                  ( results.features[0].attributes.DISTRICT
                  , 'Regions'
                  );
              }
              this.loading.hide();
            }));
        }
        else if(l_selectStation.length)
        {
          var l_url = "//services.arcgis.com/pA2nEVnB6tquxgOW/arcgis/rest/"
            + "services/ShedPolygonsByRoutes/FeatureServer/0";
          var queryTask = new QueryTask(l_url);
          var query = new Query();
          query.returnGeometry = true;
          query.outSpatialReference = 
            new SpatialReference(this.config.spatialReference);
          query.outField = [ 'CREW_NAME' ];
          query.where = "CREW_NAME = '" + l_selectStation + "'";
          queryTask.execute(query, lang.hitch(this, function(results)
            {
              if(results.features.length && results.features[0].geometry)
              {
                var l_polygon = new Polygon(results.features[0].geometry);
                this._zoomToPolygon(l_polygon);
                this._displayMessage
                  ( results.features[0].attributes.CREW_NAME
                  , 'Maintenance Station'
                  );
              }
              this.loading.hide();
            }));
        }
      }
      
    , _zoomToRoutes: function()
      {
        this.loading.show();
        var l_validSelection = false;
        var selectRoute = dijit.byId('selectRoutes');
        var selectInterchange = dijit.byId('selectInterchange');
        var selectRamp = dijit.byId('selectRamp');

        var l_url = "//maps.udot.utah.gov/arcgis/rest/"
          + "services/LRSRoutes/MapServer/0";
        var queryTask = new QueryTask(l_url);
        var query = new Query();
        query.returnGeometry = true;
        query.outSpatialReference = 
          new SpatialReference(this.config.spatialReference);
        query.outFields = [ 'ROUTE_NAME', 'FULL_ROUTE_NAME' ];
        query.where = "ROUTE_DIR IN ('P', 'N') ";
        
        if(selectRamp.get('value')
          && selectInterchange.get('value') && selectRoute.get('value'))
        {
          query.where += "AND ROUTE_TYPE = 'R' AND FULL_ROUTE_NAME = '"
            + selectRamp.get('value') + "'";
          this._displayMessage(selectRamp.get('value'), 'Ramp');
          l_validSelection = true;
        }
        else if(selectInterchange.get('value') && selectRoute.get('value'))
        {
          query.where += "AND ROUTE_TYPE = 'R' AND FULL_ROUTE_NAME LIKE '"
            + selectInterchange.get('value') + "%'";
          this._displayMessage(selectInterchange.get('value'), 'Interchange');
          l_validSelection = true;
        }
        else if(selectRoute.get('value'))
        {
          query.where += "AND ROUTE_TYPE = 'M' AND ROUTE_NAME = '"
            + selectRoute.get('value') + "'";
          this._displayMessage(selectRoute.get('value'), 'Route');
          l_validSelection = true;
        }

        if(l_validSelection)
        {
          queryTask.execute(query, lang.hitch(this, function(results)
            {
              l_polylines = new Array();
              for(var i=0; i<results.features.length; i++)
              {
                if(results.features[i].geometry)
                {
                  l_polylines.push(new Polyline(results.features[i].geometry));
                }
              }
              var l_union = geometryEngine.union(l_polylines);

              var l_polygon = new geometryEngine.buffer(l_union, 20, 'meters');
              if(l_polygon)
              {
                this._zoomToPolygon(l_polygon);
                this.buttonRoutesFilterByPolygon.set('disabled', false);
              }
              this.loading.hide();
            }));
        }
        else
        {
          this._displayMessage('Select something');
          this.loading.hide();
        }
      }
      
    , _zoomToPolygon: function(p_polygon)
      {
        var l_symbol = new SimpleFillSymbol
          ( SimpleFillSymbol.STYLE_SOLID
          , new SimpleLineSymbol
            ( SimpleLineSymbol.STYLE_SOLID
            , new Color([255, 255, 0, 0.8]), 2
            )
          , new Color([255, 255, 0, 0.1])
          );
        var l_graphic = new Graphic(p_polygon, l_symbol);
        this.tempZoomerLayer.clear();
        this.tempZoomerLayer.add(l_graphic);
        var l_ext = p_polygon.getExtent();
        this.map.setExtent(l_ext, true);
        this.zoomerPolygon = p_polygon;
        this._publishPolygon();
      }
      
    , _zoomToQuery: function(p_query)
      {
        this.zoomerQuery = p_query;
        this._publishQuery();
      }
      
    , _zoomToPolygonAndQuery: function(p_polygon, p_query)
      {
        var l_symbol = new SimpleFillSymbol
          ( SimpleFillSymbol.STYLE_SOLID
          , new SimpleLineSymbol
            ( SimpleLineSymbol.STYLE_SOLID
            , new Color([255, 255, 0, 0.8]), 2
            )
          , new Color([255, 255, 0, 0.1])
          );
        var l_graphic = new Graphic(p_polygon, l_symbol);
        this.tempZoomerLayer.clear();
        this.tempZoomerLayer.add(l_graphic);
        var l_ext = p_polygon.getExtent();
        this.map.setExtent(l_ext, true);
        this.zoomerPolygon = p_polygon;
        this.zoomerQuery = p_query;
        this._publishPolygonAndQuery();
      }
      
    , _buttonZoom: function()
      {
        this._hideInfoWindow();
        if(this.zoomType)
        {
          switch(this.zoomType)
          {
            case 'County':
              this._zoomToCounty();
              break;
            case 'Boundary':
              this._zoomToBoundary();
              break;
            case 'City':
              this._zoomToCity();
              break;
            case 'Legislative':
              this._zoomToLegislative();
              break;
            case 'Project':
              this._zoomToProject();
              break;
            case 'District':
              this._zoomToDistrict();
              break;
            case 'Routes':
              this._zoomToRoutes();
              break;
            default:
              return;
          }
        }
      }
      
    , _buttonReset: function()
      {
        if(this.tempZoomerLayer)
          this.tempZoomerLayer.clear();
        this._hideInfoWindow();
        dijit.byId('selectCounty').set('value', '');
        dijit.byId('selectCity').set('value', '');
        dijit.byId('textAddress').set('value', '');
        dijit.byId('selectBoundaryUA').set('value', '');
        dijit.byId('selectBoundaryUCSU').set('value', '');
        dijit.byId('selectBoundaryMPO').set('value', '');
        dijit.byId('selectBoundaryRPO').set('value', '');
        dijit.byId('selectLegislative').set('value', '');
        dijit.byId('selectDistrict').set('value', '');
        dijit.byId('selectStation').set('value', '');
        dijit.byId('selectRoutes').set('value', '');
        dijit.byId('selectCounty').reset();
        dijit.byId('selectCity').reset();
        dijit.byId('selectBoundaryUA').reset();
        dijit.byId('selectBoundaryUCSU').reset();
        dijit.byId('selectBoundaryMPO').reset();
        dijit.byId('selectBoundaryRPO').reset();
        dijit.byId('selectLegislative').reset();
        dijit.byId('selectDistrict').reset();
        dijit.byId('selectStation').reset();
        dijit.byId('selectRoutes').reset();
        this.buttonRoutesFilterByPolygon.set('disabled', true);
        this.zoomerPolygon = null;
        this.zoomerQuery = null;
        var l_polygon_statewide =
          { "rings":
            [[
              [ 215485, 4671304 ]
            , [ 520000, 4671304 ]
            , [ 520000, 4550000 ]
            , [ 690678, 4550000 ]
            , [ 690678, 4082870 ]
            , [ 215485, 4082870 ]
            ]]
          , "spatialReference":
            { "wkid": 26912 }
          };
        var l_polygon = new Polygon(l_polygon_statewide);
        var l_ext = l_polygon.getExtent();
        this.map.setExtent(l_ext, true);
        this._publishPolygonAndQuery();
      }
      
    , _buttonShare: function()
      {
        esri.config.defaults.io.proxyUrl = this.config.proxyUrl;
        this.loading.show();
        this._setDetailsHideAll();
        this._unselectButtonsAll();
        html.setStyle(this.zoomerShareDetails, 'display', 'block');
        var l_url = null;
        if(this.config.bitlyBaseURL)
          l_url = this.config.bitlyBaseURL;
        else
        {
          l_url = document.location.protocol
            + '//'
            + document.location.host
            + document.location.pathname;
        }
        l_url += '?extent=';
        l_url +=  this.map.extent.xmin
          + ',' + this.map.extent.ymin
          + ',' + this.map.extent.xmax
          + ',' + this.map.extent.ymax
          + ',' + this.map.spatialReference.wkid;
        if(this.config.bitlyUse)
        {
          var l_request = esriRequest
            (
              { url: "https://api-ssl.bitly.com/v3/shorten"
              , content:
                { access_token: this.config.bitlyAPIKey
                , longUrl: l_url
                }
              , handleAs: "json"
              }
            , { useProxy: this.config.proxyBitly }
            );
          l_request.then
            ( lang.hitch(this, function(response)
              {
                if(response.status_code == 200 && response.data.url.length)
                  dijit.byId('textShare').set('value', response.data.url);
                else
                  dijit.byId('textShare').set('value', l_url);
                this.loading.hide();
              })
            , lang.hitch(this, function(error)
              {
                dijit.byId('textShare').set('value', l_url);
                this.loading.hide();
              })
            );
        }
        else
        {
          dijit.byId('textShare').set('value', l_url);
          this.loading.hide();
        }
      }
      
    , _unselectButtonsAll: function()
      {
        html.setStyle(this.zoomerTypeCounty.children[0], 'display', 'block');
        html.setStyle(this.zoomerTypeCounty.children[1], 'display', 'none');
        html.setStyle(this.zoomerTypeBoundary.children[0], 'display', 'block');
        html.setStyle(this.zoomerTypeBoundary.children[1], 'display', 'none');
        html.setStyle(this.zoomerTypeCity.children[0], 'display', 'block');
        html.setStyle(this.zoomerTypeCity.children[1], 'display', 'none');
        html.setStyle
          ( this.zoomerTypeLegislative.children[0], 'display', 'block' );
        html.setStyle
          ( this.zoomerTypeLegislative.children[1], 'display', 'none' );
        html.setStyle(this.zoomerTypeProject.children[0], 'display', 'block');
        html.setStyle(this.zoomerTypeProject.children[1], 'display', 'none');
        html.setStyle(this.zoomerTypeDistrict.children[0], 'display', 'block');
        html.setStyle(this.zoomerTypeDistrict.children[1], 'display', 'none');
        html.setStyle(this.zoomerTypeRoutes.children[0], 'display', 'block');
        html.setStyle(this.zoomerTypeRoutes.children[1], 'display', 'none');
      }
      
    , _setDetailsCounty: function()
      {
        this._setDetailsHideAll();
        this._unselectButtonsAll();
        this.zoomType = 'County';
        html.setStyle(this.zoomerTypeCounty.children[0], 'display', 'none');
        html.setStyle(this.zoomerTypeCounty.children[1], 'display', 'block');
        html.setStyle(this.zoomerCountyDetails, 'display', 'block');
      }
      
    , _setDetailsBoundary: function()
      {
        this._setDetailsHideAll();
        this._unselectButtonsAll();
        this.zoomType = 'Boundary';
        html.setStyle(this.zoomerTypeBoundary.children[0], 'display', 'none');
        html.setStyle(this.zoomerTypeBoundary.children[1], 'display', 'block');
        html.setStyle(this.zoomerBoundaryDetails, 'display', 'block');
        html.setStyle(this.boundaryUA, 'display', 'none');
        html.setStyle(this.boundaryUCSU, 'display', 'none');
        html.setStyle(this.boundaryMPO, 'display', 'none');
        html.setStyle(this.boundaryRPO, 'display', 'none');
        this.radioBoundaryUA.checked = false;
        this.radioBoundaryUCSU.checked = false;
        this.radioBoundaryMPO.checked = false;
        this.radioBoundaryRPO.checked = false;
      }
      
    , _selectBoundaryUA: function()
      {
        html.setStyle(this.boundaryUCSU, 'display', 'none');
        html.setStyle(this.boundaryMPO, 'display', 'none');
        html.setStyle(this.boundaryRPO, 'display', 'none');
        html.setStyle(this.boundaryUA, 'display', 'block');
      }
      
    , _selectBoundaryUCSU: function()
      {
        html.setStyle(this.boundaryUA, 'display', 'none');
        html.setStyle(this.boundaryMPO, 'display', 'none');
        html.setStyle(this.boundaryRPO, 'display', 'none');
        html.setStyle(this.boundaryUCSU, 'display', 'block');
      }
      
    , _selectBoundaryMPO: function()
      {
        html.setStyle(this.boundaryUA, 'display', 'none');
        html.setStyle(this.boundaryUCSU, 'display', 'none');
        html.setStyle(this.boundaryRPO, 'display', 'none');
        html.setStyle(this.boundaryMPO, 'display', 'block');
      }
      
    , _selectBoundaryRPO: function()
      {
        html.setStyle(this.boundaryUA, 'display', 'none');
        html.setStyle(this.boundaryUCSU, 'display', 'none');
        html.setStyle(this.boundaryMPO, 'display', 'none');
        html.setStyle(this.boundaryRPO, 'display', 'block');
      }
      
    , _setDetailsCity: function()
      {
        this._setDetailsHideAll();
        this._unselectButtonsAll();
        this.zoomType = 'City';
        html.setStyle(this.zoomerTypeCity.children[0], 'display', 'none');
        html.setStyle(this.zoomerTypeCity.children[1], 'display', 'block');
        html.setStyle(this.zoomerCityDetails, 'display', 'block');
      }
      
    , _setDetailsLegislative: function()
      {
        this._setDetailsHideAll();
        this._unselectButtonsAll();
        this.zoomType = 'Legislative';
        html.setStyle
          ( this.zoomerTypeLegislative.children[0], 'display', 'none' );
        html.setStyle
          ( this.zoomerTypeLegislative.children[1], 'display', 'block' );
        html.setStyle(this.zoomerLegislativeDetails, 'display', 'block');
      }
      
    , _setDetailsProject: function()
      {
        this._setDetailsHideAll();
        this._unselectButtonsAll();
        this.zoomType = 'Project';
        html.setStyle(this.zoomerTypeProject.children[0], 'display', 'none');
        html.setStyle(this.zoomerTypeProject.children[1], 'display', 'block');
        html.setStyle(this.zoomerProjectDetails, 'display', 'block');
        html.setStyle(this.projectProgramManager, 'display', 'none');
        html.setStyle(this.projectUDOTResidentEngineer, 'display', 'none');
        html.setStyle(this.projectConsultantResidentEngineer, 'display','none');
        this.radioProgramManager.checked = false;
        this.radioUDOTResidentEngineer.checked = false;
        this.radioConsultantResidentEngineer.checked = false;
      }
      
    , _selectProgramManager: function()
      {
        html.setStyle(this.projectProgramManager, 'display', 'block');
        html.setStyle(this.projectUDOTResidentEngineer, 'display', 'none');
        html.setStyle(this.projectConsultantResidentEngineer, 'display','none');
      }
      
    , _selectUDOTResidentEngineer: function()
      {
        html.setStyle(this.projectProgramManager, 'display', 'none');
        html.setStyle(this.projectUDOTResidentEngineer, 'display', 'block');
        html.setStyle(this.projectConsultantResidentEngineer,'display','none');
      }
      
    , _selectConsultantResidentEngineer: function()
      {
        html.setStyle(this.projectProgramManager, 'display', 'none');
        html.setStyle(this.projectUDOTResidentEngineer, 'display', 'none');
        html.setStyle(this.projectConsultantResidentEngineer,'display','block');
      }
      
    , _setDetailsDistrict: function()
      {
        this._setDetailsHideAll();
        this._unselectButtonsAll();
        this.zoomType = 'District';
        html.setStyle(this.zoomerTypeDistrict.children[0], 'display', 'none');
        html.setStyle(this.zoomerTypeDistrict.children[1], 'display', 'block');
        html.setStyle(this.zoomerDistrictDetails, 'display', 'block');
      }
      
    , _setDetailsRoutes: function()
      {
        this._setDetailsHideAll();
        this._unselectButtonsAll();
        this.zoomType = 'Routes';
        this._changedRoute();
        if(this.zoomerPolygon)
        {
          this.buttonRoutesFilterByPolygon.set('disabled', false);
        }
        else
        {
          this.buttonRoutesFilterByPolygon.set('disabled', true);
        }
        html.setStyle(this.zoomerTypeRoutes.children[0], 'display', 'none');
        html.setStyle(this.zoomerTypeRoutes.children[1], 'display', 'block');
        html.setStyle(this.zoomerRoutesDetails, 'display', 'block');
      }
      
    , _setDetailsShare: function()
      {
        this._setDetailsHideAll();
        this._unselectButtonsAll();
        this.zoomType = 'Share';
        html.setStyle(this.zoomerShareDetails, 'display', 'block');
      }
      
    , _bindEvents: function()
      {
        this.own(on
          ( this.zoomerTypeCounty, 'click'
          , lang.hitch(this, this._setDetailsCounty)));
        this.own(on
          ( this.zoomerTypeBoundary, 'click'
          , lang.hitch(this, this._setDetailsBoundary)));
        this.own(on
          ( this.radioBoundaryUA, 'click'
          , lang.hitch(this, this._selectBoundaryUA)));
        this.own(on
          ( this.radioBoundaryUCSU, 'click'
          , lang.hitch(this, this._selectBoundaryUCSU)));
        this.own(on
          ( this.radioBoundaryMPO, 'click'
          , lang.hitch(this, this._selectBoundaryMPO)));
        this.own(on
          ( this.radioBoundaryRPO, 'click'
          , lang.hitch(this, this._selectBoundaryRPO)));
        this.own(on
          ( this.zoomerTypeCity, 'click'
          , lang.hitch(this, this._setDetailsCity)));
        this.own(on
          ( this.zoomerTypeLegislative, 'click'
          , lang.hitch(this, this._setDetailsLegislative)));
        this.own(on
          ( this.zoomerTypeProject, 'click'
          , lang.hitch(this, this._setDetailsProject)));
        this.own(on
          ( this.radioProgramManager, 'click'
          , lang.hitch(this, this._selectProgramManager)));
        this.own(on
          ( this.radioUDOTResidentEngineer, 'click'
          , lang.hitch(this, this._selectUDOTResidentEngineer)));
        this.own(on
          ( this.radioConsultantResidentEngineer, 'click'
          , lang.hitch(this, this._selectConsultantResidentEngineer)));
        this.own(on
          ( this.zoomerTypeDistrict, 'click'
          , lang.hitch(this, this._setDetailsDistrict)));
        this.own(on
          ( this.selectDistrict, 'change'
          , lang.hitch(this, this._populateMaintenanceStations)));
        this.own(on
          ( this.zoomerTypeRoutes, 'click'
          , lang.hitch(this, this._setDetailsRoutes)));
        this.own(on
          ( this.selectRoutes, 'change'
          , lang.hitch(this, this._changedRoute)));
        this.own(on
          ( this.selectInterchange, 'change'
          , lang.hitch(this, this._changedInterchange)));
        this.own(on
          ( this.selectRamp, 'change'
          , lang.hitch(this, this._changedRamp)));
        this.own(on
          ( this.buttonRoutesFilterByPolygon, 'click'
          , lang.hitch(this, this._filterRoutesByPolygon)));
        this.own(on
          ( this.buttonZoom, 'click'
          , lang.hitch(this, this._buttonZoom)));
        this.own(on
          ( this.buttonReset, 'click'
          , lang.hitch(this, this._buttonReset)));
        this.own(on
          ( this.buttonShare, 'click'
          , lang.hitch(this, this._buttonShare)));
      }
      
    , _publishPolygon: function()
      {
        if(dijit.byId('checkFilter').checked)
        {
          this.publishData(
            { polygon: this.zoomerPolygon
            , target: "AttributeTable"
            }, true);
        }
        else
        {
          this.publishData(
            { polygon: null
            , target: "AttributeTable"
            }, true);
        }
      }
    
    , _publishExtent: function()
      {
        if(dijit.byId('checkFilter').checked)
        {
          this.publishData(
            { extent: this.zoomerPolygon
            , target: "AttributeTable"
            }, true);
        }
        else
        {
          this.publishData(
            { extent: null
            , target: "AttributeTable"
            }, true);
        }
      }
      
    , _publishQuery: function()
      {
        if(dijit.byId('checkFilter').checked)
        {
          this.publishData(
            { query: this.zoomerQuery
            , target: "AttributeTable"
            }, true);
        }
        else
        {
          this.publishData(
            { query: null
            , target: "AttributeTable"
            }, true);
        }
      }
    
    , _publishPolygonAndQuery: function()
      {
        if(dijit.byId('checkFilter').checked)
        {
          this.publishData(
            { polygon: this.zoomerPolygon
            , query: this.zoomerQuery
            , target: "AttributeTable"
            }, true);
        }
        else
        {
          this.publishData(
            { polygon: null
            , query: null
            , target: "AttributeTable"
            }, true);
        }
      }
    });
    return clazz;
  });