import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode, setDarkMode, setLightMode } from '../../redux/actions/darkModeActions';
import { useEffect, useState } from "react";
import { fetchUserWithUsername, fetchCountNotificationUnReadWithUsername } from "../../services/userServices";
import { Link } from "react-router-dom/cjs/react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const user = useSelector(state => state.user);
  const username = user?.dataRedux?.account?.username || '';

  const [account, setAccount] = useState('');
  const [notificationUnReadCount, setNotificationCountUnRead] = useState(0);

  useEffect(() => {
    fetchAccount()
  }, [user])


  const fetchAccount = async () => {
    const accountResponse = await fetchUserWithUsername(username);
    const notificationResponse = await fetchCountNotificationUnReadWithUsername(username);
    console.log(accountResponse)
    if (accountResponse && accountResponse.ec === 0) {
      setAccount(accountResponse.dt)
    }
    if (notificationResponse && notificationResponse.ec === 0) {
      setNotificationCountUnRead(notificationResponse.dt)
    }
  }


  return (
    <div className="navbar">
      <div className="wrapper">
        <div >
        </div>
        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            Tiếng Việt
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={handleToggleDarkMode}
            />
          </div>
          <Link to="/notifications" style={{ textDecoration: "none" }}>
            <div className="item">
              <NotificationsNoneOutlinedIcon className="icon" />
              <div className="counter">{notificationUnReadCount}</div>
            </div>
          </Link>

          <div className="item">
            <img
              src={account && account?.avatar ? account.avatar : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
              className="avatar"
            />
            {account ? `${account?.firstName} ${account?.lastName}` : username}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
