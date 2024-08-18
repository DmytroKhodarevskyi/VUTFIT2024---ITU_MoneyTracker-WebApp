import { useState } from "react";
import api from "../api"
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"

function Form({route, method}){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState("")
    const navigate = useNavigate()
    const name = method === "login" ? "Who Is it?" : "Introduce Yourself."
    const button = method === "login" ? "Login" : "Register"


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault()

        if (method === "register" && password !== repeatPassword) {
            alert("Passwords do not match")
            setLoading(false)
            return;
        }

        try {
            const payload = { username, password };
            if (method === "register") {
                payload.email = email;
            }

            const res = await api.post(route, payload);
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }

        // try {
        //     const res = await api.post(route, {username, password})
        //     if (method === "login") {
        //         localStorage.setItem(ACCESS_TOKEN, res.data.access);
        //         localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        //         navigate("/")
        //     } else {
        //         navigate("/login")
        //     }
        // } catch (error) {
        //     alert(error)
        // } finally {
        //     setLoading(false)
        // }
    }

    // return  (
    //     <form onSubmit={handleSubmit} className="form-container" >
    //         <h1> {name} </h1>

    //         <input
    //             className="form-input"
    //             type="text"
    //             value={username}
    //             onChange={(e) => setUsername(e.target.value)}
    //             placeholder="Username"
    //         />

    //         <input
    //             className="form-input"
    //             type="password"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             placeholder="Password"
    //         />

    //         <button className="form-button" type="submit">
    //             {name}
    //         </button>
    //     </form>
    // )

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1 className="form-headertext">{name}</h1>

            <div className="inputbtn-container">
                <div className="input-container">

                <input
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />

                {method === "register" && (
                    <input
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                )}

                <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />

                {method === "register" && (
                    <input
                        className="form-input"
                        type="password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        placeholder="Repeat Password"
                    />
                )}
                </div>

                <button className="form-button" type="submit" disabled={loading}>
                    <p className="form-button-text"> {button} </p> 
                </button>

            </div>
                {method === "login" && (
                    <div className="form-registerbtn-container">
                        <p className="form-notregistered">Not registered?</p>
                        
                        <Link to="/register">
                            <p className="form-create-account">Create an Account!</p>
                        </Link>
                    </div>
                )}

                {method === "register" && (
                    <Link to="/login">
                        <a className="form-goback">Go Back</a>
                    </Link>
                )}
        </form>
    );
}

export default Form