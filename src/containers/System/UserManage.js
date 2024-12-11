import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUser, createNewUserService, deleteUserService, editUserService, getAllClass, handleUpdatePay, getAllUserByClass } from '../../services/userService';
import ModalUser from './ModalUser';
import { emitter } from '../../utils/emitter';
import { toast } from 'react-toastify';

class UserManage extends Component {

    // Hàm dùng để khởi tạo các biến dùng trong class này (UserManage)
    constructor(props) {
        super(props);
        this.state = {
            arruser: [],
            classUser: [],
            idClassUserSelect: '',
            isOpenModalUser: false,
            optionModal: ''
        }
    }

    async componentDidMount() {
        await this.getAllUserManage();
        await this.getAllClassManage();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.arruser !== this.state.arruser) {
            this.setState({
                arruser: this.state.arruser
            })
        }
    }


    getAllClassManage = async () => {
        let response = await getAllClass('ALL');
        if (response && response.errCode === 0) {
            await this.setState({
                classUser: response.classUser
            })
        }
    }

    getAllUserManage = async () => {
        let response = await getAllUser('ALL');
        let arrUserService = response.users

        await Promise.all(
            arrUserService.map(item => {
                let dateString = item.createdAt;
        
                // Tạo đối tượng Date từ chuỗi thời gian
                let date = new Date(dateString);
        
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
        
                let hours = date.getHours().toString().padStart(2, '0');
                let minutes = date.getMinutes().toString().padStart(2, '0');
                let seconds = date.getSeconds().toString().padStart(2, '0');
        
                // Định dạng ngày tháng năm và thời gian
                let formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                item.createdAt = formattedDate;
                return item;
            })
        );
        
        
        if (response && response.errCode === 0) {
            await this.setState({
                arruser: arrUserService
            })
        }
    }

    handleCreateNewUser = (dataUser) => {
        if (dataUser) {
            this.setState({
                isOpenModalUser: true,
                optionModal: 'edit_modal'
            })
            dataUser.gender = String(dataUser.gender);
            // pressed style for 'gender'
            emitter.emit('EVENT_SET_DATA_EDIT_MODAL', dataUser);
        } else {
            this.setState({
                isOpenModalUser: true,
                optionModal: 'create_modal'
            })
        }

    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            console.log(response);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUserManage();
                this.setState({
                    isOpenModalUser: false,
                })
                // fire EVENT_CLEAR_MODAL from child (ModalUser.js)
                emitter.emit('EVENT_CLEAR_MODAL', { message: 'clear success' })
            }
        } catch (error) {
            console.log(error)
        }
    }

    editUser = async (data) => {
        try {
            let response = await editUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUserManage();
                this.setState({
                    isOpenModalUser: false,
                })
                // fire EVENT_CLEAR_MODAL from child (ModalUser.js)
                emitter.emit('EVENT_CLEAR_MODAL', { message: 'clear success' })
            }
        } catch (error) {
            console.log(error)
        }
    }

    handleDeleteUser = async (dataUser) => {
        try {
            let response = await deleteUserService(dataUser.id)
            if (response && response.errCode !== 0) {
                toast.warn(response.errMessage);
            } else {
                await this.getAllUserManage();
            }
        } catch (error) {
            console.log(error)
        }
    }


    handleUpdatePay = async (data) => {
        let { arruser } = this.state;
        let userFind = arruser.find(user => user.id === data.id);
    
        if (userFind.statusPay === false && userFind.numberTinchi > 0 && userFind.tuition > 0) {
            const userConfirmed = window.confirm('Hãy chắc chắn rằng sinh viên này đã thanh toán học phí!');
            if (userConfirmed) {
                try {
                    const response = await handleUpdatePay(data.id);
                    console.log(response);

                    await this.getAllUserManage();
                    if (response.errCode === 0) {
                        await this.getAllUserManage(); 
                    } else {
                        alert(response.errMessage);
                    }
                } catch (error) {
                    console.error('Error updating payment time:', error);
                }
            }
        } else {
            toast.warn("Sinh viên này chưa đăng ký tín chỉ");
        }
    };
    
    


    handleOnchangeInputClass = async (event) => {
        await this.setState({
            idClassUserSelect: event.target.value
        })

        let response = await getAllUserByClass(this.state.idClassUserSelect);
        let arrUserService = response.users
        console.log(arrUserService);

        await Promise.all(
            arrUserService.map(item => {
                let dateString = item.createdAt;

                // Tạo đối tượng Date từ chuỗi thời gian
                let date = new Date(dateString);

                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                let formattedDate = day + "/" + month + "/" + year;
                item.createdAt = formattedDate;
                return item;
            })
        );

        if (response && response.errCode === 0) {
            await this.setState({
                arruser: arrUserService
            })
        }
    }

    /** Life cycle
     * Run Component:
     * 1. Run constructor -> init state
     * 2. Did mount
     * 3. Render
     */

    render() {
        let { arruser, classUser } = this.state;
        let i = 0;
        return (
            <div className="users container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser} // truyền vào 1 biến (isOpenModalUser)
                    arrClassUser={this.state.classUser}
                    toggleFromUserManage={this.toggleUserModal} // truyền vào 1 hàm (toggleUserModal)
                    fireCreateNewUser={this.createNewUser}
                    optionModal={this.state.optionModal}
                    fireEditUser={this.editUser}
                />
                <div className='title text-center'>Quản lý Sinh Viên</div>
                <div className='row mt-5'>
                    <div className='col-10'>
                        <button className='btn btn-primary px-3'
                            onClick={() => this.handleCreateNewUser()}><i className="fas fa-plus"></i>Thêm mới</button>
                    </div>
                    <div className='col-2'>
                        <select name="classUser" className="form-control"
                            onChange={(event) => { this.handleOnchangeInputClass(event) }}
                            value={this.state.idClassUserSelect}
                        >
                            <option defaultValue hidden>Chọn lớp</option>
                            {classUser && classUser.length > 0 && classUser.map((item, index) => {
                                return (
                                    <option value={item.id} key={index} >{item.name}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
    
                <div className='user-table col-12 mt-4'>
                    <table id="customers">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Lớp</th>
                                <th>Địa chỉ</th>
                                <th>Ngày tạo</th>
                                <th>Tín chỉ</th>
                                <th>Học phí</th>
                                <th>Trạng thái</th>
                                <th>Thời gian nộp học phí</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arruser && arruser.length > 0 && arruser.map((item, index) => {
                                if (item.roleId === 'R2') {
                                    i++;
                                    return (
                                        <tr key={index}>
                                            <td>{i}</td>
                                            <td>{item.fullName}</td>
                                            <td>{item.email}</td>
                                            <td>{item.classData.name}</td>
                                            <td>{item.address}</td>
                                            <td>{(item.createdAt)}</td>
                                            <td>{item.numberTinchi}</td>
                                            <td>{(item.tuition ? item.tuition : 0).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</td>
                                            <td>
                                                {item.numberTinchi > 0 &&
                                                    <>
                                                        {
                                                            item.statusPay
                                                                ?
                                                                <button className='btn-nop'>Đã nộp</button>
                                                                :
                                                                <button className='btn-chuanop' onClick={() => this.handleUpdatePay(item)}>Chưa nộp</button>
                                                        }
                                                    </>
                                                }
                                            </td>
                                            <td>
                                                {/* Hiển thị thời gian nộp học phí nếu có */}
                                                {item.statusPay 
                                                    ? new Date(item.timePay).toLocaleString("en-GB", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                        hour12: false
                                                      })
                                                    : 'Chưa nộp'
                                                    }
                                            </td>
                                            <td>
                                                <div className='edit-delete'>
                                                    <button className='btn-edit' onClick={() => this.handleCreateNewUser(item)}><i className="fas fa-pencil-alt"></i></button>
                                                    <button className='btn-delete' onClick={() => this.handleDeleteUser(item)}><i className="fas fa-trash-alt"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                            <br></br>
                            <h5>Tổng số lượng sinh viên: {i}</h5>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
