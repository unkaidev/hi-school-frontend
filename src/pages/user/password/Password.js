import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createNewStudent, updateCurrentStudent } from '../../../services/studentServices';
import { getAllCity, getAllDistrict, getAllIssuedPlace, getAllProvince, getAllWardCommune } from '../../../services/addressService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';
import './password.scss';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useSelector } from 'react-redux';
import { changeUserPassword, fetchUserWithUsername } from "../../../services/userServices";
import Navbar from '../../../components/navbar/Navbar';
import Sidebar from '../../../components/sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const Password = (props) => {
    const [account, setAccount] = useState('');
    const user = useSelector(state => state.user);
    const username = user?.dataRedux?.account?.username || [];
    const email = user?.dataRedux?.account?.email || [];

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showReNewPassword, setShowReNewPassword] = useState(false);

    useEffect(() => {
        fetchAccount()
    }, [user])


    const fetchAccount = async () => {
        const accountResponse = await fetchUserWithUsername(username);
        console.log(accountResponse)
        if (accountResponse && accountResponse.ec === 0) {
            setAccount(accountResponse.dt)
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'oldPassword') {
            setOldPassword(value);
        } else if (name === 'newPassword') {
            setNewPassword(value);
        } else if (name === 'reNewPassword') {
            setReNewPassword(value);
        }
    };
    const togglePasswordVisibility = (passwordType) => {
        if (passwordType === 'oldPassword') {
            setShowOldPassword(!showOldPassword);
        } else if (passwordType === 'newPassword') {
            setShowNewPassword(!showNewPassword);
        } else if (passwordType === 'reNewPassword') {
            setShowReNewPassword(!showReNewPassword);
        }
    };

    const handleChangePassword = async () => {
        const passwordResponse = await changeUserPassword(username, oldPassword, newPassword, reNewPassword);
        if (passwordResponse && passwordResponse.ec === 0) {
            if (passwordResponse.dt !== "Thay đổi mật khẩu thành công!") {
                toast.error(passwordResponse.dt)
            } else {
                setOldPassword("")
                setNewPassword("")
                setReNewPassword("")
                toast.success(passwordResponse.dt)

            }
        }
    };

    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="container">
                    <div className="col-12 col-sm-4 my-3">

                    </div>
                    <div className="container">
                        <div className="row">
                            <h3 className='text-center'>Đổi mật khẩu</h3>
                        </div>
                    </div>
                </div>
                <div className="body">
                    <div className='content-body row'>
                        <div className="new container px-3 mx-6">

                            <div className="left">
                                <div className='col-3' style={{ position: 'fixed' }}>
                                    <img
                                        src={account?.avatar || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
                                        alt=""
                                        style={{ width: "200px", height: "200px", borderRadius: "50%", objectFit: "cover" }}
                                    />
                                </div>
                            </div>
                            <div className="right">
                                <div className='col-12 form-role'>
                                    <div
                                        className='row py-3'
                                        style={{ border: 'gray solid 1px', borderRadius: '10px' }}
                                    >
                                        <div className='col-6'>
                                            <label>Họ(<span className='text-danger'>*</span>):</label>
                                            <input
                                                disabled={true}
                                                className='form-control fw-bold'
                                                type="text" value={account ? account?.firstName : "SOMEONE"}
                                            />
                                        </div>
                                        <div className='col-6'>
                                            <label>Tên(<span className='text-danger'>*</span>):</label>
                                            <input
                                                disabled={true}
                                                className='form-control fw-bold'
                                                type="text" value={account ? account?.lastName : "SOMEONE"}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 form-role'>
                                    <div
                                        className='row py-3'
                                        style={{ border: 'gray solid 1px', borderRadius: '10px' }}
                                    >
                                        <div className='col-6'>
                                            <label>Username:(<span className='text-danger'>*</span>):</label>
                                            <input
                                                disabled={true}
                                                className='form-control fw-bold'
                                                type="text" value={account ? account.user?.username : username}
                                            />
                                        </div>
                                        <div className='col-6'>
                                            <label>Email:(<span className='text-danger'>*</span>):</label>
                                            <input
                                                disabled={true}
                                                className='form-control fw-bold'
                                                type="text" value={account ? account.user?.email : email}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='col-12 form-role'>
                                    <div className='row py-3' style={{ border: 'gray solid 1px', borderRadius: '10px' }}>
                                        <div className='col-4'>
                                            <label>Mật khẩu cũ:(<span className='text-danger'>*</span>):</label>
                                            <div className="input-group">
                                                <input
                                                    placeholder='Nhập mật khẩu cũ'
                                                    className='form-control'
                                                    type={showOldPassword ? "text" : "password"} name="oldPassword" value={oldPassword} onChange={handleChange}
                                                />
                                                <button className="btn btn-outline-secondary" type="button" onClick={() => togglePasswordVisibility('oldPassword')}>
                                                    <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className='col-4'>
                                            <label>Mật khẩu mới:(<span className='text-danger'>*</span>):</label>
                                            <div className="input-group">
                                                <input
                                                    placeholder='Nhập mật khẩu mới'
                                                    className='form-control'
                                                    type={showNewPassword ? "text" : "password"} name="newPassword" value={newPassword} onChange={handleChange}
                                                />
                                                <button className="btn btn-outline-secondary" type="button" onClick={() => togglePasswordVisibility('newPassword')}>
                                                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className='col-4'>
                                            <label>Xác nhận mật khẩu mới:(<span className='text-danger'>*</span>):</label>
                                            <div className="input-group">
                                                <input
                                                    placeholder='Nhập lại mật khẩu mới'
                                                    className='form-control'
                                                    type={showReNewPassword ? "text" : "password"} name="reNewPassword" value={reNewPassword} onChange={handleChange}
                                                />
                                                <button className="btn btn-outline-secondary" type="button" onClick={() => togglePasswordVisibility('reNewPassword')}>
                                                    <FontAwesomeIcon icon={showReNewPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className='col-12 text-center mt-3'>
                                            <button className='btn btn-warning' onClick={handleChangePassword}>
                                                <FontAwesomeIcon icon={faRefresh} className='me-3'></FontAwesomeIcon>
                                                Đổi mật khẩu
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    );
};

export default Password;
