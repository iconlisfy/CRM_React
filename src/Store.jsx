import { legacy_createStore as createStore } from 'redux';
const auth = JSON.parse(sessionStorage.getItem('auth'));
const initialState = {
  sidebarShow: true,
  // theme: 'dark',
  isAuthenticated: auth ? true : false,
  token: auth ? auth.token : null,
  user: auth ? auth.user : null,
  showDialog: false,
  yearId: null,
  latestYear: null,
  latestYearId: null,
  // themes: 'default',
}

const changeState = (state = initialState, { type, payload, }) => {
  switch (type) {
    case 'set':
      return { ...state, ...payload, }
    case 'login':
      //console.log("Login token:", payload); // Log the token

      sessionStorage.setItem('auth', JSON.stringify({
        token: payload.token,
        user: payload.user,
      })); // Store the token in sessionStorage
      return {
        ...state,
        isAuthenticated: true,
        token: payload.token,
        user: payload.user,
      };


    case 'Logout':
      // console.log('logout recived');
      sessionStorage.removeItem('auth'); // Clear the token from sessionStorage
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        showDialog: false, // Ensure dialog is hidden when logged out
      };
    case 'SHOW_DIALOG': // Action to show the dialog
      return {
        ...state,
        showDialog: true,
      };
    case 'HIDE_DIALOG': // Action to hide the dialog
      return {
        ...state,
        showDialog: false,
      };
    case 'UPDATE_YEAR_BRANCH':
      return {
        ...state,
        year: payload.year,
        yearId: payload.yearId,
        branch: payload.branch,
        branchKey: payload.branchKey
      };
    case 'UPDATE_LATEST_YEAR':


      return {
        ...state,
        latestYear: payload.latestYear,
        latestYearId: payload.latestYearId
      };


    default:
      return state;
  }


}
const store = createStore(changeState)

export default store
