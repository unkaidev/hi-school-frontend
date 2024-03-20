import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCalendarWeek, faChalkboardTeacher, faClock, faEdit, faHome, faHourglassEnd, faHourglassStart, faPeopleRoof, faPersonChalkboard, faSchool, faTimesCircle, faUserAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import {
    Scheduler,
    MonthView,
    WeekView,
    DayView,
    Toolbar,
    DateNavigator,
    ViewSwitcher,
    Appointments,
    AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { useEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

const SchedulerComponent = ({ appointments }) => {
    const history = useHistory();

    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isDataReady, setIsDataReady] = useState(false);

    const handleAppointmentClick = (appointment) => {
        setSelectedAppointment(appointment);
    };


    const handleAttendanceClick = () => {
        history.push({
            pathname: '/attendance',
            state: { classData: selectedAppointment }
        });
    };

    useEffect(() => {
        if (selectedAppointment) {
            setIsDataReady(true);
        }
    }, [selectedAppointment]);

    const handleAttendanceAndAppointmentClick = () => {
        if (isDataReady) {
            handleAttendanceClick();
        }
    };

    const CustomTooltipHeader = ({ appointmentData }) => {
        handleAppointmentClick(appointmentData);

        return (
            <div className='container'>
                <div className='row mt-3 fw-bold'>
                    <div className='col-10'>
                        <p className='fs-5'>
                            <i className="fa fa-book me-3"></i>
                            {appointmentData.title}
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faPersonChalkboard} className='me-3' />
                            {appointmentData.teacher}
                        </p>
                    </div>
                    <div className='col-2'>
                        <Button variant="link"
                            onClick={handleAttendanceAndAppointmentClick}
                            title='Điểm danh'
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const CustomTooltipContent = ({ appointmentData }) => {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='form-role col-6 my-1'>
                        <FontAwesomeIcon icon={faHome} className='me-3' />
                        {appointmentData.class}
                    </div>
                    <div className='form-role col-6 my-1'>
                        <FontAwesomeIcon icon={faUserCircle} className='me-3' />
                        {appointmentData.headTeacher}
                    </div>
                    <div className='form-role col-6 my-1'>
                        <FontAwesomeIcon icon={faPeopleRoof} className='me-3' />
                        {appointmentData.classSize}
                    </div>

                    <div className='form-role col-6 my-1'>
                        <FontAwesomeIcon icon={faClock} className='me-3' />
                        {appointmentData.lessonName}
                    </div>
                    <div className='form-role col-6 my-1'>
                        <FontAwesomeIcon icon={faHourglassStart} className='me-3' />
                        {new Date(appointmentData.startDate).toLocaleTimeString()}
                    </div>
                    <div className='form-role col-6 my-1'>
                        <FontAwesomeIcon icon={faHourglassEnd} className='me-3' />
                        {new Date(appointmentData.endDate).toLocaleTimeString()}
                    </div>
                    <div className='form-role col-12 my-1'>
                        <FontAwesomeIcon icon={faCalendarWeek} className='me-3' />
                        {appointmentData.studyWeek}
                    </div>
                </div>


            </div>
        );
    };

    return (
        <div>
            <Scheduler data={appointments}>
                <ViewState defaultCurrentDate={new Date()} defaultCurrentViewName="Month" />
                <MonthView />
                <WeekView startDayHour={6} endDayHour={17} />
                <DayView startDayHour={6} endDayHour={17} />
                <Toolbar />
                <DateNavigator />
                <ViewSwitcher />
                <Appointments />
                <EditingState />
                <AppointmentTooltip
                    showOpenButton
                    headerComponent={CustomTooltipHeader}
                    contentComponent={CustomTooltipContent}
                    onVisibilityChange={({ visible }) => {
                        if (visible) {
                        }
                    }}

                />
            </Scheduler>
        </div>

    );
};

export default SchedulerComponent;
