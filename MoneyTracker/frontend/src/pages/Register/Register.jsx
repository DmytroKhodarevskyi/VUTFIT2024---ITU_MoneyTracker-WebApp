/**
 * File: Register.jsx
 * Description: Page for registering.
 * Author: Dmytro Khodarevskyi
 * 
 * Notes:
 * - _
 */


import Form from "../../components/RegistrationLoginForms/Form"

function Register() {
    return (
        <Form route ="/api/user/register/" method="register" />
    )
}

export default Register