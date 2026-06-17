import store from './Store';

const getReduxState = () => {
  const state = store.getState();
  console.log("Redux state:", state);
  return {
    isAuthenticated: state.isAuthenticated,
    token: state.token,
    empId: state.user.empId,
    name: state.user.name,
    dept: state.user.dept,
    deptid: state.user.deptid,
    role: state.user.role,
    branch: state.user.branch,
    BrnchKey: state.user.Brnch_Key,
    Image: state.user.Image,
    SuperAdmin: state.user.SuperAdmin
  };
};


export default getReduxState;
