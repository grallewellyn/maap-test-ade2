/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Immutable from "immutable";
import * as coreConfig from "_core/constants/appConfig";

// load in raw json configured layers
import BUILT_IN_LAYERS from "default-data/layers.json";

// the config as defined by CMC Core
const CORE_CONFIG = Immutable.fromJS(coreConfig);

// this config is defined in `src/config.js` for in ops changes
const OPS_CONFIG = Immutable.fromJS(window.APPLICATION_CONFIG);

// define your overrides for Core config here
const APP_CONFIG = Immutable.fromJS({
    BUILT_IN_LAYER_PARTIALS: BUILT_IN_LAYERS.layers,
    CESIUM_BASE_URL: "assets/cesium",
    DELETE_LAYER_PARTIALS: false,
    RENDER_NODE: undefined,
    MAX_ZOOM: 24,
    MIN_ZOOM_DISTANCE_3D: 100.0,
    PLOT_TYPES: [
        { label: "Time Series", value: "timeseries" },
        { label: "Time Average Map", value: "timeavgmap" },
        { label: "Hovmöller - Latitude", value: "hovmollerlat" },
        { label: "Hovmöller - Longitude", value: "hovmollerlon" }
    ]
});

// define and export the final config
const appConfig = CORE_CONFIG.mergeDeep(APP_CONFIG)
    .mergeDeep(OPS_CONFIG)
    .toJS();
export default appConfig;
