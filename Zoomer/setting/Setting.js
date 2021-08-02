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

define(
  [ 'dojo/_base/declare'
  , 'dojo/_base/lang'
  , 'jimu/BaseWidgetSetting'
  , 'dijit/form/CheckBox'
  , 'dijit/_WidgetsInTemplateMixin'
  ]
  , function(declare, lang, BaseWidgetSetting, CheckBox, _WidgetsInTemplateMixin)
    {
      return declare([BaseWidgetSetting, _WidgetsInTemplateMixin]
      , { baseClass: 'jimu-widget-zoomer-setting'
        , postCreate: function()
          {
            this.inherited(arguments);
            if(!this.config)
              this.config = {};
            this.setConfig(this.config);
          }
        , setConfig: function(config)
          {
            this.config = config;
            dijit.byId('checkInterfaceAttributeTable').set('checked', config.interfaceAttributeTable);
            dijit.byId('checkProvoEasteregg').set('checked', config.eastereggProvo);
            dijit.byId('checkUdotPmAndRe').set('checked', config.udotPmAndRe);
            dijit.byId('textSpatialReference').set('value', config.spatialReference);
            dijit.byId('textAGRCAPIURL').set('value', config.AGRCAPIURL);
            dijit.byId('textAGRCAPIKey').set('value', config.AGRCAPIKey);
            dijit.byId('textAGRCAPICityFeatureClass').set('value', config.AGRCAPICityFeatureClass);
            dijit.byId('textAGRCAPICountyFeatureClass').set('value', config.AGRCAPICountyFeatureClass);
            dijit.byId('textAGRCAPIStateHouseFeatureClass').set('value', config.AGRCAPIStateHouseFeatureClass);
            dijit.byId('textAGRCAPIStateSenateFeatureClass').set('value', config.AGRCAPIStateSenateFeatureClass);
            dijit.byId('textAGRCAPIUSCongressFeatureClass').set('value', config.AGRCAPIUSCongressFeatureClass);
            dijit.byId('checkBitlyUse').set('checked', config.bitlyUse);
            dijit.byId('textBitlyAPIKey').set('value', config.bitlyAPIKey);
            dijit.byId('textBitlyBaseURL').set('value', config.bitlyBaseURL);
            dijit.byId('textProxyUrl').set('value', config.proxyUrl);
            dijit.byId('checkProxyMapsUDOT').set('checked', config.proxyMapsUDOT);
            dijit.byId('checkProxyBitly').set('checked', config.proxyBitly);
            dijit.byId('checkProxyAGRC').set('checked', config.proxyAGRC);
          }
        , getConfig: function()
          {
            var config =
            {
              interfaceAttributeTable: dijit.byId('checkInterfaceAttributeTable').get('checked')
            , eastereggProvo: dijit.byId('checkProvoEasteregg').get('checked')
            , udotPmAndRe: dijit.byId('checkUdotPmAndRe').get('checked')
            , spatialReference: dijit.byId('textSpatialReference').get('value')
            , AGRCAPIURL: dijit.byId('textAGRCAPIURL').get('value')
            , AGRCAPIKey: dijit.byId('textAGRCAPIKey').get('value')
            , AGRCAPICityFeatureClass: dijit.byId('textAGRCAPICityFeatureClass').get('value')
            , AGRCAPICountyFeatureClass: dijit.byId('textAGRCAPICountyFeatureClass').get('value')
            , AGRCAPIStateHouseFeatureClass: dijit.byId('textAGRCAPIStateHouseFeatureClass').get('value')
            , AGRCAPIStateSenateFeatureClass: dijit.byId('textAGRCAPIStateSenateFeatureClass').get('value')
            , AGRCAPIUSCongressFeatureClass: dijit.byId('textAGRCAPIUSCongressFeatureClass').get('value')
            , bitlyUse: dijit.byId('checkBitlyUse').get('checked')
            , bitlyAPIKey: dijit.byId('textBitlyAPIKey').get('value')
            , bitlyBaseURL: dijit.byId('textBitlyBaseURL').get('value')
            , proxyUrl: dijit.byId('textProxyUrl').get('value')
            , proxyMapsUDOT: dijit.byId('checkProxyMapsUDOT').get('checked')
            , proxyBitly: dijit.byId('checkProxyBitly').get('checked')
            , proxyAGRC: dijit.byId('checkProxyAGRC').get('checked')
            };
            this.config = lang.clone(config);
            return config;
          }
        }
      );
    }
);