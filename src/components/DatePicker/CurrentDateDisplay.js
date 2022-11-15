import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import MiscUtil from "_core/utils/MiscUtil";
import testStyles from "_core/styles/text.scss";
import styles from "components/DatePicker/CurrentDateDisplay.scss";

export class CurrentDateDisplay extends Component {
    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [styles.root]: true,
            [testStyles.fontRobotoMono]: true,
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <Typography variant="body1" className={containerClasses}>
                {moment.utc(this.props.date).format("YYYY MMM DD, HH:mm UTC")}
            </Typography>
        );
    }
}

CurrentDateDisplay.propTypes = {
    date: PropTypes.object.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date")
    };
}

export default connect(
    mapStateToProps,
    null
)(CurrentDateDisplay);
