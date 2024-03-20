import "./years.scss";
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import SubjectIcon from '@mui/icons-material/Subject';
import ModalListYears from '../ManagerYears/years/ModalListYears';

const Years = (props) => {

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
                <span >
                  <a href="/list-years">"Xem tất cả"</a>
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
            <div className="widget">
              <div className="left">
                <span className="title">KỲ HỌC</span>
                <span >
                  <a href="/list-semesters">"Xem tất cả"</a>
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
            <div className="widget">
              <div className="left">
                <span className="title">THỜI GIAN BIỂU</span>
                <span >
                  <a href="/list-schedules">"Xem tất cả"</a>
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
            <div className="widget">
              <div className="left">
                <span className="title">MÔN HỌC</span>
                <a href="/list-subjects">"Xem tất cả"</a>
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
    </>

  );

};

export default Years;
