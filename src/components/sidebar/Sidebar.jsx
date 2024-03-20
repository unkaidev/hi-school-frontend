import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode, setDarkMode, setLightMode } from '../../redux/actions/darkModeActions';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { logoutUser } from "../../services/userServices";
import { toast } from 'react-toastify';
import { handleLogoutRedux } from "../../redux/actions/userAction";
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import GiteIcon from '@mui/icons-material/Gite';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';

const Sidebar = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector(state => state.darkMode.darkMode);
  const handleSetDarkMode = () => {
    dispatch(setDarkMode());
  };

  const handleSetLightMode = () => {
    dispatch(setLightMode());
  };

  let history = useHistory();

  const handleLogout = async () => {
    let data = await logoutUser();
    localStorage.removeItem('hischool');
    await dispatch(handleLogoutRedux());

    if (data && +data.ec === 0) {
      toast.success('Logout success')
      history.push('/login')
    } else {
      toast.error(data.em)
    }
  }
  const user = useSelector(state => state.user);
  const roles = user?.dataRedux?.account?.roles || [];

  return (
    <div className="sidebar">
      <div>
        {roles.includes('ROLE_ADMIN') && (
          <>
            <div className="top">
              <Link to="/admin" style={{ textDecoration: "none" }}>
                <span className="logo">HiSchool</span>
              </Link>
            </div>
            <hr />
            <div className="center">
              <ul>
                <p className="title">MAIN</p>
                <Link to="/admin" style={{ textDecoration: "none" }}>
                  <li>
                    <DashboardIcon className="icon" />
                    <span>Bảng điều khiển</span>
                  </li>
                </Link>
                <p className="title">DANH SÁCH</p>
                <Link to="/schools" style={{ textDecoration: "none" }}>
                  <li>
                    <StoreIcon className="icon" />
                    <span>Trường học</span>
                  </li>
                </Link>
                <Link to="/users" style={{ textDecoration: "none" }}>
                  <li>
                    <PersonOutlineIcon className="icon" />
                    <span>Người dùng</span>
                  </li>
                </Link>

              </ul>
            </div>
          </>
        )}
        {roles.includes('ROLE_MANAGER') && (
          <>
            <div className="top">
              <Link to="/manager" style={{ textDecoration: "none" }}>
                <span className="logo">HiSchool</span>
              </Link>
            </div>
            <hr />
            <div className="center">
              <ul>
                <p className="title">MAIN</p>
                <Link to="/manager" style={{ textDecoration: "none" }}>
                  <li>
                    <DashboardIcon className="icon" />
                    <span>Bảng điều khiển</span>
                  </li>
                </Link>

                <p className="title">DANH SÁCH</p>
                <Link to="/manager-users" style={{ textDecoration: "none" }}>
                  <li>
                    <PersonOutlineIcon className="icon" />
                    <span>Người dùng</span>
                  </li>
                </Link>
                <Link to="/years" style={{ textDecoration: "none" }}>
                  <li>
                    <AddHomeWorkIcon className="icon" />
                    <span>Năm học</span>
                  </li>
                </Link>
                <Link to="/students" style={{ textDecoration: "none" }}>
                  <li>
                    <PeopleAltIcon className="icon" />
                    <span>Học sinh</span>
                  </li>
                </Link>
                <Link to="/teachers" style={{ textDecoration: "none" }}>
                  <li>
                    <Diversity3Icon className="icon" />
                    <span>Giáo viên</span>
                  </li>
                </Link>
                <Link to="/schoolClasses" style={{ textDecoration: "none" }}>
                  <li>
                    <GiteIcon className="icon" />
                    <span>Lớp học</span>
                  </li>
                </Link>
                <Link to="/timetables" style={{ textDecoration: "none" }}>
                  <li>
                    <CalendarMonthIcon className="icon" />
                    <span>Lịch giảng dạy</span>
                  </li>
                </Link>
              </ul>
            </div>
          </>
        )}
        {roles.includes('ROLE_TEACHER') && (
          <>
            <div className="top">
              <Link to="/admin" style={{ textDecoration: "none" }}>
                <span className="logo">HiSchool</span>
              </Link>
            </div>
            <hr />
            <div className="center">
              <ul>
                <p className="title">MAIN</p>
                <li>
                  <DashboardIcon className="icon" />
                  <span>Bảng điều khiển</span>
                </li>
                <p className="title">DANH SÁCH</p>

                <Link to="/list-transcripts" style={{ textDecoration: "none" }}>
                  <li>
                    <MenuBookIcon className="icon" />
                    <span>Học bạ</span>
                  </li>
                </Link>
                <Link to="/timetables-scheduler" style={{ textDecoration: "none" }}>
                  <li>
                    <CalendarMonthIcon className="icon" />
                    <span>Lịch giảng dạy</span>
                  </li>
                </Link>
              </ul>
            </div>
          </>
        )}
        {roles.includes('ROLE_HEADTEACHER') && (
          <>
            <div className="center">
              <ul>
                <Link to="/list-school-classes" style={{ textDecoration: "none" }}>
                  <li>
                    <GiteIcon className="icon" />
                    <span>Lớp học</span>
                  </li>
                </Link>
              </ul>
            </div>
          </>
        )}
        {roles.includes('ROLE_USER') && (
          <>
            <div className="top">
              <Link to="/student" style={{ textDecoration: "none" }}>
                <span className="logo">HiSchool</span>
              </Link>
            </div>
            <hr />
            <div className="center">
              <ul>
                <p className="title">MAIN</p>
                <li>
                  <DashboardIcon className="icon" />
                  <span>Bảng điều khiển</span>
                </li>
                <p className="title">DANH SÁCH</p>
                <Link to="/list-school-classes" style={{ textDecoration: "none" }}>
                  <li>
                    <GiteIcon className="icon" />
                    <span>Lớp học</span>
                  </li>
                </Link>
                <Link to="/list-transcripts" style={{ textDecoration: "none" }}>
                  <li>
                    <MenuBookIcon className="icon" />
                    <span>Học bạ</span>
                  </li>
                </Link>
                <Link to="/timetables-scheduler" style={{ textDecoration: "none" }}>
                  <li>
                    <CalendarMonthIcon className="icon" />
                    <span>Thời khóa biểu</span>
                  </li>
                </Link>
              </ul>
            </div>
          </>

        )
        }

        <div className="center">
          <ul>
            <p className="title">TIỆN ÍCH</p>
            <ul>
              {
                !roles.includes('ROLE_ADMIN') && (
                  <li>
                    <InsertChartIcon className="icon" />
                    <span>Thống kê</span>
                  </li>
                )
              }

              <Link to="/notifications" style={{ textDecoration: "none" }}>
                <li>
                  <NotificationsNoneIcon className="icon" />
                  <span>Thông báo</span>
                </li>
              </Link>
            </ul>
            <p className="title">NGƯỜI DÙNG</p>
            <ul>
              {!roles.includes('ROLE_MANAGER') && !roles.includes('ROLE_ADMIN') &&
                <>
                  <Link to="/profile" style={{ textDecoration: "none" }}>
                    <li>
                      <AccountCircleOutlinedIcon className="icon" />
                      <span>Hồ sơ</span>
                    </li>
                  </Link>
                </>
              }
              <Link to="/change-password" style={{ textDecoration: "none" }}>
                <li>
                  <PublishedWithChangesIcon className="icon" />
                  <span>Đổi mật khẩu</span>
                </li>
              </Link>

              <li onClick={handleLogout}>
                <ExitToAppIcon className="icon" />
                <span>Đăng xuất</span>
              </li>
            </ul>
          </ul>

        </div>
        <div className="bottom">
          <div
            className="colorOption"
            onClick={handleSetLightMode}
          ></div>
          <div
            className="colorOption"
            onClick={handleSetDarkMode}
          ></div>
        </div>
      </div>
    </div >
  );

}
export default Sidebar;
