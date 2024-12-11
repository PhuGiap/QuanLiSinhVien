import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import TinchiManage from '../containers/SystemStudent/TinchiManage';
import ProfileStudent from '../containers/SystemStudent/ProfileStudent';

class System extends Component {
    render() {
        const { systemMenuPath, userInfo } = this.props;
        return (
            <div className="system-container">
                <div className="system-list">
                    {userInfo.roleId === 'R1' ?
                        <Switch>
                            <Route path="/system/profile" component={ProfileStudent} />
                            <Route path="/system/user-manage" component={UserManage} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                        :
                        <Switch>
                            <Route path="/system/profile" component={ProfileStudent} />
                            <Route path="/system/register-tinchi" component={TinchiManage} />
                        </Switch>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
