import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import _ from 'lodash';

class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            fullname: '',
            address: '',
            phonenumber: '',
            gender: '',
            roleid: '',
            classUser: '',
            subject: []
        }
        this.listenToEmitter_clearModal();
        this.listenToEmitter_setdata();
    }

    componentDidMount() {
    }


    toggle = () => {
        let option_modal = this.props.optionModal;
        if (option_modal === 'edit_modal') {
            this.setState({
                id: '',
                email: '',
                password: '',
                fullname: '',
                address: '',
                phonenumber: '',
                gender: '',
                roleid: '',
                classUser: '',
                subject: []
            })
        }
        this.props.toggleFromUserManage();
    }

    handleOnchangeInput = (event, id) => {
        //bad code ( modify state)
        // this.state[id] = event.target.value;
        // this.setState({
        //     ...this.state
        // })
        /**Gán gán giá trị trực tiếp cho các biến state sau đó 
         * Sau chép lại state đã được gán giá trị để setState */

        //good code
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        /** <=> copyState.['fullname'] === copyState.fullname
         *      copyState.['email'] === copyState.email
         *      ...
        */
        this.setState({
            ...copyState
        });
        /**Tạo biến copy sau đó sao chép các biến trên state bào biến này
         * Gán gán giá trị cho biến copy sau đó sao chép biến copye để setState */
    }

    checkValideInput = () => {
        let isValide = true
        let option_modal = this.props.optionModal;
        let arrInput = [];
        if (option_modal === 'create_modal') {
            arrInput = ['fullname', 'email', 'password', 'address', 'phonenumber', 'gender', 'roleid'];
        } else if (option_modal === 'edit_modal') {
            arrInput = ['fullname', 'email', 'address', 'phonenumber', 'gender', 'roleid'];
        }
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValide = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValide;
    }

    handleAddNewUser = () => {
        let isValid = this.checkValideInput();
        if (isValid === true) {
            // call api create modal
            this.props.fireCreateNewUser(this.state);
        }
    }

    listenToEmitter_clearModal = () => {
        // listen EVENT_CLEAR_MODAL from parent ( UserManage.js)
        emitter.on('EVENT_CLEAR_MODAL', message => {
            // clear data modal
            this.setState({
                id: '',
                email: '',
                password: '',
                fullname: '',
                address: '',
                phonenumber: '',
                gender: '',
                roleid: '',
                classUser: '',
                subject: []
            })
        });
    }

    listenToEmitter_setdata = () => {
        emitter.on('EVENT_SET_DATA_EDIT_MODAL', dataUser => {
            if (dataUser && !_.isEmpty(dataUser)) {
                console.log(dataUser);
                this.setState({
                    id: dataUser.id,
                    email: dataUser.email,
                    password: 'abcd',
                    fullname: dataUser.fullName,
                    address: dataUser.address,
                    phonenumber: dataUser.phone,
                    gender: dataUser.gender === "true" ? 1 : 0,
                    roleid: dataUser.roleId,
                    classUser: dataUser.classData.name,
                    subject: dataUser.Subjects
                });
            }
        });

    }

    handleEditUser = () => {
        let isValid = this.checkValideInput();
        if (isValid === true) {
            // call api create modal
            this.props.fireEditUser(this.state);
        }

    }

    render() {
        let option_modal = this.props.optionModal;
        let { arrClassUser } = this.props
        let { subject } = this.state
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-user-container'}
                size="lg"
                centered
            >
                <ModalHeader toggle={() => { this.toggle() }}>Thêm mới sinh viên</ModalHeader>
                <ModalBody>
                    <div class="container">
                        <div class="row">
                            <form action="/create-user" method="post">
                                <div class="form-row">
                                    <div class="form-group col-12">
                                        <label for="fullname">Tên</label>
                                        <input type="text" class="form-control" name="fullname" placeholder="Fullname" required
                                            onChange={(event) => { this.handleOnchangeInput(event, "fullname") }}
                                            value={this.state.fullname} />
                                    </div>
                                </div>
                                {
                                    option_modal === 'create_modal' &&
                                    <div class="form-row">

                                        <div class="form-group width-50">
                                            <label for="email">Email</label>
                                            <input type="email" class="form-control" name="email" placeholder="Email"
                                                onChange={(event) => { this.handleOnchangeInput(event, "email") }}
                                                value={this.state.email} />
                                        </div>
                                        <div class="form-group width-50">
                                            <label for="password">Mật khẩu</label>
                                            <input type="password" class="form-control" name="password" placeholder="Password"
                                                onChange={(event) => { this.handleOnchangeInput(event, "password") }}
                                                value={this.state.password} />
                                        </div>

                                    </div>
                                }{
                                    option_modal === 'edit_modal' &&
                                    <div class="form-row">

                                        <div class="form-group width-50">
                                            <label for="email">Email</label>
                                            <input type="email" class="form-control" name="email" placeholder="Email" disabled
                                                onChange={(event) => { this.handleOnchangeInput(event, "email") }}
                                                value={this.state.email} />
                                        </div>

                                    </div>
                                }
                                <div class="form-row">
                                    <div class="form-group col-12">
                                        <label for="address">Địa chỉ</label>
                                        <input type="text" class="form-control" name="address" placeholder="1234 Main St"
                                            onChange={(event) => { this.handleOnchangeInput(event, "address") }}
                                            value={this.state.address} />
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group width-50">
                                        <label for="phone">Số điện thoại</label>
                                        <input type="text" class="form-control" name="phonenumber"
                                            onChange={(event) => { this.handleOnchangeInput(event, "phonenumber") }}
                                            value={this.state.phonenumber} />
                                    </div>
                                    <div class="form-group width-25">
                                        <label for="gender">Giới tính</label>
                                        <select name="gender" class="form-control"
                                            onChange={(event) => { this.handleOnchangeInput(event, "gender") }}
                                            value={this.state.gender}>
                                            <option defaultValue hidden>Chọn giới tính</option>
                                            <option value="1">Nam</option>
                                            <option value="0">Nữ</option>
                                        </select>
                                    </div>
                                    <div class="form-group width-25">
                                        <label for="roleid">Phân quyền</label>
                                        <select name="roleid" class="form-control"
                                            onChange={(event) => { this.handleOnchangeInput(event, "roleid") }}
                                            value={this.state.roleid}>
                                            <option defaultValue hidden>Chọn quyền</option>
                                            <option value="R1">Admin</option>
                                            <option value="R2">Sinh Viên</option>
                                        </select>
                                    </div>
                                    <div class="form-group width-25">
                                        <label for="classUser">Lớp</label>
                                        <select name="classUser" class="form-control"
                                            onChange={(event) => { this.handleOnchangeInput(event, "classUser") }}
                                            value={this.state.classUser}>
                                            <option defaultValue hidden>Chọn lớp</option>
                                            {arrClassUser && arrClassUser.length > 0 && arrClassUser.map((item, index) => {
                                                return (
                                                    <option value={item.name} key={index} >{item.name}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className='user-table col-12 mt-4'>
                            <h4 >Học Phần Đã Đăng Ký</h4>
                            <table id="customers">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên môn</th>
                                        <th>Số tín chỉ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subject && subject.length > 0
                                        ?
                                        subject.map((item, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                >
                                                    <td>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.numberTinchi}</td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colspan="3" style={{ color: 'gray', textAlign: 'center' }}>Trống</td>
                                        </tr>}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {
                        option_modal === 'create_modal' &&
                        <Button color="primary px-3 mt-3" onClick={() => { this.handleAddNewUser() }}>Thêm mới</Button>
                    }{
                        option_modal === 'edit_modal' &&
                        <Button color="primary px-3 mt-3" onClick={() => { this.handleEditUser() }}>Lưu</Button>
                    }
                    <Button color="secondary px-3 mt-3" onClick={() => { this.toggle() }}>Đóng</Button>
                </ModalFooter>
            </Modal>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);

