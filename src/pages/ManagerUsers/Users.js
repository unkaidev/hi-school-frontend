import React, { useEffect, useState } from "react";
import "./users.scss"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { fetchUsersWithoutManagerAndAdmin, deleteUser } from "../../services/userServices";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalDelete from "../../components/modalDelete/ModalDelete";
import ModalUser from "./ModalUser";
import _, { debounce } from "lodash";
import Papa from 'papaparse';
import { CSVLink } from "react-csv";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import Years from "../ManagerYears/Years";



const Users = (props) => {
    const user = useSelector(state => state.user);
    const schoolId = user?.dataRedux?.account?.schoolId || [];

    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(10);
    const [totalPages, setTotalPage] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    //modal delete
    const [dataModal, setDataModel] = useState({});
    const [isShowModalUser, setIsShowModalUser] = useState(false);
    //modal update/create
    const [actionModalUser, setActionModalUser] = useState("CREATE");
    const [dataModalUser, setDataModalUser] = useState({});

    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");

    const [dataExport, setDataExport] = useState([]);


    useEffect(async () => {
        await fetchUsers();
    }, [currentPage])

    const fetchUsers = async () => {
        let response = await fetchUsersWithoutManagerAndAdmin(currentPage, currentLimit, schoolId);
        if (response && response.dt && response.ec === 0) {
            setTotalPage(response.dt.totalPages)
            setListUsers(response.dt.content);
        }
    }
    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleDeleteUser = async (user) => {
        setDataModel(user);
        setIsShowModalDelete(true);

    }

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModel({});
    }

    const onHideModalUser = async () => {
        setIsShowModalUser(false);
        setDataModalUser({});
        await fetchUsers();
    }


    const confirmDeleteUser = async () => {
        let response = await deleteUser(dataModal);
        if (response && response.ec === 0) {
            toast.success(response.em);
            await fetchUsers();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.em)
        }
    }

    const handleEditUser = (user) => {
        setActionModalUser("UPDATE");
        setDataModalUser(user);
        setIsShowModalUser(true);
    }

    const handleRefresh = async () => {
        await fetchUsers();
    }

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListUsers = _.cloneDeep(listUsers);
        cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
        setListUsers(cloneListUsers);

    }

    const handleSearch = debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneListUsers = _.cloneDeep(listUsers);
            cloneListUsers = cloneListUsers.filter(item => item.email.toLowerCase().includes(term))
            setListUsers(cloneListUsers);
        } else {
            fetchUsers();
        }
    }, 300)

    const getUsersExport = (event, done) => {
        let result = [];
        if (listUsers && listUsers.length > 0) {
            result.push(["id", "email", "username", "phone", "gender", "role"]);

            listUsers.forEach((item, index) => {
                let arr = [];
                arr[0] = item.id;
                arr[1] = item.email;
                arr[2] = item.username;
                arr[3] = item.phone;
                arr[4] = item.gender;


                if (item.roles && item.roles.length > 0) {
                    let rolesArray = item.roles.map(role => role.name);
                    arr[5] = rolesArray.join(', ');
                } else {
                    arr[5] = '';
                }

                result.push(arr);
            });

            setDataExport(result);
            done();
        }
    }


    const handleImportCSV = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            let file = event.target.files[0];

            if (file.type !== "text/csv") {
                toast.error("Only accept csv file...");
                return;
            }

            // Parse local CSV file
            Papa.parse(file, {
                // header: true,
                complete: function (results) {
                    let rawCSV = results.data;

                    console.log(rawCSV)

                    if (rawCSV.length > 0) {
                        if (rawCSV[0] && rawCSV[0].length === 5) {
                            if (rawCSV[0][0] !== "id"
                                || rawCSV[0][1] !== "email"
                                || rawCSV[0][2] !== "username"
                                || rawCSV[0][3] !== "phone"
                                || rawCSV[0][4] !== "gender"
                                || rawCSV[0][5] !== "role"
                            ) {
                                toast.error("Wrong format Header CSV file!")
                            } else {
                                let result = [];

                                rawCSV.forEach((item, index) => {
                                    if (index > 0 && item.length === 5) {
                                        let obj = {};
                                        obj.id = item[0]
                                        obj.email = item[1];
                                        obj.username = item[2];
                                        obj.phone = item[3];
                                        obj.gender = item[4];



                                        let roles = item[5].split(',').map(role => role.trim());
                                        obj.roles = roles;

                                        result.push(obj);
                                    }
                                })
                                setListUsers(result);
                            }
                        } else {
                            toast.error("Wrong format CSV file!")
                        }

                    } else {
                        toast.error("Not found data on CSV file!")
                    }
                }
            });
        }
    }


    return (
        <>

            <div className="home">
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />
                    <div className="container">
                        <div className="col-12 col-sm-4 my-3">
                            <div className="row">
                                <div className="search col-7">
                                    <input
                                        placeholder="Tìm theo Username...."
                                        onChange={(event) => handleSearch(event)}
                                    />
                                    <SearchOutlinedIcon />
                                </div>

                            </div>

                        </div>

                        <div className="manage-users-container">
                            <div className="user-header row">
                                <div className="title mt-3"><h3>Quản lý người dùng</h3></div>
                                <div className="actions my-3">
                                    <div className="header-left col-6">
                                        <button
                                            className="btn btn-success refresh"
                                            onClick={() => handleRefresh()}
                                        >

                                            <i className="fa fa-refresh"></i>Refresh
                                        </button>
                                        <button className="btn btn-primary"
                                            onClick={() => {
                                                setIsShowModalUser(true);
                                                setActionModalUser("CREATE")
                                            }}
                                        >
                                            <i className="fa fa-plus-circle"></i>
                                            Thêm mới
                                        </button>
                                    </div>

                                    <div className="header-right col-6 ">
                                        <label htmlFor='test' className='btn btn-danger btn_left'>
                                            <i className='fa-solid fa-file-import'></i> Import
                                        </label>
                                        <input id='test' type='file' hidden
                                            onChange={(event) => handleImportCSV(event)}

                                        />

                                        <CSVLink
                                            filename={"users.csv"}
                                            className="btn btn-warning btn_right"
                                            target="_blank"
                                            data={dataExport}
                                            asyncOnClick={true}
                                            onClick={getUsersExport}
                                        >
                                            <i className='fa-solid fa-file-arrow-down'></i> Export</CSVLink>

                                    </div>


                                </div>
                            </div>
                            <div className="user-body">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">STT</th>
                                            <th>
                                                <div className='sort-header'>
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
                                            <th scope="col">Email</th>

                                            <th>
                                                <div className='sort-header'>
                                                    <span>
                                                        Username
                                                    </span>
                                                    <span>
                                                        <i
                                                            className="fa-solid fa-arrow-down-long"
                                                            onClick={() => handleSort("desc", "username")}
                                                        ></i>
                                                        <i
                                                            className="fa-solid fa-arrow-up-long"
                                                            onClick={() => handleSort("asc", "username")}
                                                        ></i>
                                                    </span>
                                                </div>

                                            </th>
                                            <th scope="col">Số điện thoại</th>
                                            <th scope="col">Giới tính</th>
                                            <th scope="col">Quyền hạn</th>
                                            <th scope="col">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listUsers && listUsers.length > 0 ?
                                            <>
                                                {listUsers.map((item, index) => {
                                                    return (
                                                        <tr key={`row-${index}`}>
                                                            <td>{currentPage * currentLimit + index + 1}</td>
                                                            <td>{item.id}</td>
                                                            <td>{item.email}</td>
                                                            <td>{item.username}</td>
                                                            <td>{item.phone}</td>
                                                            <td>{item.gender}</td>
                                                            <td>
                                                                {item.roles && item.roles.length > 0 ? (
                                                                    <span>
                                                                        {item.roles.map(role => (
                                                                            <p key={role.id}>{role.name.substring(5)} </p>
                                                                        ))}
                                                                    </span>
                                                                ) : ''}
                                                            </td>

                                                            <td>
                                                                <span
                                                                    title="Sửa"
                                                                    className="edit"
                                                                    onClick={() => {
                                                                        handleEditUser(item)
                                                                    }}
                                                                >
                                                                    <i className="fa fa-pencil"></i>
                                                                </span>
                                                                <span
                                                                    title="Xóa"
                                                                    className="delete"
                                                                    onClick={() => {
                                                                        handleDeleteUser(item)
                                                                    }}

                                                                ><i className="fa fa-trash-can"></i></span>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </>
                                            :
                                            <>
                                                <tr>
                                                    <td>Not found User</td>
                                                </tr>
                                            </>}
                                    </tbody>
                                </table>

                            </div>
                            {totalPages > 0 &&
                                <div className="user-footer">
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
                            }
                        </div>
                    </div>
                </div>
            </div>
            <ModalDelete
                show={isShowModalDelete}
                handleClose={handleClose}
                confirmDelete={confirmDeleteUser}
                dataModal={dataModal}
                title={"Người dùng"}
            />
            <ModalUser
                show={isShowModalUser}
                onHide={onHideModalUser}
                action={actionModalUser}
                dataModalUser={dataModalUser}
                schoolId={schoolId}

            />
        </>
    )
}

export default Users;