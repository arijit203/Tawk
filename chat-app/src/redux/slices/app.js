import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";


const initialState = {
  user: {},
  sidebar: {
    open: false,
    type: "CONTACT", // can be CONTACT, STARRED, SHARED
  },
 
  tab: 0, // [0, 1, 2, 3]
  snackbar: {
    open: false,
    severity: null,
    message: null,
  },
  users:[],
  friends:[],
  friendRequests:[],
  chat_type:null, //grp chat or individual chat
  room_id:null
 
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    
    // Toggle Sidebar
    toggleSidebar(state) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSidebarType(state, action) {
      state.sidebar.type = action.payload.type;
    },
    updateTab(state, action) {
      state.tab = action.payload.tab;
    },

    openSnackbar(state, action) {
      console.log(action.payload);
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackbar(state) {
      console.log("This is getting executed");
      state.snackbar.open = false;
      state.snackbar.message = null;
    },
    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    // updateAllUsers(state, action) {
    //   state.all_users = action.payload.users;
    // },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.requests;
    },
    selectConversation(state,action){
      state.chat_type="individual";
      state.room_id=action.payload.room_id
    }
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const closeSnackbar = () => async (dispatch, getState) => {
  dispatch(slice.actions.closeSnackbar());
};

export const showSnackbar =
  ({ severity, message }) =>
  async (dispatch, getState) => {
    dispatch(
      slice.actions.openSnackbar({
        message,
        severity,
      })
    );

    setTimeout(() => {
      dispatch(slice.actions.closeSnackbar());
    }, 4000);
  };

export function ToggleSidebar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.toggleSidebar());
  };
}
export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateSidebarType({ type }));
  };
}
export function UpdateTab(tab) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateTab(tab));
  };
}


export function FetchUsers() {
  return async (dispatch, getState) => {
    console.log("Fetch Users:",getState().auth.token)
    await axios
      .get(
        "/user/get-users",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateUsers({ users: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
// export function FetchAllUsers() {
//   return async (dispatch, getState) => {
//     await axios
//       .get(
//         "/user/get-all-verified-users",

//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${getState().auth.token}`,
//           },
//         }
//       )
//       .then((response) => {
//         console.log(response);
//         dispatch(slice.actions.updateAllUsers({ users: response.data.data }));
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
// }
export function FetchFriends() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/user/get-friends",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateFriends({ friends: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
export function FetchFriendRequests() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/user/get-friend-requests",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.updateFriendRequests({ requests: response.data.data })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
}


export const selectConversation=({room_id})=>{

  return (dispatch,getState)=>{
    dispatch(slice.actions.selectConversation({room_id}));
  }
}