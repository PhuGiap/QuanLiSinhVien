import React, { Component } from 'react';
import { getAllSubject, getAllUser, handleRegisterTinchi } from '../../services/userService';
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import './Tinchi.scss';

class TinchiManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrSubject: [],
            arrIdSubjectSelect: [],
            numberTinchiSelect: 0,
            numberTinChiOld: 0,
            currentTime: new Date(), // Thời gian hiện tại
            registerTime: null // Thời gian đăng ký thành công
        }
    }

    async componentDidMount() {
        await this.handleGetAllSubject();

        // Thiết lập interval để cập nhật thời gian mỗi giây
        this.timeInterval = setInterval(() => {
            this.setState({ currentTime: new Date() });
        }, 1000);
    }

    componentWillUnmount() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
    }

    handleGetAllSubject = async () => {
        let { userInfo } = this.props;
        let arrSubjectFind = await getAllSubject('ALL');
        let userFind = await getAllUser(userInfo.id);
        let arrSubjectOld = userFind.users.Subjects;

        let newSubjects = (arrSubjectFind.subjects).filter(subjectFind => {
            return !arrSubjectOld.some(subjectOld => subjectOld.id === subjectFind.id);
        });

        if (arrSubjectFind && arrSubjectFind.errCode === 0) {
            await this.setState({
                arrSubject: newSubjects,
                arrIdSubjectSelect: [],
                numberTinchiSelect: 0,
                numberTinChiOld: userFind.users.numberTinchi * 1,
                registerTime: null // Reset thời gian đăng ký
            });
        }
    }

    handleChangeSubject = async (event) => {
        let { arrIdSubjectSelect, numberTinchiSelect } = this.state;
        let subject = await getAllSubject(event.target.value);
        if (arrIdSubjectSelect.includes(event.target.value)) {
            let newArray = arrIdSubjectSelect.filter(el => el !== event.target.value);
            numberTinchiSelect = numberTinchiSelect - subject.subjects.numberTinchi;
            await this.setState({
                arrIdSubjectSelect: newArray,
                numberTinchiSelect
            });
        } else {
            arrIdSubjectSelect.push(event.target.value);
            numberTinchiSelect = numberTinchiSelect + subject.subjects.numberTinchi;
            await this.setState({
                arrIdSubjectSelect,
                numberTinchiSelect
            });
        }
    }

    handleRegister = async () => {
        let { arrIdSubjectSelect, numberTinchiSelect, numberTinChiOld } = this.state;
        let { userInfo } = this.props;
        if ((numberTinchiSelect + numberTinChiOld) > 20 || (numberTinchiSelect + numberTinChiOld) < 10) {
            toast.warn("Số lượng tín chỉ cần phải lớn hơn 10 và nhỏ hơn 20");
        } else {
            let data = {};
            data.id = userInfo.id;
            data.arrIdSubject = arrIdSubjectSelect;
            let response = await handleRegisterTinchi(data);
            if (response.errCode === 0) {
                let registerTime = new Date(); // Lưu thời gian đăng ký
                this.setState({ registerTime }); // Cập nhật state
                toast.success("✔ Đăng kí thành công!");
                await this.handleGetAllSubject();
            }
        }
    }

    render() {
        let { arrSubject, numberTinchiSelect, numberTinChiOld, currentTime, registerTime } = this.state;

        // Định dạng thời gian hiện tại
        let formattedTime = currentTime.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // Định dạng thời gian đăng ký
        let formattedRegisterTime = registerTime
            ? registerTime.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
            : null;

        return (
            <div className="main">
                <p className='title'>Đăng Ký Tín Chỉ</p>

                <div className='current-time'>
                    Thời gian hiện tại: {formattedTime}
                </div>

                {registerTime && (
                    <div className='register-time' style={{ color: 'green', marginTop: '10px' }}>
                        Đăng ký thành công vào lúc: {formattedRegisterTime}
                    </div>
                )}

                <div className="check-group">
                    {arrSubject && arrSubject.length > 0 && arrSubject.map((item, index) => {
                        return (
                            <label htmlFor={item.name} className="checkbox" key={index}>
                                <input className="checkbox__input" type="checkbox" id={item.name}
                                    onChange={(event) => this.handleChangeSubject(event)}
                                    value={item.id}
                                />
                                <svg className="checkbox__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                                    <rect width="21" height="21" x=".5" y=".5" fill="#FFF" stroke="#006F94" rx="3" />
                                    <path className="tick" stroke="#6EA340" fill="none" strokeLinecap="round" strokeWidth="4" d="M4 10l5 5 9-9" />
                                </svg>
                                <span className="checkbox__label">{item.name}</span>
                            </label>
                        );
                    })}
                </div>

                <div className='numberTinchi'>
                    Số lượng tín chỉ đã đăng ký: {numberTinChiOld}
                </div>
                <div className='numberTinchi'>
                    Số lượng tín chỉ hiện tại: {numberTinchiSelect}
                </div>

                <div className='btn-register btn'
                    onClick={() => this.handleRegister()}
                >
                    Đăng Ký
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TinchiManage);
