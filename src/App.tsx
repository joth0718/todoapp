import React, { useState } from "react";
import Constants from './utilities/Constants';
import AuthenticatedApp from "./components/AuthenticatedApp";
import UnAuthenticatedApp from "./components/UnAuthenticatedApp";

export default function App() {

    let jwt = sessionStorage.getItem('jwt');

    if (jwt !== "undefined" && jwt !== null) {
        return <AuthenticatedApp />
    } else {
        return <UnAuthenticatedApp />
    }
}
function useAuth() {
    const url = Constants.API_URL_GET_USER;
    let jwtToken = sessionStorage.getItem('jwt');
    
    const userToVerify = {
        "JWTToken": jwtToken,
        "UserName": 'admin'
    };


    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + jwtToken
        },
        body: JSON.stringify(userToVerify)
    })
        .then(response => response.json())
        .then(responseFromServer => {
            console.log(responseFromServer);
        })
        .catch((error) => {
            console.log(error);
        });

}

