import {createSlice} from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { showSnackbar } from "./app";

const initialState = {
    isLoading:false,
    isLoggedIn: false,
    token: "",
    email:""
  };
  
  const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      logIn(state, action) {
        state.isLoggedIn = action.payload.isLoggedIn;
        state.token = action.payload.token;
      },
      signOut(state, action) {
        state.isLoggedIn = false;
        state.token = "";
      },
      updateRegisterEmail(state, action) {
        state.email = action.payload.email;
      },
      updateIsLoading(state,action){
          state.isLoading=action.payload.isLoading;
          state.error=action.payload.error;
      }
    },
  });

  
export default slice.reducer;

//Log In

export function LoginUser(formValues){  //thunk-function
    return async(dispatch,getState)=>{
        await axios.post("/auth/login",{
            ...formValues,
        },{
            headers:{
                "Content-Type":"application/json"
            }
        }).then(function(response){
            console.log(response);
            dispatch(slice.actions.logIn({
              isLoggedIn:true,
              token:response.data.token
            }));
            window.localStorage.setItem("user_id",response.data.user_id);
            dispatch(
              showSnackbar({ severity: "success", message: response.data.message })
            );
            
        }).catch(function(error){
            console.log(error)
            dispatch(showSnackbar({ severity: "error", message: error.message }));

        })
    }

}

export function LogoutUser() {
  return async (dispatch, getState) => {
    window.localStorage.removeItem("user_id");
    dispatch(slice.actions.signOut());
    
  };
}


export function ForgotPassword(formValues) {
  return async (dispatch, getState) => {
    // dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/forgot-password",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log("forgot-password")
        console.log(response);

        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        // dispatch(
        //   slice.actions.updateIsLoading({ isLoading: false, error: false })
        // );
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: error.message }));
        // dispatch(
        //   slice.actions.updateIsLoading({ isLoading: false, error: true })
        // );
      });
  };
}


export function NewPassword(formValues) {
  return async (dispatch, getState) => {
    // dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/reset-password",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log("New Password Demand:",response);
       
        // dispatch(
        //     slice.actions.logIn({
        //       isLoggedIn: true,
        //       token: response.data.token,
        //     })
        //   );
        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        window.location.href = "/auth/login";
        // dispatch(
        //   slice.actions.updateIsLoading({ isLoading: false, error: false })
        // );
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: error.message }));
        // dispatch(
        //   slice.actions.updateIsLoading({ isLoading: false, error: true })
        // );
      });
  };
}


export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/register",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        dispatch(
          slice.actions.updateRegisterEmail({ email: formValues.email })
        );

        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          slice.actions.updateIsLoading({ error: true, isLoading: false })
        );
      })
      .finally(() => {
        if (!getState().auth.error) {
          window.location.href = "/auth/verify";
        }
      });
  };
}



export function VerifyEmail(formValues) {
  return async (dispatch, getState) => {
    // dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/verify-otp",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        dispatch(slice.actions.updateRegisterEmail({ email: "" }));
        window.localStorage.setItem("user_id", response.data.user_id);
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
          })
        );

        window.localStorage.setItem("user_id",response.data.user_id);
        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        // dispatch(
        //   slice.actions.updateIsLoading({ isLoading: false, error: false })
        // );
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          slice.actions.updateIsLoading({ error: true, isLoading: false })
        );
      });
  };
}
