/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as mapActions from "_core/actions/mapActions";
import * as dateSliderActions from "_core/actions/dateSliderActions";
import KeyHandler, { KEYUP } from "react-key-handler";
import displayStyles from "_core/styles/display.scss";
import { KeyboardControlsContainer as KeyboardControlsContainerCore } from "_core/components/KeyboardControls/KeyboardControlsContainer.js";

export class KeyboardControlsContainer extends KeyboardControlsContainerCore {
    render() {
        return (
            <div className={displayStyles.hidden}>
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="Escape"
                    onKeyHandle={evt => this.handleKeyUp_Escape()}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        maps: state.map.get("maps"),
        date: state.map.get("date"),
        dateSliderTimeResolution: state.dateSlider.get("resolution"),
        isDrawingEnabled: state.map.getIn(["drawing", "isDrawingEnabled"]),
        isMeasuringEnabled: state.map.getIn(["measuring", "isMeasuringEnabled"])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mapActions: bindActionCreators(mapActions, dispatch),
        dateSliderActions: bindActionCreators(dateSliderActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(KeyboardControlsContainer);
