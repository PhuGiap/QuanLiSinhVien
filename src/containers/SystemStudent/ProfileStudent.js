import React, { Component } from 'react';
import { getAllUser, handleCancleTinchi } from '../../services/userService';
import { connect } from 'react-redux';
import avatar_men from '../../assets/decorate/avatar_men.jpg'
import avatar_women from '../../assets/decorate/avatar_women.jpg'

import './Profile.scss';
import { toast } from 'react-toastify';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: [],
            currentTime: new Date() // Khởi tạo thời gian hiện tại
        }
    }

    async componentDidMount() {
        await this.getAllUserManage();

        // Thiết lập interval để cập nhật thời gian mỗi giây
        this.timeInterval = setInterval(() => {
            this.setState({ currentTime: new Date() });
        }, 1000);
    }

    componentWillUnmount() {
        // Xóa interval khi component bị unmount
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
    }

    getAllUserManage = async () => {
        let idUser = this.props.userInfo.id;
        let response = await getAllUser(idUser);
        if (response && response.errCode === 0) {
            this.setState({
                userInfo: response.users
            });
        }
    }

    handleCancleObject = async (item) => {
        let idUser = this.props.userInfo.id;
        let data = {};
        data.userId = idUser;
        data.idSubject = item.id;
        let response = await handleCancleTinchi(data);
        console.log(response);
        if (response.errCode === 0) {
            this.getAllUserManage();
        } else {
            toast.warn(response.errMessage);
        }
    }


    render() {
        let { userInfo, currentTime } = this.state;
        let arrHocPhan = userInfo.Subjects;

        // Định dạng thời gian hiện tại
        let formattedTime = currentTime.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });


        return (
            <>
                <div className='profile'>
                    <div className='image_profile'>
                        <img src={userInfo.gender === true ? avatar_men : avatar_women} alt="avatar"></img>
                        <div className="text-left">
                            <p>Tên: {userInfo.fullName}</p>
                            <p>Email: {userInfo.email}</p>
                            <p>Địa chỉ: {userInfo.address}</p>
                            <p>Liên hệ: {userInfo.phone}</p>
                            <p>Giới tính: {userInfo.gender ? 'Nam' : 'Nữ'}</p>
                            <p>Thời gian hiện tại: {formattedTime}</p>
                        </div>
                    </div>
                    <div className='info_profile'>
                        {userInfo.roleId === 'R2' &&
                            <>
                                <p className='title'>Danh Sách Học Phần Đã Đăng Ký</p>
                                <div className="users container">
                                    <div className='user-table col-12 mt-4'>
                                        <table id="customers">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Học phần</th>
                                                    <th>Số tín chỉ</th>
                                                    <th>Thời gian đăng ký</th>
                                                    {userInfo.statusPay === false &&
                                                        <th>Hủy học phần</th>
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {arrHocPhan && arrHocPhan.length > 0
                                                    ?
                                                    arrHocPhan.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td>{item.numberTinchi}</td>
                                                                <td>{userInfo.createdAt}</td>
                                                                {userInfo.statusPay === false &&
                                                                    <td>
                                                                        <div className='edit-delete'>
                                                                            <button className='btn-delete' onClick={() => this.handleCancleObject(item)}><i className="fas fa-trash-alt"></i></button>
                                                                        </div>
                                                                    </td>
                                                                }
                                                            </tr>
                                                        )
                                                    })
                                                    :
                                                    <tr>
                                                        <td colSpan="4" className='emptySubject'>Trống</td>
                                                    </tr>
                                                }
                                                {arrHocPhan && arrHocPhan.length > 0 &&
                                                    <>
                                                        <tr>
                                                            <td><b>Tổng</b></td>
                                                            <td></td>
                                                            <td>
                                                                <b>
                                                                    {userInfo.numberTinchi
                                                                        ?
                                                                        <p>{userInfo.numberTinchi}</p>
                                                                        :
                                                                        <></>
                                                                    }
                                                                </b>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><b>Học phí</b></td>
                                                            <td></td>
                                                            <td>
                                                                <b>
                                                                    {userInfo.tuition
                                                                        ?
                                                                        <p>
                                                                            {(userInfo.tuition).toLocaleString('vi', { style: 'currency', currency: 'VND' }) + " "}
                                                                            {userInfo.statusPay
                                                                                ?
                                                                                <p style={{ color: 'green' }}>Đã nộp</p>
                                                                                :
                                                                                <p style={{ color: 'red' }}>Chưa nộp</p>
                                                                            }
                                                                        </p>
                                                                        :
                                                                        <></>
                                                                    }
                                                                </b>
                                                            </td>
                                                        </tr>
                                                    </>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div >
            </>
        )
    }
}


const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
