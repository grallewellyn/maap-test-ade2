/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import MiscUtil from "_core/utils/MiscUtil";
import { MouseCoordinates } from "_core/components/MouseFollower";
import styles from "components/Map/CoordinateTracker.scss";
import textStylesCore from "_core/styles/text.scss";

export class CoordinateTracker extends Component {
    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.coordinateTracker]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <Paper elevation={2} className={containerClasses}>
                <MouseCoordinates className={textStylesCore.fontRobotoMono} />
            </Paper>
        );
    }
}

CoordinateTracker.propTypes = {
    className: PropTypes.string
};

export default connect()(CoordinateTracker);
