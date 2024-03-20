import React, { useState, useEffect } from 'react';
import SchedulerComponent from '../../components/scheduler/Scheduler';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './timeTable.scss';
import { getAllByUsernameForTeacher, getAllByUsernameForStudent } from '../../services/timeTableService';
import { countStudentsInClass } from '../../services/schoolClassService';
import { forEach } from 'lodash';

const TimeTableContainer = () => {
    const user = useSelector(state => state.user);
    const username = user?.dataRedux?.account?.username || '';
    const roles = user?.dataRedux?.account?.roles || [];

    const [listTimeTables, setListTimeTables] = useState([])
    const [isTeacher, setIsTeacher] = useState(false);
    const [isStudent, setIsStudent] = useState(false);


    useEffect(() => {
        if (username && roles) {
            checkUserRole();
        }
    }, [username, roles]);

    const checkUserRole = () => {
        if (roles.includes('ROLE_TEACHER')) {
            setIsTeacher(true);
        }
        if (roles.includes('ROLE_STUDENT')) {
            setIsStudent(true);
        }
    };
    useEffect(() => {
        fetchTimetableByUsername()
    }, [username, isTeacher, isStudent])

    const fetchTimetableByUsername = async () => {
        try {
            let listTimeTablesResponse

            if (isTeacher) {
                listTimeTablesResponse = await getAllByUsernameForTeacher(username);
                if (listTimeTablesResponse && listTimeTablesResponse.dt) {
                    const timeTablePromises = listTimeTablesResponse.dt.map(async (timeTable) => {
                        const classSizeResponse = await countStudentsInClass(timeTable.schoolClass.id);
                        const classSize = classSizeResponse.dt;
                        return {
                            timeTableId: timeTable.timeTable.id,
                            title: timeTable.subject.name,
                            class: timeTable.schoolClass.name,
                            classId: timeTable.schoolClass.id,
                            classSize: classSize,
                            lessonName: timeTable.schedule.name,
                            scheduleId: timeTable.schedule.id,
                            headTeacher: `${timeTable.schoolClass.teacher.firstName} ${timeTable.schoolClass.teacher.lastName}`,
                            teacher: `${timeTable.teacher.firstName} ${timeTable.teacher.lastName}`,
                            teacherId: timeTable.teacher.id,
                            studyWeek: timeTable.timeTable.studyWeek,
                            studyDate: timeTable.timeTable.studyDate,
                            startTime: timeTable.schedule.startTime,
                            endTime: timeTable.schedule.endTime,

                        };
                    });
                    const resolvedTimeTables = await Promise.all(timeTablePromises);
                    setListTimeTables(resolvedTimeTables);
                }
            } else {
                listTimeTablesResponse = await getAllByUsernameForStudent(username);
                if (listTimeTablesResponse && listTimeTablesResponse.dt) {
                    const timeTablePromises = listTimeTablesResponse.dt.map(async (timeTable) => {
                        const classSizeResponse = await countStudentsInClass(timeTable.schoolClass.id);
                        const classSize = classSizeResponse.dt;
                        return {
                            timeTableId: timeTable.timeTable.id,
                            title: timeTable.subject.name,
                            class: timeTable.schoolClass.name,
                            classId: timeTable.schoolClass.id,
                            classSize: classSize,
                            lessonName: timeTable.schedule.name,
                            scheduleId: timeTable.schedule.id,
                            headTeacher: `${timeTable.schoolClass.teacher.firstName} ${timeTable.schoolClass.teacher.lastName}`,
                            teacher: `${timeTable.teacher.firstName} ${timeTable.teacher.lastName}`,
                            teacherId: timeTable.teacher.id,
                            studyWeek: timeTable.timeTable.studyWeek,
                            studyDate: timeTable.timeTable.studyDate,
                            startTime: timeTable.schedule.startTime,
                            endTime: timeTable.schedule.endTime,

                        };
                    });
                    const resolvedTimeTables = await Promise.all(timeTablePromises);
                    setListTimeTables(resolvedTimeTables);
                }

            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const convertToAppointments = (data) => {
        return data.map(item => {
            const { title, class: className, classSize, lessonName, headTeacher, teacher, studyWeek, studyDate, startTime, endTime,
                timeTableId, scheduleId, teacherId, classId
            } = item;

            const startHour = startTime[0];
            const startMinute = startTime[1];
            const endHour = endTime[0];
            const endMinute = endTime[1];

            const startDate = new Date(studyDate);
            startDate.setHours(startHour, startMinute);

            const endDate = new Date(studyDate);
            endDate.setHours(endHour, endMinute);

            return {
                startDate,
                endDate,
                title,
                class: className,
                classSize: String(classSize),
                lessonName,
                headTeacher,
                teacher,
                studyWeek,
                timeTableId,
                scheduleId,
                teacherId,
                classId,
            };
        });
    };
    // console.log(convertToAppointments(listTimeTables))

    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="container">
                    <div className="manage-timeTables-container">
                        <div className="transcript-header row">
                            <div className="title mt-3">
                                <h3>{isTeacher ? 'LỊCH GIẢNG DẠY' : 'LỊCH HỌC'}</h3>
                            </div>
                            <div className="actions my-3">
                                <div className="timeTable-body">
                                    <SchedulerComponent appointments={convertToAppointments(listTimeTables)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeTableContainer;
