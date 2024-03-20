import { useEffect, useState, useContext } from 'react';
import './Login.scss';
import { useHistory, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from "../../services/userServices"
import { handleLoginRedux, handleRefresh } from "../../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const Login = (props) => {
    const account = useSelector(state => state.user.dataRedux.account);
    const isAuthenticated = useSelector(state => state.user.dataRedux.isAuthenticated);
    const isError = useSelector(state => state.user.isError);

    const [showPassword, setShowPassword] = useState(false);


    const dispatch = useDispatch();

    let history = useHistory();

    const [valueLogin, setValueLogin] = useState("");
    const [password, setPassword] = useState("");

    const defaultObjValidInput = {
        isVaLidValueLogin: true,
        isVaLidPassword: true
    }

    const [objVaLidInput, setObjValidInput] = useState(defaultObjValidInput);

    const handleLogin = async () => {
        setObjValidInput(defaultObjValidInput);

        if (!valueLogin) {
            toast.error("Vui lòng nhập username!");
            setObjValidInput({ ...defaultObjValidInput, isVaLidValueLogin: false })
            return;
        }
        if (!password) {
            toast.error("Vui lòng nhập password!")
            setObjValidInput({ ...defaultObjValidInput, isVaLidPassword: false })
            return;
        }
        await dispatch(handleLoginRedux(valueLogin, password));


        window.location.reload();

    }
    const handlePressEnter = (event) => {
        if (event.charCode === 13 && event.code === 'Enter') {
            handleLogin();
        }
    }

    useEffect(() => {
        if (isError === true) {
            toast.error("Lỗi: Username hoặc Mật khẩu không chính xác!");
            return;
        }

        if (account && isAuthenticated) {
            let destination = "";

            if (account.roles.includes('ROLE_ADMIN')) {
                destination = "/admin";
            } else if (account.roles.includes('ROLE_MANAGER')) {
                destination = "/manager";
            } else if (account.roles.includes('ROLE_HEADTEACHER')) {
                destination = "/headteacher";
            } else if (account.roles.includes('ROLE_TEACHER')) {
                destination = "/teacher";
            } else if (account.roles.includes('ROLE_USER')) {
                destination = "/user";
            }

            if (destination !== "") {
                history.push(destination);
                toast.success("Đăng nhập thành công!");
            }
        }
    }, [account, isAuthenticated, isError, history]);

    const togglePasswordVisibility = (passwordType) => {
        if (passwordType === 'password') {
            setShowPassword(!showPassword);
        }
    };


    return (

        <div className="login-container">
            <div className="container">
                <div className="row px-3 px-sm-0 mt-5 mx-5">
                    <div className="content-left col-12 d-none col-sm-7 d-sm-block">
                        <div className='brand'>
                            <Link to="/"> <span title='Return to HomePage'>Hi-school</span></Link>
                        </div>
                        <div className='detail'>Learn world</div>
                    </div>
                    <div className="content-right col-12 col-sm-5 d-flex flex-column gap-3 py-3">
                        <div className='text-center'>
                            <img src='favicon.ico' className='icon-img' alt='Hi-school Logo' />
                        </div>

                        <div className='brand d-sm-none'>Hi-school</div>
                        <input
                            type='text'
                            className={objVaLidInput.isVaLidValueLogin ? 'form-control' : 'is-invalid form-control'}
                            placeholder='Username'
                            value={valueLogin}
                            onChange={((event) => {
                                setValueLogin(event.target.value)
                            })}
                        />
                        <div className='row'>
                            <div className='col-12' style={{ position: 'relative' }}>
                                <input
                                    className={objVaLidInput.isVaLidPassword ? 'form-control' : 'is-invalid form-control'}
                                    placeholder='Mật khẩu'
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value)
                                    }}
                                    onKeyPress={(event) => {
                                        handlePressEnter(event)
                                    }}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '10px' }}
                                    onClick={() => togglePasswordVisibility('password')}
                                >
                                    <FontAwesomeIcon icon={password ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>
                        <div></div>
                        <button
                            className='btn btn-primary'
                            onClick={() => handleLogin()}
                        >
                            Đăng nhập
                        </button>
                        <div></div>

                    </div>
                </div>
            </div>
        </div>

    )
}
export default Login;