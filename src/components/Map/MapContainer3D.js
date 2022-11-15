import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MapContainer3D as MapContainer3DCore } from "_core/components/Map/MapContainer3D.js";
import * as mapActionsCore from "_core/actions/mapActions";
import * as appActions from "actions/appActions";
import * as appStrings from "constants/appStrings";
import * as appStringsCore from "_core/constants/appStrings";
import MiscUtil from "utils/MiscUtil";
import stylesCore from "_core/components/Map/MapContainer.scss";
import displayStylesCore from "_core/styles/display.scss";

export class MapContainer3D extends MapContainer3DCore {
    initializeMapListeners() {
        MapContainer3DCore.prototype.initializeMapListeners.call(this);

        let map = this.props.maps.get(appStringsCore.MAP_LIB_3D);
        if (typeof map !== "undefined") {
            map.addEventListener(appStrings.EVENT_MOVE_START, () => this.handleMapMoveStart(map));

            // mark complete
            this.listenersInitialized = true;
            console.log("3D Map Listeners Initialized");
        }
    }

    handleDrawEnd(geometry) {
        // Disable drawing
        this.props.mapActions.disableDrawing();
        // Add geometry to other maps
        this.props.mapActions.addGeometryToMap(geometry, appStringsCore.INTERACTION_DRAW, false);
    }

    handleMapMoveStart(map) {
        // Only fire move event if this map is active
        // and target inactive map
        if (map.isActive) {
            this.props.invalidatePixelClick();
        }
    }

    render() {
        // need to get some sort of stored state value
        if (this.props.initialLoadComplete && !this.listenersInitialized) {
            this.initializeMapListeners();
        }

        let containerClass = MiscUtil.generateStringFromSet({
            [stylesCore.mapRenderWrapper]: true,
            [displayStylesCore.hidden]: !this.props.in3DMode,
            [displayStylesCore.animationFadeIn]: this.props.in3DMode,
            [displayStylesCore.animationFadeOut]: !this.props.in3DMode,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return (
            <div className={containerClass}>
                <div id="map3D" className={stylesCore.mapRender} />
            </div>
        );
    }
}

MapContainer3D.propTypes = Object.assign({}, MapContainer3DCore.propTypes, {
    invalidatePixelClick: PropTypes.func.isRequired
});

function mapStateToProps(state) {
    return {
        maps: state.map.get("maps"),
        units: state.map.getIn(["displaySettings", "selectedScaleUnits"]),
        in3DMode: state.map.getIn(["view", "in3DMode"]),
        initialLoadComplete: state.view.get("initialLoadComplete")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        invalidatePixelClick: bindActionCreators(appActions.invalidatePixelClick, dispatch),
        mapActions: bindActionCreators(mapActionsCore, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapContainer3D);
