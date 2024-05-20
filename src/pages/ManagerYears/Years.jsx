import "./years.scss";
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import SubjectIcon from '@mui/icons-material/Subject';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';

import ModalListYears from '../ManagerYears/years/ModalListYears';
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { countAllSchedulesInSchool, countAllSemestersInSchool, countAllSubjectsInSchool, countAllYearsInSchool } from "../../services/schoolServices";

const Years = (props) => {

  const user = useSelector(state => state.user);
  const username = user?.dataRedux?.account?.username || '';
  const schoolId = user?.dataRedux?.account?.schoolId || [];

  const [allYearsCount, setAllYearsCount] = useState(0);
  const [allSemestersCount, setAllSemestersCount] = useState(0);
  const [allSchedulesCount, setAllSchedulesCount] = useState(0);
  const [allSubjectsCount, setAllSubjectsCount] = useState(0);

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    const allYearsCountRes = await countAllYearsInSchool(schoolId);
    const allSemesterCountRes = await countAllSemestersInSchool(schoolId);
    const allSchedulesCountRes = await countAllSchedulesInSchool(schoolId);
    const allSubjectsCountRes = await countAllSubjectsInSchool(schoolId);


    if (allYearsCountRes && allYearsCountRes.ec === 0) {
      setAllYearsCount(allYearsCountRes.dt)
    }
    if (allSemesterCountRes && allSemesterCountRes.ec === 0) {
      setAllSemestersCount(allSemesterCountRes.dt)
    }
    if (allSchedulesCountRes && allSchedulesCountRes.ec === 0) {
      setAllSchedulesCount(allSchedulesCountRes.dt)
    }
    if (allSubjectsCountRes && allSubjectsCountRes.ec === 0) {
      setAllSubjectsCount(allSubjectsCountRes.dt)
    }

  }


  return (
    <>

      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar />
          <div className="widgets">
            <div className="widget">
              <div className="left">
                <span className="title">NĂM HỌC</span>
                {allYearsCount}
                <span >
                  <a href="/list-years">"Xem tất cả"</a>
                </span>
              </div>
              <div className="right">
                <LooksOneIcon
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
                <span className="title">KỲ HỌC</span>
                {allSemestersCount}
                <span >
                  <a href="/list-semesters">"Xem tất cả"</a>
                </span>
              </div>
              <div className="right">

                <LooksTwoIcon
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
                <span className="title">THỜI GIAN BIỂU</span>
                {allSchedulesCount}
                <span >
                  <a href="/list-schedules">"Xem tất cả"</a>
                </span>
              </div>
              <div className="right">

                <Looks3Icon
                  className="icon"
                  style={{
                    backgroundColor: "rgba(128, 0, 128, 0.2)",
                    color: "purple",
                  }}
                />
              </div>
            </div>
            <div className="widget">
              <div className="left">
                <span className="title">MÔN HỌC</span>
                {allSubjectsCount}
                <a href="/list-subjects">"Xem tất cả"</a>
              </div>
              <div className="right">

                <Looks4Icon
                  className="icon"
                  style={{
                    color: "goldenrod",
                    backgroundColor: "rgba(218, 165, 32, 0.2)",
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>

  );

};

export default Years;
