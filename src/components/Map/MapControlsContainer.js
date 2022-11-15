/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Modernizr from "modernizr";
import Earth from "mdi-material-ui/Earth";
import PlusIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import HomeIcon from "@material-ui/icons/Home";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import Paper from "@material-ui/core/Paper";
import * as mapActionsCore from "_core/actions/mapActions";
import * as appActionsCore from "_core/actions/appActions";
import * as appActions from "actions/appActions";
import * as appStringsCore from "_core/constants/appStrings";
import MiscUtil from "utils/MiscUtil";
import { MapButton, EnhancedTooltip } from "_core/components/Reusables";
import { BasemapPicker, MapToolsButton } from "components/Map";
import stylesCore from "_core/components/Map/MapControlsContainer.scss";
import styles from "components/Map/MapControlsContainer.scss";

export class MapControlsContainer extends Component {
    componentDidMount() {
        // have to retroactively sync the state given browser specific hardware options to enter/exit full screen
        document.addEventListener(
            "fullscreenchange",
            () => {
                this.handleFullScreenChange();
            },
            false
        );
        document.addEventListener(
            "webkitfullscreenchange",
            () => {
                this.handleFullScreenChange();
            },
            false
        );
        document.addEventListener(
            "mozfullscreenchange",
            () => {
                this.handleFullScreenChange();
            },
            false
        );
    }

    handleFullScreenChange() {
        if (MiscUtil.getIsInFullScreenMode()) {
            this.props.appActionsCore.setFullScreenMode(true);
        } else {
            this.props.appActionsCore.setFullScreenMode(false);
        }
    }

    setViewMode() {
        if (this.props.in3DMode) {
            this.props.mapActionsCore.setMapViewMode(appStringsCore.MAP_VIEW_MODE_2D);
        } else {
            this.props.mapActionsCore.setMapViewMode(appStringsCore.MAP_VIEW_MODE_3D);
        }
    }

    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined",
            [stylesCore.mapControlsContainer]: true,
            [styles.mapControlsContainer]: true
        });
        return (
            <div className={containerClasses}>
                <Paper elevation={2} className={stylesCore.buttonGroup}>
                    <EnhancedTooltip
                        title={this.props.in3DMode ? "Switch to 2D map" : "Switch to 3D map"}
                        placement="right"
                    >
                        <MapButton
                            disabled={!Modernizr.webgl && !this.props.in3DMode ? true : false}
                            onClick={() => this.setViewMode()}
                            aria-label={
                                this.props.in3DMode ? "Switch to 2D map" : "Switch to 3D map"
                            }
                            className={stylesCore.singleButton}
                        >
                            <Earth />
                        </MapButton>
                    </EnhancedTooltip>
                </Paper>
                <Paper elevation={2} className={stylesCore.buttonGroup}>
                    <EnhancedTooltip title="Home" placement="right">
                        <MapButton
                            onClick={() => {
                                this.props.resetMapView(true);
                            }}
                            aria-label="Home"
                            className={`${stylesCore.firstButton} ${stylesCore.lineButton}`}
                        >
                            <HomeIcon />
                        </MapButton>
                    </EnhancedTooltip>
                    <EnhancedTooltip title="Zoom In" placement="right">
                        <MapButton
                            onClick={this.props.mapActionsCore.zoomIn}
                            aria-label="Zoom in"
                            className={stylesCore.lineButton}
                        >
                            <PlusIcon />
                        </MapButton>
                    </EnhancedTooltip>
                    <EnhancedTooltip title="Zoom Out" placement="right">
                        <MapButton
                            onClick={this.props.mapActionsCore.zoomOut}
                            aria-label="Zoom out"
                            className={stylesCore.lastButton}
                        >
                            <RemoveIcon />
                        </MapButton>
                    </EnhancedTooltip>
                </Paper>
                <Paper elevation={2} className={stylesCore.buttonGroup}>
                    <MapToolsButton
                        className={`${stylesCore.firstButton} ${stylesCore.lineButton}`}
                    />
                    <BasemapPicker className={stylesCore.lineButton} />
                    <EnhancedTooltip title="Fullscreen" placement="right">
                        <MapButton
                            onClick={() =>
                                this.props.appActionsCore.setFullScreenMode(
                                    !this.props.isFullscreen
                                )
                            }
                            aria-label="Fullscreen"
                            className={stylesCore.lastButton}
                        >
                            {this.props.isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </MapButton>
                    </EnhancedTooltip>
                </Paper>
            </div>
        );
    }
}

MapControlsContainer.propTypes = {
    in3DMode: PropTypes.bool.isRequired,
    isFullscreen: PropTypes.bool.isRequired,
    mapActionsCore: PropTypes.object.isRequired,
    appActionsCore: PropTypes.object.isRequired,
    resetMapView: PropTypes.func.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        in3DMode: state.map.getIn(["view", "in3DMode"]),
        isFullscreen: state.view.get("isFullscreen")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mapActionsCore: bindActionCreators(mapActionsCore, dispatch),
        appActionsCore: bindActionCreators(appActionsCore, dispatch),
        resetMapView: bindActionCreators(appActions.resetMapView, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapControlsContainer);
