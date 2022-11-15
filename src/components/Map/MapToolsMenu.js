import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Icon from "@material-ui/core/Icon";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import DeleteIcon from "@material-ui/icons/Delete";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import MiscUtil from "_core/utils/MiscUtil";
import * as appStrings from "_core/constants/appStrings";
import * as mapActions from "_core/actions/mapActions";
import * as appActions from "_core/actions/appActions";
import { DrawLineIcon } from "_core/components/Reusables/CustomIcons";
import styles from "components/Map/MapToolsMenu.scss";

export class MapToolsMenu extends Component {
    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.mapToolsMenu]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <MenuList dense className={containerClasses}>
                <MenuItem
                    className={styles.contextMenuItem}
                    dense
                    aria-label="Point"
                    onClick={() => {
                        this.props.handleRequestClose();
                        this.props.mapActions.enableDrawing(appStrings.GEOMETRY_POINT);
                    }}
                >
                    <ListItemIcon classes={{ root: styles.listItemIcon }}>
                        <Icon>
                            <i className="ms ms-points" />
                        </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="Point" />
                </MenuItem>
                <MenuItem
                    className={styles.contextMenuItem}
                    dense
                    aria-label="Line"
                    onClick={() => {
                        this.props.handleRequestClose();
                        this.props.mapActions.enableDrawing(appStrings.GEOMETRY_LINE);
                    }}
                >
                    <ListItemIcon classes={{ root: styles.listItemIcon }}>
                        <DrawLineIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="Line" />
                </MenuItem>
                <MenuItem
                    className={styles.contextMenuItem}
                    dense
                    aria-label="Polyline"
                    onClick={() => {
                        this.props.handleRequestClose();
                        this.props.mapActions.enableDrawing(appStrings.GEOMETRY_LINE_STRING);
                    }}
                >
                    <ListItemIcon classes={{ root: styles.listItemIcon }}>
                        <Icon>
                            <i className="ms ms-line" />
                        </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="Polyline" />
                </MenuItem>
                <MenuItem
                    className={styles.contextMenuItem}
                    dense
                    aria-label="Polygon"
                    onClick={() => {
                        this.props.handleRequestClose();
                        this.props.mapActions.enableDrawing(appStrings.GEOMETRY_POLYGON);
                    }}
                >
                    <ListItemIcon classes={{ root: styles.listItemIcon }}>
                        <Icon>
                            <i className="ms ms-polygon" />
                        </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="Polygon" />
                </MenuItem>
                <MenuItem
                    className={styles.contextMenuItem}
                    dense
                    aria-label="Box"
                    onClick={() => {
                        this.props.handleRequestClose();
                        this.props.mapActions.enableDrawing(appStrings.GEOMETRY_BOX);
                    }}
                >
                    <ListItemIcon classes={{ root: styles.listItemIcon }}>
                        <Icon>
                            <i className="ms ms-vector" />
                        </Icon>
                    </ListItemIcon>
                    <ListItemText inset primary="Box" />
                </MenuItem>
                <MenuItem
                    className={styles.contextMenuItem}
                    dense
                    aria-label="Circle"
                    icon="radio_button_unchecked"
                    onClick={() => {
                        this.props.handleRequestClose();
                        this.props.mapActions.enableDrawing(appStrings.GEOMETRY_CIRCLE);
                    }}
                >
                    <ListItemIcon classes={{ root: styles.listItemIcon }}>
                        <RadioButtonUncheckedIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="Circle" />
                </MenuItem>
                <Divider />
                <MenuItem
                    className={styles.contextMenuItem}
                    dense
                    aria-label="Clear Selections"
                    onClick={() => {
                        this.props.handleRequestClose();
                        this.props.mapActions.removeAllDrawings();
                    }}
                >
                    <ListItemIcon classes={{ root: styles.listItemIcon }}>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="Clear Selections" />
                </MenuItem>
            </MenuList>
        );
    }
}

MapToolsMenu.propTypes = {
    handleRequestClose: PropTypes.func.isRequired,
    appActions: PropTypes.object.isRequired,
    mapActions: PropTypes.object.isRequired,
    className: PropTypes.string
};

function mapDispatchToProps(dispatch) {
    return {
        mapActions: bindActionCreators(mapActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(MapToolsMenu);
