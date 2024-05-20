import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createNewTimeTable, updateCurrentTimeTable, getAllTimeWeekWithSemester, getAllTimeDayWithSemester, getAllWithSemester } from '../../services/timeTableService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';
import { getAllBySemesterAndGrade } from '../../services/subjectService';
import { getAllGrade, getASchoolClass, getAllSchoolClassWithYearId } from '../../services/schoolClassService';
import { getAllSchedulesWithSemesterId } from '../../services/scheduleService';
import { getAllGroupName } from '../../services/teacherServices';
import { getAllTeacherBySchoolAndGroupReady } from '../../services/teacherServices';

const ModalTimeTable = (props) => {
    const { action, dataModalTimeTable, show, onHide, schoolId, yearId, semesterId, classId } = props;

    const defaultTimeTableData = {
        classComment: '',
        teacher: {
            id: '',
            firstName: '',
            lastName: '',
            group: '',
        },
        schoolClass: {
            id: '',
            name: '',
        },
        schedule: {
            id: '',
            name: '',
        }
        ,
        schedules: [],
        subject: {
            id: '',
            name: '',
        },
        timeTable: {
            id: '',
            studyDay: '',
            studyDate: '',
            studyWeek: '',
        },
        timeWeeks: [],
        timeDays: [],
    }
    const [timeTableData, setTimeTableData] = useState(defaultTimeTableData);

    const [gradeNames, setGradeNames] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState([]);
    const [selectedGradeLabel, setSelectedGradeLabel] = useState('Chọn khối học');
    const [groupNames, setGroupNames] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [selectedGroupLabel, setSelectedGroupLabel] = useState('Chọn nhóm chuyên môn');

    const [subjects, setSubjects] = useState([]);
    const [isSelectedSubject, setIsSelectedSubject] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [sClass, setSClass] = useState({});
    const [schedules, setSchedules] = useState([]);
    const [timeWeeks, setTimeWeeks] = useState([]);
    const [timeDays, setTimeDays] = useState([]);
    const [timeDates, setTimeDates] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const gradeResponse = await getAllGrade();
                const groupNamesResponse = await getAllGroupName();
                if (gradeResponse) {
                    setGradeNames(gradeResponse);
                }
                if (groupNamesResponse) {
                    setGroupNames(groupNamesResponse);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data');
            }
        };

        fetchData();
    }, [action]);

    const fetchClassData = async (classId) => {
        try {
            const classResponse = await getASchoolClass(classId);
            if (classResponse && classResponse.dt) {
                const classData = {
                    name: classResponse.dt.name,
                    id: classResponse.dt.id
                };
                setSClass(classData);
                setTimeTableData(prevState => ({
                    ...prevState,
                    schoolClass: {
                        name: classResponse.dt.name,
                        id: classResponse.dt.id
                    }
                }));
            }
        } catch (error) {
            console.error('Error fetching class data:', error);
            toast.error('Failed to fetch class data');
        }
    };

    const fetchScheduleData = async (semesterId) => {
        try {
            const scheduleResponse = await getAllSchedulesWithSemesterId(semesterId);
            if (scheduleResponse && scheduleResponse.dt) {
                const schedulesData = scheduleResponse.dt.map(schedule => ({
                    name: schedule.name,
                    id: schedule.id
                }));
                setSchedules(schedulesData);
            }
        } catch (error) {
            console.error('Error fetching schedule data:', error);
            toast.error('Failed to fetch schedule data');
        }
    };
    const fetchTimeDateData = async (semesterId) => {
        try {
            const timeWeekResponse = await getAllTimeWeekWithSemester(semesterId);
            const timeDayResponse = await getAllTimeDayWithSemester(semesterId);
            const timeDateResponse = await getAllWithSemester(semesterId);
            if (timeWeekResponse && timeWeekResponse.dt) {
                const timeWeeksData = timeWeekResponse.dt.map((timeWeek, index) => ({
                    id: index + 1,
                    name: timeWeek,
                }));
                setTimeWeeks(timeWeeksData);
            }
            if (timeDayResponse && timeDayResponse.dt) {
                const timeDaysData = timeDayResponse.dt.map((timeDay, index) => ({
                    id: index + 1,
                    name: timeDay,
                }));
                setTimeDays(timeDaysData);
            }
            if (timeDateResponse && timeDateResponse.dt) {
                const timeDatesData = timeDateResponse.dt.map(timeDate => ({
                    id: timeDate.id,
                    name: timeDate.studyDate,
                }));
                setTimeDates(timeDatesData);
            }
        } catch (error) {
            console.error('Error fetching schedule data:', error);
            toast.error('Failed to fetch schedule data');
        }
    };

    useEffect(() => {
        if (classId && semesterId) {
            const fetchData = async () => {
                try {
                    await fetchClassData(classId);
                    await fetchScheduleData(semesterId);
                    await fetchTimeDateData(semesterId);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    toast.error('Failed to fetch data');
                }
            };

            fetchData();
        }

    }, [action, semesterId, classId]);


    const handleGradeChange = (selectedOption) => {
        setSelectedGrade(selectedOption.value);
        setSelectedGradeLabel(selectedOption.label);
        setTimeTableData(prevState => ({
            ...prevState,
            subject: {
                id: '',
                name: ''
            }
        }));
        if (selectedOption.value === '') {
            setSelectedGradeLabel('Chọn khối học');
            setSelectedGrade('');
        }
    };
    const handleGroupChange = (selectedOption) => {
        setSelectedGroup(selectedOption.value);
        setSelectedGroupLabel(selectedOption.label);
        setTimeTableData(prevState => ({
            ...prevState,
            teacher: {
                id: '',
                firstName: '',
                lastName: '',
            }
        }));
        if (selectedOption.value === '') {
            setSelectedGroupLabel('Chọn nhóm chuyên môn');
            setSelectedGroup('');
        }
    };

    useEffect(() => {
        if (selectedGrade && selectedGrade !== '') {
            fetchSubjectData();
        }
    }, [selectedGrade]);
    const fetchSubjectData = async () => {
        try {
            let subjectResponse = await getAllBySemesterAndGrade(+semesterId, selectedGrade);

            if (subjectResponse && subjectResponse.dt) {

                const subjectsData = subjectResponse.dt.map(subject => ({
                    name: subject.name,
                    id: subject.id
                }));
                setSubjects(subjectsData);
            }
        } catch (error) {
            console.error('Error fetching class data:', error);
            toast.error('Failed to fetch class data');
        }
    };


    useEffect(() => {
        if (action === 'UPDATE' && dataModalTimeTable) {
            setTimeTableData(dataModalTimeTable);
        } else {
            setTimeTableData({
                ...defaultTimeTableData,
                schoolClass: {
                    id: schoolId
                }
            });
        }
    }, [dataModalTimeTable, action]);

    const handleConfirmTimeTable = async () => {
        let response;
        if (action === "CREATE") {
            response = await createNewTimeTable(timeTableData);
        } else {
            response = await updateCurrentTimeTable(timeTableData);
        }

        if (response && response.ec === 0) {
            props.onHide();
            setTimeTableData({
                ...defaultTimeTableData,
                schoolClass: {
                    id: schoolId
                }
            });
            setSelectedGradeLabel('Chọn khối học');
            setSelectedGrade('');
            setSubjects('')
            setSelectedGroupLabel('Chọn nhóm chuyên môn');
            setSelectedGroup('');
            setTeachers('')
            toast.success(response.em)
        }
        if (response && response.ec !== 0) {
            toast.error(response.em);
        }
    };

    const handleCloseModalTimeTable = () => {
        onHide();
        setTimeTableData({
            ...defaultTimeTableData,
            schoolClass: {
                id: schoolId
            }
        });
        setSelectedGradeLabel('Chọn khối học');
        setSelectedGrade('');
        setSubjects('')
        setSelectedGroupLabel('Chọn nhóm chuyên môn');
        setSelectedGroup('');
        setTeachers('')
    };

    const handleOnChangeSubject = (selectedOption, field) => {
        if (selectedOption) {
            setTimeTableData(prevState => ({
                ...prevState,
                subject: {
                    ...prevState.subject,
                    id: selectedOption.id,
                    name: selectedOption.value
                }
            }));
        }
    };
    const handleOnChangeTeacher = (selectedOption, field) => {
        if (selectedOption) {
            setTimeTableData(prevState => ({
                ...prevState,
                teacher: {
                    id: selectedOption.id,
                    firstName: selectedOption.firstName,
                    lastName: selectedOption.lastName,
                }
            }));
        }
    };

    // Fetch data Teacher Ready
    const handleOnChangeSchedule = (selectedOptions) => {
        setTimeTableData(prevState => ({
            ...prevState,
            schedules: selectedOptions.map(option => ({
                id: option.value,
                name: option.label
            }))
        }));

        if (selectedOptions && selectedOptions.length > 0) {
            const selectedSchedules = selectedOptions.map(option => option.value);
            fetchTeacherData(selectedSchedules);
        }
    };

    const handleOnChangeTimeWeekTable = (selectedOptions) => {
        setTimeTableData(prevState => ({
            ...prevState,
            timeWeeks: selectedOptions.map(option => ({
                id: option.value,
                name: option.label,
                studyWeek: option.label,
            }))
        }));

        if (selectedOptions && selectedOptions.length > 0) {
            const newWeeks = selectedOptions.filter(option => !timeTableData.timeWeeks.some(week => week.name === option.label));
            if (newWeeks.length > 0) {
                const updatedWeeks = [
                    ...timeTableData.timeWeeks,
                    ...newWeeks.map(option => ({ id: option.value, name: option.label, studyWeek: option.label }))
                ];
                const selectedSchedules = timeTableData.schedules.map(schedule => schedule.id);
                const selectedWeeks = updatedWeeks.map(week => week.name);
                const selectedDays = timeTableData.timeDays.map(day => day.name);
                fetchTeacherData(selectedSchedules, selectedWeeks, selectedDays);
            }
        }
    };

    const handleOnChangeTimeDayTable = (selectedOptions) => {
        setTimeTableData(prevState => ({
            ...prevState,
            timeDays: selectedOptions.map(option => ({
                id: option.value,
                name: option.label,
                studyDay: option.label,
            }))
        }));

        if (selectedOptions && selectedOptions.length > 0) {
            const newDays = selectedOptions.filter(option => !timeTableData.timeDays.some(day => day.name === option.label));
            if (newDays.length > 0) {
                const updatedDays = [
                    ...timeTableData.timeDays,
                    ...newDays.map(option => ({ id: option.value, name: option.label, studyDay: option.label }))
                ];
                const selectedSchedules = timeTableData.schedules.map(schedule => schedule.id);
                const selectedWeeks = timeTableData.timeWeeks.map(week => week.name);
                const selectedDays = updatedDays.map(day => day.name);
                fetchTeacherData(selectedSchedules, selectedWeeks, selectedDays);
            }
        }
    };



    useEffect(() => {
        if (selectedGroup && selectedGroup !== ''
            && timeTableData.schedules?.length > 0
            && timeTableData.timeWeeks?.length > 0
            && timeTableData.timeDays?.length > 0) {
            const selectedSchedules = timeTableData.schedules.map(schedule => schedule.id);
            const selectedWeeks = timeTableData.timeWeeks.map(week => week.name);
            const selectedDays = timeTableData.timeDays.map(day => day.name);
            fetchTeacherData(selectedSchedules, selectedWeeks, selectedDays);
        }
    }, [selectedGroup, timeTableData.schedules, timeTableData.timeWeeks, timeTableData.timeDays]);

    const fetchTeacherData = async (selectedSchedules, selectedWeeks, selectedDays) => {
        try {
            let teacherResponse = await getAllTeacherBySchoolAndGroupReady(+schoolId, selectedGroup, selectedSchedules, selectedWeeks, selectedDays);

            if (teacherResponse && teacherResponse.dt) {
                const teachersData = teacherResponse.dt.map(teacher => ({
                    id: teacher.id,
                    firstName: teacher.firstName,
                    lastName: teacher.lastName,
                }));
                setTeachers(teachersData);
            }
        } catch (error) {
            console.error('Error fetching class data:', error);
        }
    };


    const handleOnChangeInput = (value, fieldName) => {
        setTimeTableData(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };
    const handleOnChangeEditTimeTable = (selectedOption) => {
        setTimeTableData(prevState => ({
            ...prevState,
            timeTable: { id: selectedOption.value, studyDate: selectedOption.label }
        }));
    };

    const handleOnChangeEditSchedule = (selectedOption) => {
        setTimeTableData(prevState => ({
            ...prevState,
            schedule: { id: selectedOption.value, name: selectedOption.label }
        }));

        if (selectedOption) {
            const requestData = { selectedSchedules: [selectedOption.value] };
            fetchTeacherData(requestData);
        }
    };
    return (
        <Modal size="lg" show={show} className='modal-timeTable' onHide={handleCloseModalTimeTable}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? 'Tạo mới thời khóa biểu' : 'Chỉnh sửa ngày học'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>

                    <div className='col-12 form-role'>
                        <div className='row py-3'>
                            {action === 'CREATE' &&
                                <div className='col-6'>
                                    <label>Khối học(<span className='text-danger'>*</span>):</label>
                                    <Select
                                        value={{ value: selectedGrade, label: selectedGradeLabel }}
                                        className='fw-bold'
                                        onChange={handleGradeChange}
                                        options={[{ value: '', label: 'Chọn Khối học' }, ...gradeNames.map(grade => ({ value: grade, label: grade }))]}
                                        placeholder="Chọn Khối học"
                                    />
                                </div>
                            }
                            <div className='col-6'>

                                <label>Môn học(<span className='text-danger'>*</span>):</label>
                                <Select
                                    className='basic-single fw-bold'
                                    classNamePrefix='select'
                                    options={subjects && subjects.length > 0 ? subjects.map(subject => ({ value: subject.name, label: subject.name, id: subject.id })) : []}
                                    value={timeTableData.subject && timeTableData.subject.name ? { value: timeTableData.subject.name, label: timeTableData.subject.name } : ''}
                                    onChange={(selectedOption) => handleOnChangeSubject(selectedOption, "subject")}
                                    placeholder="Search subject..."
                                />
                            </div>

                        </div>
                    </div>

                    <div className='col-12 form-role'>
                        <label>Lớp học(<span className='text-danger'>*</span>):</label>
                        {sClass && (
                            <div>
                                <input
                                    className='form-control fw-bold'
                                    type="text" value={sClass.name} readOnly />
                            </div>
                        )}
                    </div>

                    <div className='col-12 form-role'>
                        <label>Tiết học(<span className='text-danger'>*</span>):</label>
                        {action === 'CREATE' ? (
                            <Select
                                className='basic-single fw-bold'
                                classNamePrefix='select'
                                options={schedules && schedules.length > 0 ? schedules.map(schedule => ({ value: schedule.id, label: schedule.name })) : []}
                                value={timeTableData && timeTableData.schedules ? timeTableData.schedules.map(schedule => ({ value: schedule.id, label: schedule.name })) : []}
                                onChange={(selectedOption) => handleOnChangeSchedule(selectedOption, "schedule")}
                                placeholder="Chọn tiết học..."
                                isMulti
                            />
                        ) : (
                            <Select
                                className='basic-single fw-bold'
                                classNamePrefix='select'
                                options={schedules && schedules.length > 0 ? schedules.map(schedule => ({ value: schedule.id, label: schedule.name })) : []}
                                value={timeTableData.schedule ? { value: timeTableData.schedule.name, label: timeTableData.schedule.name, id: timeTableData.schedule.id } : ''}
                                onChange={(selectedOption) => handleOnChangeEditSchedule(selectedOption, "schedule")}
                                placeholder="Chọn tiết học..."
                            />
                        )}
                    </div>
                    <div className='col-12 form-role'>
                        {action === 'CREATE' ? (
                            <>
                                <label>Tuần học(<span className='text-danger'>*</span>):</label>
                                <Select
                                    className='basic-single fw-bold'
                                    classNamePrefix='select'
                                    options={timeWeeks && timeWeeks.length > 0 ? timeWeeks.map(timeWeek => ({ value: timeWeek.id, label: timeWeek.name })) : []}
                                    value={timeTableData && timeTableData.timeWeeks ? timeTableData.timeWeeks.map(timeTable => ({ value: timeTable.id, label: timeTable.studyWeek })) : []}
                                    onChange={(selectedOptions) => handleOnChangeTimeWeekTable(selectedOptions)}
                                    placeholder="Chọn tuần học..."
                                    isMulti
                                />
                                <label>Ngày(<span className='text-danger'>*</span>):</label>
                                <Select
                                    className='basic-single fw-bold'
                                    classNamePrefix='select'
                                    options={timeDays && timeDays.length > 0 ? timeDays.map(timeDay => ({ value: timeDay.id, label: timeDay.name })) : []}
                                    value={timeTableData && timeTableData.timeDays ? timeTableData.timeDays.map(timeTable => ({ value: timeTable.id, label: timeTable.studyDay })) : []}
                                    onChange={(selectedOptions) => handleOnChangeTimeDayTable(selectedOptions)}
                                    placeholder="Chọn ngày học..."
                                    isMulti
                                />
                            </>

                        ) : (
                            <>
                                <label>Ngày học(<span className='text-danger'>*</span>):</label>

                                <Select
                                    className='basic-single fw-bold'
                                    classNamePrefix='select'
                                    options={timeDates && timeDates.length > 0 ? timeDates.map(timeDate => ({ value: timeDate.id, label: timeDate.name })) : []}
                                    value={timeTableData.timeTable ? { value: timeTableData.timeTable.studyDate, label: timeTableData.timeTable.studyDate, id: timeTableData.timeTable.id } : ''}
                                    onChange={(selectedOption) => handleOnChangeEditTimeTable(selectedOption, "timeTable")}
                                    placeholder="Chọn ngày học..."

                                />
                            </>

                        )}

                    </div>

                    <div className='col-12 form-role'>
                        <div className='row py-3'>
                            {action === 'CREATE' &&
                                <div className='col-6 '>
                                    <label>Nhóm chuyên môn(<span className='text-danger'>*</span>):</label>
                                    <Select
                                        value={{ value: selectedGroup, label: selectedGroupLabel }}
                                        className='fw-bold'
                                        onChange={handleGroupChange}
                                        options={[{ value: '', label: 'Chọn Khối học' }, ...groupNames.map(grade => ({ value: grade, label: grade }))]}
                                        placeholder="Chọn Nhóm chuyên môn"
                                    />
                                </div>
                            }
                            <div className='col-6'>
                                <label>Giáo viên(<span className='text-danger'>*</span>):</label>
                                <Select
                                    className='basic-single fw-bold'
                                    classNamePrefix='select'
                                    options={teachers && teachers.length > 0 ? teachers.map(teacher => ({ value: `${teacher.firstName} ${teacher.lastName}`, label: `${teacher.firstName} ${teacher.lastName}`, id: teacher.id, firstName: teacher.firstName, lastName: teacher.lastName })) : []}
                                    value={timeTableData.teacher ? { value: `${timeTableData.teacher.firstName} ${timeTableData.teacher.lastName}`, label: `${timeTableData.teacher.firstName} ${timeTableData.teacher.lastName}`, id: timeTableData.teacher.id } : ''}
                                    onChange={(selectedOption) => handleOnChangeTeacher(selectedOption, "teacher")}
                                    placeholder="Search teacher..."
                                />
                            </div>
                        </div>
                    </div>


                    <div className='col-12 form-role'>
                        <label>Ghi chú:</label>
                        <input
                            className='form-control fw-bold'
                            type="text"
                            value={timeTableData.classComment}
                            onChange={(event) => handleOnChangeInput(event.target.value, "classComment")}
                            placeholder="Nhập ghi chú.."
                        />
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalTimeTable}>Đóng</Button>
                <Button variant="primary" onClick={handleConfirmTimeTable}>
                    {action === 'CREATE' ? 'Lưu' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default ModalTimeTable;
