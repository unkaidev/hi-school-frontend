import "./students.scss";
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import SubjectIcon from '@mui/icons-material/Subject';
import { countAllStudentsInSchool } from "../../services/schoolServices";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PersonIcon from '@mui/icons-material/Person';
import GiteIcon from '@mui/icons-material/Gite';
import { countAllClassInSchool } from "../../services/schoolServices";

const Students = (props) => {
  const [allClassCount, setAllClassCount] = useState(0);

  const user = useSelector(state => state.user);
  const username = user?.dataRedux?.account?.username || '';
  const schoolId = user?.dataRedux?.account?.schoolId || [];

  const [allStudentsCount, setAllStudentsCount] = useState(0);

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    const allStudentsRes = await countAllStudentsInSchool(schoolId);
    const allClassRes = await countAllClassInSchool(schoolId);


    if (allClassRes && allClassRes.ec === 0) {
      setAllClassCount(allClassRes.dt)
    }

    if (allStudentsRes && allStudentsRes.ec === 0) {
      setAllStudentsCount(allStudentsRes.dt)
    }

  }


  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <div className="widget">
            <div className="left">
              <span className="title">HỌC SINH</span>
              {allStudentsCount}
              <span >
                <a href="/list-students">"Xem tất cả"</a>
              </span>
            </div>
            <div className="right">
              <PersonIcon
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
              <span className="title">LỚP HỌC</span>
              {allClassCount}
              <span >
                <a href="/list-school-classes">"Xem tất cả"</a>
              </span>
            </div>
            <div className="right">

              <GiteIcon
                className="icon"
                style={{
                  backgroundColor: "rgba(0, 128, 0, 0.2)",
                  color: "green"
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Students;
