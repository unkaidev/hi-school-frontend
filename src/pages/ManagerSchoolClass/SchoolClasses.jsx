import "./schoolClasses.scss";
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import SubjectIcon from '@mui/icons-material/Subject';
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { countAllClassInSchool, countAllTranscriptsInSchool } from "../../services/schoolServices";
import GiteIcon from '@mui/icons-material/Gite';


const SchoolClasses = (props) => {
  const user = useSelector(state => state.user);
  const username = user?.dataRedux?.account?.username || '';
  const schoolId = user?.dataRedux?.account?.schoolId || [];

  const [allClassCount, setAllClassCount] = useState(0);
  const [allTranscriptsCount, setAllTranscriptsCount] = useState(0);


  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    const allClassRes = await countAllClassInSchool(schoolId);
    const allTranscriptsRes = await countAllTranscriptsInSchool(schoolId);


    if (allClassRes && allClassRes.ec === 0) {
      setAllClassCount(allClassRes.dt)
    }
    if (allTranscriptsRes && allTranscriptsRes.ec === 0) {
      setAllTranscriptsCount(allTranscriptsRes.dt)
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
          <div className="widget">
            <div className="left">
              <span className="title">HỌC BẠ</span>
              {allTranscriptsCount}
              <span >
                <a href="/list-transcripts">"Xem tất cả"</a>
              </span>
            </div>
            <div className="right">

              <SubjectIcon
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

  );
};

export default SchoolClasses;
