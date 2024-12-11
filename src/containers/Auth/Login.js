import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services/userService';

import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from "../../store/actions/";
import './Login.scss';
class Login extends Component {
    /** Life cycle
    * Run Component:
    * 1. Run constructor -> init state
    * 2. OnChangeUsername, OnChangePassword, Login, ShowHidePassword
    * 3. Render
    */

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: ''
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user)
                console.log('Login succeeds')
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }

        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    changeLangusgae = (language) => {
        // fire redux event ( actions )
        this.props.changeLanguageAppRedux(language)
    }

    render() {
        //JSX
        let language = this.props.language;

        return (
            <React.Fragment>
                <div className='login-header-container'>
                    <div className='login-header-content row-cols-1'>
                        <div className='left-content col-1'>
                        </div>
                        <div className='col-1'></div>
                        <div className='center-content col-8'>
                            <ul className='container'>
                                <li className='col'><div className='header-logo'></div></li>
                            </ul>
                        </div>
                        <div className='right-content col-2'>
                        </div>
                    </div>
                </div>



                <div className='login-background'>
                    <div className='login-container'>
                        <div className='login-content row'>
                            <div className='col-12 text-login'><FormattedMessage id="loginpage.login" /></div>
                            <div className='col-12 form-group login-input'>
                                <label><FormattedMessage id="loginpage.email" />:</label>
                                <FormattedMessage id="loginpage.enteremail">
                                    {(msg) => (<input type="text" className='form-control' placeholder={msg}
                                        value={this.state.username}
                                        onChange={(event) => { this.handleOnChangeUsername(event) }} />)}
                                </FormattedMessage>
                            </div>
                            <div className='col-12 form-group login-input'>
                                <label><FormattedMessage id="loginpage.password" />:</label>
                                <div className='custom-input-password'>
                                    <FormattedMessage id="loginpage.enterpass">
                                        {(msg) => (<input type={this.state.isShowPassword ? 'text' : 'password'} placeholder={msg} className='form-control'
                                            value={this.state.password}
                                            onChange={(event) => { this.handleOnChangePassword(event) }} />)}
                                    </FormattedMessage>

                                    <span onClick={() => { this.handleShowHidePassword() }}>
                                        <i className={this.state.isShowPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                                    </span>
                                </div>
                            </div>
                            <div className='col-12' style={{ color: 'red' }}>
                                {this.state.errMessage}
                            </div>
                            <div className='col-12'>
                                <button className='btn-login' onClick={() => { this.handleLogin() }}><FormattedMessage id="loginpage.login" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
