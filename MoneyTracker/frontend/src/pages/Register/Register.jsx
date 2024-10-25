import Form from "../../components/RegistrationLoginForms/Form"

function Register() {
    return (
        <Form route ="/api/user/register/" method="register" />
    )
}

export default Register