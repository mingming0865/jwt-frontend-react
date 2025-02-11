import './Login.scss';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { loginUser } from "../../services/userService"
const Login = (prop) => {
    let history = useHistory();

    const [valueLogin, setValueLogin] = useState("");
    const [password, setPassword] = useState("");

    const defaultObjValidInput = {
        isValidValueLogin: true,
        isValidPassword: true
    }

    const [objValidInput, setObjValidInput] = useState(defaultObjValidInput);

    const handleCreateNewAccount = () => {
        history.push("/register");
    }

    const handleLogin = async () => {
        setObjValidInput(defaultObjValidInput);

        if (!valueLogin) {
            setObjValidInput({ ...defaultObjValidInput, isValidValueLogin: false });
            toast.error("Please enter your email address or phone number")
            return;
        }
        if (!password) {
            setObjValidInput({ ...defaultObjValidInput, isValidPassword: false });
            toast.error("Please enter your password")
            return;
        }

        let response = await loginUser(valueLogin, password);

        if (response && +response.EC === 0) {
            //success
            let data = {
                isAuthenticated: true,
                token: 'fake token'
            }
            sessionStorage.setItem("account", JSON.stringify(data));
            history.push('/users');
            window.location.reload();
            //redux
        }

        if (response && +response.EC !== 0) {
            //error
            toast.error(response.EM)
        }
        console.log(">>> check response: ", response.data)
    }

    const handlePressEnter = (event) => {
        if (event.charCode === 13 && event.code === "Enter") {
            handleLogin()
        }
    }

    useEffect(() => {
        let session = sessionStorage.getItem("account");
        if (session) {
            history.push("/");
            window.location.reload();
        }
    }, [])

    return (
        <div className="login-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-12 d-none col-sm-7 d-sm-block">
                        <div className="brand">
                            Ming
                        </div>
                        <div className="detail">
                            Ming helps you connect and share with the people in your life.
                        </div>
                    </div>
                    <div className="content-right col-12 col-sm-5 d-flex flex-column gap-3 py-3 ">
                        <div className="brand d-sm-none">
                            Ming
                        </div>
                        <input
                            type="text"
                            className={objValidInput.isValidValueLogin ? 'form-control' : 'is-invalid form-control'}
                            placeholder='Email address or phone number'
                            value={valueLogin}
                            onChange={(event) => { setValueLogin(event.target.value) }}
                        />
                        <input type="password"
                            className={objValidInput.isValidPassword ? 'form-control' : 'is-invalid form-control'}
                            placeholder='Password'
                            value={password}
                            onChange={(event) => { setPassword(event.target.value) }}
                            onKeyPress={(event) => handlePressEnter(event)}
                        />
                        <button className='btn btn-primary' onClick={() => handleLogin()}>Login</button>
                        <span className='text-center'>
                            <a className='forgot-password' href='#'>Forgot your password?</a>
                        </span>
                        <hr />
                        <div className='text-center' onClick={() => handleCreateNewAccount()}>
                            <button className='btn btn-success'>
                                Create new account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;