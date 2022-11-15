/**
 * Copyright 2017 California Institute of Technology.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*eslint-disable import/default*/
import "@babel/polyfill";
import React from "react";
import path from "path";
import { render } from "react-dom";
import { Provider } from "react-redux";
import configureStore from "store/configureStore";
import { AppContainer } from "components/App";
import appConfig from "constants/appConfig";

// require("_core/styles/resources/img/apple-touch-icon.png");
// require("_core/styles/resources/img/favicon-32x32.png");
// require("_core/styles/resources/img/favicon-16x16.png");
// require("_core/styles/resources/img/safari-pinned-tab.svg");
// require("_core/styles/resources/img/favicon.ico");
// require("_core/styles/resources/img/7994970.png");

if (process.env.NODE_ENV !== "production") {
    const store = configureStore();
    const target = document.getElementById("app");

    render(
        <Provider store={store}>
            <AppContainer />
        </Provider>,
        target
    );
}

export class CMC {
    constructor(options = {}) {
        const { base_url, target } = options;

        if (base_url) {
            appConfig.CESIUM_BASE_URL = path.join(base_url, appConfig.CESIUM_BASE_URL);
        }

        this.dispatch = {};
        this.config = appConfig;
        this._store = configureStore();

        let el;
        if (typeof target === "string") {
            // assume its a domnode id
            el = document.getElementById(target);
        } else {
            // assume its a domnode
            el = target;
        }
        this.domNode = el;
        appConfig.RENDER_NODE = this.domNode;
    }

    render() {
        return new Promise((resolve, reject) => {
            render(
                <Provider store={this._store}>
                    <AppContainer
                        linkDispatch={dispatch => this._linkDispatch(dispatch, resolve)}
                    />
                </Provider>,
                this.domNode
            );
        });
    }

    _linkDispatch(dispatch, opt_resolve) {
        this.dispatch = dispatch;
        if (opt_resolve) {
            opt_resolve();
        }
    }
}

window.CMC = CMC;

export default CMC;
