import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Featured = (props) => {

  const title = props.title
  const desc = props.desc
  const amount = props.amount;
  const value = props.value;



  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">{title}:</h1>
        <h1 className="title">{value}</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar
            value={(value / amount * 100).toFixed(2)}
            text={`${(value / amount * 100).toFixed(2)} %`}
            strokeWidth={5}
          />
        </div>
        <p className="title">Tổng số học sinh {desc}</p>
        <p className="amount">{amount}</p>
      </div>
    </div>
  );
};

export default Featured;
