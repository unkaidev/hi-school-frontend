import React, { useEffect, useState } from "react";
import './notifications.scss';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { changeStatusNotification, fetchAllNotificationWithUsername, fetchCountNotificationUnReadWithUsername } from '../../services/userServices'
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import _, { set } from "lodash";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Scrollbars from "react-custom-scrollbars-2";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff, faUserXmark, faUser, faPeopleRoof, faEnvelopesBulk, faEnvelopeOpen, faEnvelopeCircleCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons';


const Notifications = (props) => {

    const [listNotifications, setListNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");
    const user = useSelector(state => state.user);
    const schoolId = user?.dataRedux?.account?.schoolId || [];
    const username = user?.dataRedux?.account?.username || '';
    const roles = user?.dataRedux?.account?.roles || [];

    const history = useHistory();
    const [isTeacher, setIsTeacher] = useState(false);
    const [isStudent, setIsStudent] = useState(false);

    const [notificationUnReadCount, setNotificationCountUnRead] = useState(0);


    useEffect(() => {
        fetchNotifications();
    }, [currentPage]);

    const fetchNotifications = async () => {
        let response = await fetchAllNotificationWithUsername(currentPage, currentLimit, username);

        let notificationResponse = await fetchCountNotificationUnReadWithUsername(username);
        if (notificationResponse && notificationResponse.ec === 0) {
            setNotificationCountUnRead(notificationResponse.dt)
        }
        if (response && response.dt && response.ec === 0) {
            setTotalPages(response.dt.totalPages);
            setListNotifications(response.dt.content);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };


    const handleRefresh = async () => {
        window.location.reload()
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListNotifications = _.cloneDeep(listNotifications);
        cloneListNotifications = _.orderBy(cloneListNotifications, [sortField], [sortBy]);
        setListNotifications(cloneListNotifications);
    };

    const handleSearch = _.debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneListNotifications = _.cloneDeep(listNotifications);
            cloneListNotifications = cloneListNotifications.filter((item) =>
                item.content.toLowerCase().includes(term)
            );
            setListNotifications(cloneListNotifications);
        } else {
            fetchNotifications();
        }
    }, 300);

    const toggleRead = async (itemId) => {
        try {
            const statusResponse = await changeStatusNotification(itemId);
            if (statusResponse && statusResponse.ec === 0) {
                fetchNotifications();
                toast.success(statusResponse.em);
            }

        } catch (error) {

        }
    };

    const [readCount, setReadCount] = useState(0);
    const checkReadCount = (notifications) => {
        if (!notifications) return 0;
        return notifications.filter(item => item.read).length;
    };

    useEffect(() => {
        setReadCount(checkReadCount(listNotifications));
    }, [listNotifications]);

    const [scrollHeight, setScrollHeight] = useState(0);

    useEffect(() => {
        let windowHeight = window.innerHeight;
        setScrollHeight(windowHeight);
    }, [])

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

    return (
        <>
            <div className="home">
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />

                    <Scrollbars autoHide style={{ height: scrollHeight, width: 'auto' }}>
                        <div className="container">
                            <div className="col-12 col-sm-4 my-3">
                                <div className="row">
                                    <div className="search col-7">
                                        <input
                                            placeholder="Tìm theo nội dung...."
                                            onChange={(event) => handleSearch(event)}
                                        />
                                        <SearchOutlinedIcon />
                                    </div>

                                </div>

                            </div>

                            <div className="manage-students-container">
                                <div className="student-header row">
                                    <div className="title mt-3">
                                        <h3>Thông báo</h3>
                                    </div>
                                    <div className="actions my-3">
                                        <div className="header-left col-6">
                                            <button
                                                className="btn btn-success refresh"
                                                onClick={handleRefresh}
                                            >
                                                <i className="fa fa-refresh"></i>Làm mới
                                            </button>

                                        </div>
                                        <div className="header-right col-6">
                                            <h4>
                                                {notificationUnReadCount + readCount}
                                                <FontAwesomeIcon icon={faEnvelopesBulk} title="Tổng thư"
                                                    className="mx-3"
                                                />
                                            </h4>
                                            <h5>
                                                <label className="text-primary">{readCount}
                                                    <FontAwesomeIcon icon={faEnvelopeOpen} title="Đã mở"
                                                        className="mx-3"
                                                    />
                                                </label>
                                                <label className="text-danger">{notificationUnReadCount}

                                                    <FontAwesomeIcon icon={faEnvelope} title="Chưa mở"
                                                        className="mx-3"
                                                    />
                                                </label>
                                            </h5>

                                        </div>
                                    </div>
                                </div>
                                <div className="student-body">
                                    <table className="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">STT</th>
                                                <th>
                                                    <div className="sort-header">
                                                        <span>ID</span>
                                                        <span>
                                                            <i
                                                                className="fa-solid fa-arrow-down-long"
                                                                onClick={() => handleSort("desc", "id")}
                                                            ></i>
                                                            <i
                                                                className="fa-solid fa-arrow-up-long"
                                                                onClick={() => handleSort("asc", "id")}
                                                            ></i>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th scope="col">Người nhận</th>
                                                <th scope="col">Người gửi</th>
                                                <th scope="col">Nội dung</th>
                                                <th scope="col">Thời gian gửi</th>
                                                <th scope="col">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listNotifications && listNotifications.length > 0 ? (
                                                <>
                                                    {listNotifications.map((item, index) => {
                                                        console.log(item.read)
                                                        return (
                                                            <tr key={`row-${index}`} >
                                                                <td>{currentPage * currentLimit + index + 1}</td>
                                                                <td>{item.id}</td>
                                                                <td>{item.receiver.username}</td>
                                                                <td>{item.sender ? item.sender.username : "Hệ thống"}</td>
                                                                <td>{item.content}</td>
                                                                <td>{formatTimeFromTimestamp(item.createdAt)}</td>

                                                                <td className="text-center">
                                                                    {item.read ? (
                                                                        < FontAwesomeIcon icon={faToggleOn} className="toggle-icon on fs-3 text-primary"
                                                                            role="button"
                                                                            title="Có mặt"
                                                                            onClick={() => toggleRead(item.id)}
                                                                        />
                                                                    ) : (
                                                                        <FontAwesomeIcon icon={faToggleOff} className="toggle-icon off fs-3 text-danger"
                                                                            role="button"
                                                                            title="Vắng"
                                                                            onClick={() => toggleRead(item.id)}
                                                                        />
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </>
                                            ) : (
                                                <>
                                                    <tr>
                                                        <td>Not found Notification</td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 0 && (
                                    <div className="student-footer">
                                        <ReactPaginate
                                            nextLabel="next >"
                                            onPageChange={handlePageClick}
                                            pageRangeDisplayed={3}
                                            marginPagesDisplayed={2}
                                            pageCount={totalPages}
                                            previousLabel="< previous"
                                            pageClassName="page-item"
                                            pageLinkClassName="page-link"
                                            previousClassName="page-item"
                                            previousLinkClassName="page-link"
                                            nextClassName="page-item"
                                            nextLinkClassName="page-link"
                                            breakLabel="..."
                                            breakClassName="page-item"
                                            breakLinkClassName="page-link"
                                            containerClassName="pagination"
                                            activeClassName="active"
                                            renderOnZeroPageCount={null}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Scrollbars>


                </div>
            </div>
        </>
    );
};

export default Notifications;
