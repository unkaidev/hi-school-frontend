import "./schoolClasses.scss";
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import SubjectIcon from '@mui/icons-material/Subject';

const SchoolClasses = (props) => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <div className="widget">
            <div className="left">
              <span className="title">LỚP HỌC</span>
              <span >
                <a href="/list-school-classes">"Xem tất cả"</a>
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
              <span className="title">HỌC BẠ</span>
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
