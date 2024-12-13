/**
 * File: Login.jsx
 * Description: Login page.
 * Author: Dmytro Khodarevskyi
 * 
 * Notes:
 * - _
 */


import Form from "../../components/RegistrationLoginForms/Form"

function Login() {
    return (
        <Form route ="/api/token/" method="login" />
    )

}

export default Login