import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import AppPages from '../../../AppPages';
import Stepper from '../../../shared/stepper/Stepper';
import ProfileSelect from './profile/ProfileSelect';
import PageNavigation from '../../../shared/pageNavigation/PageNavigation';
import { validate } from '../../../../store/job/actions';
import { getServerGeneralStatus } from '../../../../store/serverInfo/selectors';
import { getJobId } from '../../../../store/job/selectors';

import './Settings.scss';

const backButton = {
    label: 'Upload files',
    to: AppPages.UPLOAD,
};

function Settings(props) {
    const { allServicesAvailable, jobId, onValidateClick } = props;
    const forwardButton = useMemo(
        () => ({
            label: 'Validate',
            disabled: !allServicesAvailable,
            onClick: () => onValidateClick(),
        }),
        [allServicesAvailable, onValidateClick]
    );

    if (jobId) {
        // Once job is initialized and we know its ID redirect to status page to track its progress
        return <Redirect push to={AppPages.UPLOAD} />;
    }

    return (
        <section className="settings">
            <Stepper activeStep={AppPages.SETTINGS} />
            <section className="job-settings">
                <form>
                    <ProfileSelect />
                </form>
            </section>
            <PageNavigation back={backButton} forward={forwardButton} />
        </section>
    );
}

Settings.propTypes = {
    allServicesAvailable: PropTypes.bool.isRequired,
    jobId: PropTypes.string,
    onValidateClick: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        allServicesAvailable: getServerGeneralStatus(state),
        jobId: getJobId(state),
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onValidateClick: () => dispatch(validate()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
