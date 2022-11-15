/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Slider from "@material-ui/lab/Slider";
import styles from "components/LayerMenu/LayerOpacityControl.scss";
import MiscUtil from "_core/utils/MiscUtil";
import { LayerControlLabel } from "components/LayerMenu";

const LayerOpacityControl = props => {
    let currOpacity = Math.floor(props.opacity * 100);
    let containerClasses = MiscUtil.generateStringFromSet({
        [styles.opacityControl]: true,
        [props.className]: typeof props.className !== "undefined"
    });
    return (
        <div>
            <Paper elevation={8} className={containerClasses}>
                <LayerControlLabel>Layer Opacity</LayerControlLabel>
                <div className={`${styles.opacityContent} ${styles.opacityContent}`}>
                    <Slider
                        min={0}
                        max={100}
                        step={10}
                        value={props.opacity * 100}
                        className={styles.sliderRoot}
                        onChange={(evt, value) => props.onChange(value)}
                    />
                    <div className={styles.opacityLabel}>{currOpacity}%</div>
                </div>
            </Paper>
        </div>
    );
};

LayerOpacityControl.propTypes = {
    isActive: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    opacity: PropTypes.number.isRequired,
    className: PropTypes.string
};

export default LayerOpacityControl;
