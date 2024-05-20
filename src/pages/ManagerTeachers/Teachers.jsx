import "./teachers.scss";
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import SubjectIcon from '@mui/icons-material/Subject';
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { countAllTeachersInSchool } from "../../services/schoolServices";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import GiteIcon from '@mui/icons-material/Gite';
import { countAllClassInSchool } from "../../services/schoolServices";


const Teachers = (props) => {
  const [allClassCount, setAllClassCount] = useState(0);
  const user = useSelector(state => state.user);
  const username = user?.dataRedux?.account?.username || '';
  const schoolId = user?.dataRedux?.account?.schoolId || [];

  const [allTeachersCount, setAllTeachersCount] = useState(0);

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    const allTeachersRes = await countAllTeachersInSchool(schoolId);
    const allClassRes = await countAllClassInSchool(schoolId);


    if (allClassRes && allClassRes.ec === 0) {
      setAllClassCount(allClassRes.dt)
    }


    if (allTeachersRes && allTeachersRes.ec === 0) {
      setAllTeachersCount(allTeachersRes.dt)
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
              <span className="title">GIÁO VIÊN</span>
              {allTeachersCount}
              <span >
                <a href="/list-teachers">"Xem tất cả"</a>
              </span>
            </div>
            <div className="right">
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

export default Teachers;
