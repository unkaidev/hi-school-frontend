import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoutes from "./PrivateRoutes";
import Login from '../pages/login/Login';
import HomeAdmin from '../pages/home/HomeAdmin';
import HomeManager from '../pages/home/HomeManager';
import HomeHeadTeacher from '../pages/home/HomeHeadTeacher'
import HomeTeacher from '../pages/home/HomeTeacher'
import HomeUser from '../pages/home/HomeUser';
import NotFound from '../pages/notFound/NotFound';
import Users from '../pages/AdminUsers/Users'
import Schools from '../pages/AdminSchools/Schools';
import Years from '../pages/ManagerYears/Years';
import ModalListYears from '../pages/ManagerYears/years/ModalListYears';
import ModalListSemesters from '../pages/ManagerYears/semesters/ModalListSemesters';
import ModalListSchedules from '../pages/ManagerYears/schedules/ModalListSchedules';
import Public from '../pages/public/Public';
import ModalListSubjects from '../pages/ManagerYears/subjects/ModalListSubjects';
import Students from '../pages/ManagerStudents/Students';
import ModalListStudents from '../pages/ManagerStudents/students/ModalListStudents';
import ManagerUsers from '../pages/ManagerUsers/Users'
import Teachers from '../pages/ManagerTeachers/Teachers';
import ModalListTeachers from '../pages/ManagerTeachers/teachers/ModalListTeachers';
import SchoolClasses from '../pages/ManagerSchoolClass/SchoolClasses';
import ModalListSchoolClasses from '../pages/ManagerSchoolClass/schoolClasses/ModalListSchoolClasses';
import StudentsInClass from '../pages/ManagerSchoolClass/schoolClasses/studentsInClass/StudentsInClass';
import AddStudentInClass from '../pages/ManagerSchoolClass/schoolClasses/studentsInClass/AddStudentInClass';
import TimeTables from '../pages/ManagerTimeTables/TimeTables';
import Transcripts from '../pages/ManagerStudents/transcripts/Transcripts'
import Scores from '../pages/ManagerStudents/transcripts/scores/Scores';
import TimeTable from '../pages/timetables/TimeTable';
import AttendanceStudents from '../pages/timetables/attendance/StudentsInClass'
import Profile from '../pages/user/profile/Profile';
import Password from '../pages/user/password/Password'
import Notifications from '../pages/Notification/Notifications';


const AppRoutes = () => {
    const user = useSelector(state => state.user);
    const isAuthenticated = user?.dataRedux?.isAuthenticated || false;
    const roles = user?.dataRedux?.account?.roles || [];

    return (
        <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoutes path="/admin" component={HomeAdmin} requiredRoles={['ROLE_ADMIN']} roles={roles} />
            <PrivateRoutes path="/manager" component={HomeManager} requiredRoles={['ROLE_MANAGER']} roles={roles} />
            <PrivateRoutes path="/headteacher" component={Profile} requiredRoles={['ROLE_HEADTEACHER']} roles={roles} />
            <PrivateRoutes path="/teacher" component={Profile} requiredRoles={['ROLE_TEACHER']} roles={roles} />
            <PrivateRoutes path="/user" component={Profile} requiredRoles={['ROLE_USER']} roles={roles} />

            <PrivateRoutes path="/users" component={Users} requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']} roles={roles} />
            <PrivateRoutes path="/schools" component={Schools} requiredRoles={['ROLE_ADMIN']} roles={roles} />

            <PrivateRoutes path="/manager-users" component={ManagerUsers} requiredRoles={['ROLE_MANAGER']} roles={roles} />

            <PrivateRoutes path="/years" component={Years} requiredRoles={['ROLE_MANAGER']} roles={roles} />
            <PrivateRoutes path="/list-years" component={ModalListYears} requiredRoles={['ROLE_MANAGER']} roles={roles} />
            <PrivateRoutes path="/list-semesters" component={ModalListSemesters} requiredRoles={['ROLE_MANAGER']} roles={roles} />
            <PrivateRoutes path="/list-schedules" component={ModalListSchedules} requiredRoles={['ROLE_MANAGER']} roles={roles} />
            <PrivateRoutes path="/list-subjects" component={ModalListSubjects} requiredRoles={['ROLE_MANAGER']} roles={roles} />

            <PrivateRoutes path="/students" component={Students} requiredRoles={['ROLE_MANAGER']} roles={roles} />
            <PrivateRoutes path="/list-students" component={ModalListStudents} requiredRoles={['ROLE_MANAGER', 'ROLE_HEADTEACHER']} roles={roles} />
            <PrivateRoutes path="/list-transcripts" component={Transcripts} requiredRoles={['ROLE_MANAGER', 'ROLE_TEACHER', 'ROLE_USER']} roles={roles} />
            <PrivateRoutes path="/list-scores" component={Scores} requiredRoles={['ROLE_MANAGER', 'ROLE_TEACHER', 'ROLE_USER']} roles={roles} />



            <PrivateRoutes path="/teachers" component={Teachers} requiredRoles={['ROLE_MANAGER']} roles={roles} />
            <PrivateRoutes path="/list-teachers" component={ModalListTeachers} requiredRoles={['ROLE_MANAGER']} roles={roles} />

            <PrivateRoutes path="/schoolClasses" component={SchoolClasses} requiredRoles={['ROLE_MANAGER']} roles={roles} />
            <PrivateRoutes path="/list-school-classes" component={ModalListSchoolClasses} requiredRoles={['ROLE_MANAGER', 'ROLE_HEADTEACHER', 'ROLE_USER']} roles={roles} />
            <PrivateRoutes path="/list-students-in-class" component={StudentsInClass} requiredRoles={['ROLE_MANAGER', 'ROLE_HEADTEACHER', 'ROLE_USER']} roles={roles} />
            <PrivateRoutes path="/add-student-to-class" component={AddStudentInClass} requiredRoles={['ROLE_MANAGER']} roles={roles} />

            <PrivateRoutes path="/timetables" component={TimeTables} requiredRoles={['ROLE_MANAGER']} roles={roles} />
            <PrivateRoutes path="/timetables-scheduler" component={TimeTable} requiredRoles={['ROLE_TEACHER', 'ROLE_USER']} roles={roles} />
            <PrivateRoutes path="/attendance" component={AttendanceStudents} requiredRoles={['ROLE_TEACHER', 'ROLE_USER']} roles={roles} />

            <PrivateRoutes path="/profile" component={Profile} requiredRoles={['ROLE_HEADTEACHER', 'ROLE_TEACHER', 'ROLE_USER']} roles={roles} />
            <Route path="/change-password" component={Password} />
            <Route path="/notifications" component={Notifications} />



            <Route path="/" component={Public} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
        </Switch>
    );
};

export default AppRoutes;
