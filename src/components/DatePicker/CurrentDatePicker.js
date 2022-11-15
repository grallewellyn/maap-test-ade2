import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Paper from "@material-ui/core/Paper";
import RightIcon from "mdi-material-ui/MenuRight";
import LeftIcon from "mdi-material-ui/MenuLeft";
import { IconButtonSmall } from "_core/components/Reusables";
import { DatePicker } from "components/DatePicker";
import * as appActions from "actions/appActions";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "components/DatePicker/CurrentDatePicker.scss";

export class CurrentDatePicker extends Component {
    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.root]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <Paper className={containerClasses}>
                <DatePicker
                    date={this.props.date}
                    setDate={this.props.setDate}
                    className={styles.picker}
                />
                <div className={styles.btns}>
                    <IconButtonSmall
                        className={styles.thinBtn}
                        onClick={() => this.props.stepDate(false)}
                    >
                        <LeftIcon />
                    </IconButtonSmall>
                    <IconButtonSmall
                        className={styles.thinBtn}
                        onClick={() => this.props.stepDate(true)}
                    >
                        <RightIcon />
                    </IconButtonSmall>
                </div>
            </Paper>
        );
    }
}

CurrentDatePicker.propTypes = {
    date: PropTypes.object.isRequired,
    setDate: PropTypes.func.isRequired,
    stepDate: PropTypes.func.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setDate: bindActionCreators(appActions.setDate, dispatch),
        stepDate: bindActionCreators(appActions.stepDate, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CurrentDatePicker);
