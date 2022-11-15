import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as mapActionsCore from "_core/actions/mapActions";
import * as appActions from "actions/appActions";
import { MapContainer2D, MapContainer3D } from "components/Map";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/Map/MapContainer.scss";
import commonStyles from "styles/common.scss";

export class MapContainer extends Component {
    componentDidMount() {
        this.refs.container.addEventListener("mouseout", evt => {
            this.props.mapActionsCore.invalidatePixelHover();
        });

        let prevSize = this.refs.container.getBoundingClientRect();
        const resizeListener = setInterval(() => {
            let currSize = this.refs.container.getBoundingClientRect();
            if (prevSize.width !== currSize.width || prevSize.height !== currSize.height) {
                prevSize = currSize;
                window.requestAnimationFrame(() => {
                    this.props.resizeMap();
                });
            }
        }, 1500);
    }

    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.mapContainer]: true,
            [commonStyles.cursorCrosshair]: this.props.isDrawingEnabled,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <div ref="container" className={containerClasses}>
                <MapContainer2D />
                <MapContainer3D />
            </div>
        );
    }
}

MapContainer.propTypes = {
    isDrawingEnabled: PropTypes.bool.isRequired,
    mapActionsCore: PropTypes.object.isRequired,
    resizeMap: PropTypes.func.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        isDrawingEnabled: state.map.getIn(["drawing", "isDrawingEnabled"])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mapActionsCore: bindActionCreators(mapActionsCore, dispatch),
        resizeMap: bindActionCreators(appActions.resizeMap, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapContainer);
