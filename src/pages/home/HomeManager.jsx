import "./home.scss";
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import { useEffect, useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailIcon from '@mui/icons-material/Email';
import Diversity3Icon from '@mui/icons-material/Diversity3';


import {
  fetchCountUserWithUsername, fetchCountSchoolWithUsername, fetchCountUserToday, fetchCountSchoolToday,
  fetchCountAllUserWithUsername, fetchCountAllUserToday, countUsersByMonth, countUsersInSchoolByYear
} from "../../services/userServices";
import { fetchLatestStudent } from "../../services/studentServices";
import { useSelector } from "react-redux";
import { countSchoolsByMonth, countClassInSchoolByYear } from "../../services/schoolServices";
import Chart from "../../components/chart/Chart";
import { fetchLatestTeacher } from "../../services/teacherServices";

const HomeManager = (props) => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const year = currentDate.getFullYear();

  const fullDate = day + '/' + month + '/' + year;


  const user = useSelector(state => state.user);
  const username = user?.dataRedux?.account?.username || '';
  const schoolId = user?.dataRedux?.account?.schoolId || [];


  const [userCount, setUserCount] = useState(0);
  const [userCountToday, setUserCountToday] = useState(0);

  const [allUserCount, setAllUserCount] = useState(0);
  const [allUserCountToday, setAllUserCountToday] = useState(0);

  const [latestStudent, setLatestStudent] = useState({});
  const [latestTeacher, setLatestTeacher] = useState({});


  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    const userCountResponse = await fetchCountUserWithUsername(username);
    const userCountTodayRes = await fetchCountUserToday(username, fullDate);
    const allUserCountResponse = await fetchCountAllUserWithUsername(username);
    const allUserCountTodayResponse = await fetchCountAllUserToday(username, fullDate);
    const latestStudentRes = await fetchLatestStudent(username);
    const latestTeacherRes = await fetchLatestTeacher(username);


    if (userCountResponse && userCountResponse.ec === 0) {
      setUserCount(userCountResponse.dt)
    }

    if (userCountTodayRes && userCountTodayRes.ec === 0) {
      setUserCountToday(userCountTodayRes.dt)
    }

    if (allUserCountResponse && allUserCountResponse.ec === 0) {
      setAllUserCount(allUserCountResponse.dt)
    }
    if (allUserCountTodayResponse && allUserCountTodayResponse.ec === 0) {
      setAllUserCountToday(allUserCountTodayResponse.dt)
    }
    if (latestStudentRes && latestStudentRes.ec === 0) {
      setLatestStudent(latestStudentRes.dt)
    }
    if (latestTeacherRes && latestTeacherRes.ec === 0) {
      setLatestTeacher(latestTeacherRes.dt)
    }
  }

  function formatTimeFromTimestamp(timestamp) {
    var date = new Date(timestamp);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    var formattedTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return formattedTime;
  }

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [classStatistics, setClassStatistics] = useState([]);
  const [userStatistics, setUserStatistics] = useState([]);


  const fetchDataStatistics = async () => {
    try {
      const [classResponse, usResponse] = await Promise.all([
        countClassInSchoolByYear(schoolId),
        countUsersInSchoolByYear(schoolId)
      ]);

      console.log(usResponse)

      const formattedScData = classResponse.dt.map((item) => ({
        name: `Năm ${item[0]}`,
        Total: item[1]
      }));
      setClassStatistics(formattedScData);

      const formattedUsData = usResponse.dt.map((item) => ({
        name: `Năm ${item[0]}`,
        Total: item[1]
      }));
      setUserStatistics(formattedUsData);

    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchDataStatistics();
  }, [currentYear]);


  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">

          <div className="widget">
            <div className="left">
              <span className="title">TÀI KHOẢN QUẢN LÝ</span>
              <span className="counter">
                {userCount}
              </span>
              <span >
                <a href="/users">"Xem tất cả"</a>
              </span>
            </div>
            <div className="right">
              <div className="percentage positive">
                {userCountToday}
                <KeyboardArrowUpIcon />
              </div>
              <AdminPanelSettingsIcon
                className="icon"
                style={{
                  color: "crimson",
                  backgroundColor: "rgba(255, 0, 0, 0.2)",
                }}
              />
            </div>
          </div>

          <div className="widget">
            <div className="left">
              <span className="title">TÀI KHOẢN TOÀN TRƯỜNG</span>
              <span className="counter">
                {allUserCount}
              </span>
              <span>
                <span >
                  <a href="/manager-users">"Xem tất cả"</a>
                </span>
              </span>

            </div>
            <div className="right">
              <div className="percentage positive">
                {allUserCountToday}
                <KeyboardArrowUpIcon />
              </div>
              <PeopleAltIcon
                className="icon"
                style={{
                  color: "crimson",
                  backgroundColor: "rgba(255, 0, 0, 0.2)",
                }}
              />
            </div>
          </div>

          <div className="widget">
            <div className="left">
              <span className="title">GIÁO VIÊN MỚI NHẤT</span>
              <span className="counter">
                {latestTeacher && latestTeacher.firstName ? `${latestTeacher?.firstName} ${latestTeacher?.lastName}` : "Chưa có"}
              </span>
              <span>
                <p>Khởi tạo: {latestTeacher && latestTeacher.createdAt ? formatTimeFromTimestamp(latestTeacher?.createdAt) : "Chưa có"}</p>
                <a href="/list-teachers">Xem tất cả</a>

              </span>

            </div>
            <div className="right">
              <div className="percentage positive">
                {latestTeacher && latestTeacher.user ? latestTeacher?.user?.email : "Chưa có"}
                <EmailIcon />
              </div>
              <Diversity3Icon
                className="icon"
                style={{
                  color: "goldenrod",
                  backgroundColor: "rgba(218, 165, 32, 0.2)",
                }}
              />
            </div>
          </div>

          <div className="widget">
            <div className="left">
              <span className="title">HỌC SINH MỚI NHẤT</span>
              <span className="counter">
                {latestStudent && latestStudent.firstName ? `${latestStudent?.firstName} ${latestStudent?.lastName}` : "Chưa có"}
              </span>
              <span>
                <p>Khởi tạo: {latestStudent && latestStudent.createdAt ? formatTimeFromTimestamp(latestStudent?.createdAt) : "Chưa có"}</p>
                <a href="/list-students">Xem tất cả</a>

              </span>

            </div>
            <div className="right">
              <div className="percentage positive">
                {latestStudent && latestStudent.user ? latestStudent?.user?.email : "Chưa có"}
                <EmailIcon />
              </div>
              <PersonIcon
                className="icon"
                style={{
                  backgroundColor: "rgba(128, 0, 128, 0.2)",
                  color: "purple",
                }}
              />
            </div>
          </div>

          {/* render graph */}
          <>
            <div>
              <div>
                <Chart title={"Thống kê người dùng theo năm"}
                  aspect={2 / 1}
                  data={userStatistics}
                ></Chart>
              </div>
            </div>

            <div>
              <div>
                <Chart title={"Thống kê lớp học theo năm"}
                  aspect={2 / 1}
                  data={classStatistics}
                ></Chart>
              </div>
            </div>
          </>

        </div>

      </div>
    </div>
  );
};

export default HomeManager;
