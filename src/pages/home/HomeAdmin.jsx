import "./home.scss";
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import { useEffect, useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  fetchCountUserWithUsername, fetchCountSchoolWithUsername, fetchCountUserToday, fetchCountSchoolToday,
  fetchCountAllUserWithUsername, fetchCountAllUserToday, countUsersByMonth
} from "../../services/userServices";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { useSelector } from "react-redux";
import { fetchLatestSchool, countSchoolsByMonth } from "../../services/schoolServices";
import Chart from "../../components/chart/Chart";

const HomeAdmin = (props) => {

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const year = currentDate.getFullYear();

  const fullDate = day + '/' + month + '/' + year;


  const user = useSelector(state => state.user);
  const username = user?.dataRedux?.account?.username || '';

  const [userCount, setUserCount] = useState(0);
  const [userCountToday, setUserCountToday] = useState(0);
  const [schoolCount, setSchoolCount] = useState(0);
  const [schoolCountToday, setSchoolCountToday] = useState(0);

  const [allUserCount, setAllUserCount] = useState(0);
  const [allUserCountToday, setAllUserCountToday] = useState(0);

  const [latestSchool, setLatestSchool] = useState({});


  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    const userCountResponse = await fetchCountUserWithUsername(username);
    const schoolCountResponse = await fetchCountSchoolWithUsername(username);
    const userCountTodayRes = await fetchCountUserToday(username, fullDate);
    const schoolCountTodayRes = await fetchCountSchoolToday(username, fullDate);
    const allUserCountResponse = await fetchCountAllUserWithUsername(username);
    const allUserCountTodayResponse = await fetchCountAllUserToday(username, fullDate);
    const latestSchoolRes = await fetchLatestSchool();

    if (userCountResponse && userCountResponse.ec === 0) {
      setUserCount(userCountResponse.dt)
    }
    if (schoolCountResponse && schoolCountResponse.ec === 0) {
      setSchoolCount(schoolCountResponse.dt)
    }
    if (userCountTodayRes && userCountTodayRes.ec === 0) {
      setUserCountToday(userCountTodayRes.dt)
    }
    if (schoolCountTodayRes && schoolCountTodayRes.ec === 0) {
      setSchoolCountToday(schoolCountTodayRes.dt)
    }
    if (allUserCountResponse && allUserCountResponse.ec === 0) {
      setAllUserCount(allUserCountResponse.dt)
    }
    if (allUserCountTodayResponse && allUserCountTodayResponse.ec === 0) {
      setAllUserCountToday(allUserCountTodayResponse.dt)
    }
    if (latestSchoolRes && latestSchoolRes.ec === 0) {
      setLatestSchool(latestSchoolRes.dt)
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
  const [schoolStatistics, setSchoolStatistics] = useState([]);
  const [userStatistics, setUserStatistics] = useState([]);


  const fetchDataStatistics = async () => {
    try {
      const [schResponse, usResponse] = await Promise.all([
        countSchoolsByMonth(currentYear),
        countUsersByMonth(currentYear)
      ]);

      const formattedScData = schResponse.dt.map((item) => ({
        name: `Tháng ${item[0]}`,
        Total: item[1]
      }));
      setSchoolStatistics(formattedScData);

      const formattedUsData = usResponse.dt.map((item) => ({
        name: `Tháng ${item[0]}`,
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
              <span className="title">TRƯỜNG HỌC</span>
              <span className="counter">
                {schoolCount}
              </span>
              <span >
                <a href="/schools">"Xem tất cả"</a>
              </span>
            </div>
            <div className="right">
              <div className="percentage positive">
                {schoolCountToday}
                <KeyboardArrowUpIcon />
              </div>
              <HomeWorkIcon
                className="icon"
                style={{
                  backgroundColor: "rgba(0, 128, 0, 0.2)",
                  color: "green"
                }}
              />
            </div>
          </div>

          <div className="widget">
            <div className="left">
              <span className="title">TÀI KHOẢN TOÀN HỆ THỐNG</span>
              <span className="counter">
                {allUserCount}
              </span>
              <span>
                <span>
                  <a href="#"></a>
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
              <span className="title">NHÀ TRƯỜNG MỚI NHẤT</span>
              <span className="counter">
                {latestSchool.name}
              </span>
              <span>
                <a href="#">Khởi tạo: {formatTimeFromTimestamp(latestSchool.createdAt)}</a>
              </span>

            </div>
            <div className="right">
              <div className="percentage positive">
                {latestSchool.address?.wardCommune}, {latestSchool.address?.district}, {latestSchool.address?.province}, {latestSchool.address?.city}
                <AddLocationAltIcon />
              </div>
              <HomeWorkIcon
                className="icon"
                style={{
                  backgroundColor: "rgba(0, 128, 0, 0.2)",
                  color: "green"
                }}
              />
            </div>
          </div>

          {/* render graph */}
          <>
            <div>
              <div className="container">
                <div className="row">
                  <label
                    className="col form-role"
                  >Thống kê năm:</label>
                  <input
                    className="form-control col"
                    type="number" value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} />
                </div>
              </div>
              <div>
                <Chart title={"Thống kê người dùng theo tháng"}
                  aspect={2 / 1}
                  data={userStatistics}
                ></Chart>
              </div>
            </div>

            <div>
              <div className="container">
                <div className="row">
                  <label
                    className="col form-role"
                  >Thống kê năm:</label>
                  <label
                    className="form-control col"
                    readOnly
                  >{currentYear}</label>

                </div>
              </div>
              <div>
                <Chart title={"Thống kê trường học theo tháng"}
                  aspect={2 / 1}
                  data={schoolStatistics}
                ></Chart>
              </div>
            </div>
          </>




        </div>

      </div>
    </div>
  );
};

export default HomeAdmin;
