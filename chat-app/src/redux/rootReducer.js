import { combineReducers } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'; //gives access to local storage
import appReducer from "./slices/app"
import authReducer from "./slices/auth";
import conversationReducer from "./slices/conversation";
//slices

const rootPersistConfig={
    key:'root',
    storage,
    keyPrefix:'redux-'
}

const rootReducer=combineReducers(
    {
        app:appReducer,
        auth:authReducer,
        conversation:conversationReducer,
    }
)
export {rootPersistConfig,rootReducer}