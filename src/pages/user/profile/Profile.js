import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createNewStudent, updateCurrentStudent } from '../../../services/studentServices';
import { getAllCity, getAllDistrict, getAllIssuedPlace, getAllProvince, getAllWardCommune } from '../../../services/addressService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';
import './profile.scss';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useSelector } from 'react-redux';
import { fetchUserWithUsername } from "../../../services/userServices";
import Navbar from '../../../components/navbar/Navbar';
import Sidebar from '../../../components/sidebar/Sidebar';


const Profile = (props) => {
    const [account, setAccount] = useState('');
    const user = useSelector(state => state.user);
    const username = user?.dataRedux?.account?.username || [];

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

    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="container">
                    <div className="manage-container">
                        <div className="header row">
                            <div className="title mt-3 text-center">
                                <h3>Hồ sơ</h3>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="header body">
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
                                                className='form-control'
                                                type="text" value={account?.firstName}
                                            />
                                        </div>
                                        <div className='col-6'>
                                            <label>Tên(<span className='text-danger'>*</span>):</label>
                                            <input
                                                disabled={true}
                                                className='form-control'
                                                type="text" value={account?.lastName}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='col-12 form-role'>
                                    <div
                                        className='row py-3'
                                        style={{ border: 'gray solid 1px', borderRadius: '10px' }}
                                    >

                                        <div className='col-3'>
                                            <label>Ngày sinh:(<span className='text-danger'>*</span>):</label>
                                            <input
                                                disabled={true}
                                                className='form-control'
                                                placeholder='dd/mm/yyyy'
                                                type="text"
                                                pattern="\d{2}/\d{2}/\d{4}"
                                                value={account?.dateOfBirth}
                                            />
                                        </div>
                                        <div className='col-3'>
                                            <label>Giới tính:</label>
                                            <input
                                                disabled={true}
                                                className='form-control'
                                                type="text" value={account?.user?.gender}
                                            />

                                        </div>

                                        <div className='col-3'>
                                            <label>Quốc tịch:(<span className='text-danger'>*</span>):</label>
                                            <input
                                                disabled={true}
                                                className='form-control'
                                                type="text" value={account?.nationality}
                                            />
                                        </div>
                                        <div className='col-3'>
                                            <label>Dân tộc:(<span className='text-danger'>*</span>):</label>
                                            <input
                                                disabled={true}
                                                className='form-control'
                                                type="text" value={account?.ethnicity}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 form-role'>
                                    <div
                                        className='row py-3'
                                        style={{ border: 'gray solid 1px', borderRadius: '10px' }}
                                    >

                                        <div className='col-3'>
                                            <label>Số CCCD/CMND:(<span className='text-danger'>*</span>):</label>
                                            <input
                                                className='form-control'
                                                disabled={true}
                                                type="text" value={account?.citizenId}
                                            />
                                        </div>

                                        <div className='col-6'>
                                            <label>Nơi cấp:(<span className='text-danger'>*</span>):</label>
                                            <Select
                                                isDisabled={true}
                                                className='basic-single'
                                                classNamePrefix='select'
                                                value={account?.issuedPlace && account?.issuedPlace.name ? { value: account?.issuedPlace.name, label: account?.issuedPlace.name } : ''}
                                            />
                                        </div>

                                        <div className='col-3'>
                                            <label>Ngày cấp:(<span className='text-danger'>*</span>):</label>
                                            <input
                                                disabled={true}
                                                className='form-control'
                                                placeholder='dd/mm/yyyy'
                                                type="text"
                                                pattern="\d{2}/\d{2}/\d{4}"
                                                value={account?.issuedDate}
                                            />
                                        </div>



                                    </div>
                                </div>
                                <div className='col-12 form-role'>
                                    <div className='row py-3'
                                        style={{ border: 'gray solid 1px', borderRadius: '10px' }}

                                    >
                                        <label className='text-center'>Địa chỉ thường trú:</label>

                                        <div className='col-3'>
                                            <label>Thành phố(<span className='text-danger'>*</span>):</label>
                                            <Select
                                                isDisabled={true}
                                                className='basic-single'
                                                classNamePrefix='select'
                                                value={account.permanentAddress && account.permanentAddress.city ? { value: account.permanentAddress.city, label: account.permanentAddress.city } : null}
                                            />

                                        </div>
                                        <div className='col-3'>
                                            <label>Tỉnh(<span className='text-danger'>*</span>):</label>
                                            <Select
                                                isDisabled={true}
                                                className='basic-single'
                                                classNamePrefix='select'
                                                value={account.permanentAddress && account.permanentAddress.province ? { value: account.permanentAddress.province, label: account.permanentAddress.province } : null}
                                            />
                                        </div>
                                        <div className='col-3'>
                                            <label>Huyện(<span className='text-danger'>*</span>):</label>
                                            <Select
                                                isDisabled={true}
                                                className='basic-single'
                                                classNamePrefix='select'
                                                value={account.permanentAddress && account.permanentAddress.district ? { value: account.permanentAddress.district, label: account.permanentAddress.district } : null}
                                            />
                                        </div>
                                        <div className='col-3'>
                                            <label>Phường/Xã(<span className='text-danger'>*</span>):</label>
                                            <Select
                                                isDisabled={true}
                                                className='basic-single'
                                                classNamePrefix='select'
                                                value={account.permanentAddress && account.permanentAddress.wardCommune ? { value: account.permanentAddress.wardCommune, label: account.permanentAddress.wardCommune } : null}
                                            />
                                        </div>

                                        <div className='col-12'>
                                            <label>Khác:</label>
                                            <input
                                                disabled={true}
                                                className='form-control'
                                                type="text"
                                                value={account.permanentAddress && account.permanentAddress.other}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className='col-12 form-role'>
                                    <div className='row py-3'
                                        style={{ border: 'gray solid 1px', borderRadius: '10px' }}

                                    >
                                        <label className='text-center'>Địa chỉ liên lạc:</label>

                                        <div className='col-3'>
                                            <label>Thành phố(<span className='text-danger'>*</span>):</label>
                                            <Select
                                                isDisabled={true}
                                                className='basic-single'
                                                classNamePrefix='select'
                                                value={account.contactAddress && account.contactAddress.city ? { value: account.contactAddress.city, label: account.contactAddress.city } : null}
                                            />
                                        </div>
                                        <div className='col-3'>
                                            <label>Tỉnh(<span className='text-danger'>*</span>):</label>
                                            <Select
                                                isDisabled={true}
                                                className='basic-single'
                                                classNamePrefix='select'
                                                value={account.contactAddress && account.contactAddress.province ? { value: account.contactAddress.province, label: account.contactAddress.province } : null}
                                            />
                                        </div>
                                        <div className='col-3'>
                                            <label>Huyện(<span className='text-danger'>*</span>):</label>
                                            <Select
                                                isDisabled={true}
                                                className='basic-single'
                                                classNamePrefix='select'
                                                value={account.contactAddress && account.contactAddress.district ? { value: account.contactAddress.district, label: account.contactAddress.district } : null}
                                            />
                                        </div>
                                        <div className='col-3'>
                                            <label>Phường/Xã(<span className='text-danger'>*</span>):</label>
                                            <Select
                                                isDisabled={true}
                                                className='basic-single'
                                                classNamePrefix='select'
                                                value={account.contactAddress && account.contactAddress.wardCommune ? { value: account.contactAddress.wardCommune, label: account.contactAddress.wardCommune } : null}
                                            />
                                        </div>

                                        <div className='col-12'>
                                            <label>Khác:</label>
                                            <input
                                                disabled={true}
                                                className='form-control'
                                                type="text"
                                                value={account.contactAddress && account.contactAddress.other}
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
                                                className='form-control'
                                                type="text" value={account.user?.username}
                                            />
                                        </div>
                                        <div className='col-6'>
                                            <label>Email:(<span className='text-danger'>*</span>):</label>
                                            <input
                                                disabled={true}
                                                className='form-control'
                                                type="text" value={account.user?.email}
                                            />
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

export default Profile;
