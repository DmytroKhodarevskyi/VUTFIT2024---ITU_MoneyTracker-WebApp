import { useState } from "react";
import api from "../../api"
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import "./Form.css"

function Form({route, method}){
    const [username, setUsername] = useState("")

    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")

    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState("")
    const navigate = useNavigate()
    const head = method === "login" ? "Who Is It?" : "Introduce Yourself."
    const button = method === "login" ? "Login" : "Register"


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault()

        if (method === "register" && password !== repeatPassword) {
            alert("Passwords do not match")
            setLoading(false)
            return;
        }

        const nameRegex = /^[A-Za-z]+$/;
        const phoneRegex = /^[+]?[1-9][0-9]{7,14}$/; 

        const trimmedFirstName = first_name.trim();
        const trimmedLastName = last_name.trim();
        const trimmedPhone = phone.trim();

        try {
            const payload = { 
                username, 
                password, 
                profile: {
                    phone,
                    country: "",  
                    city: "",
                    gender: "N",  
                    job: "Unemployed"  
                }
            };

            if (method === "register") {
                if (!nameRegex.test(trimmedFirstName)) {
                    alert("First name can only contain letters.");
                    setLoading(false);
                    return;
                }
        
                if (!nameRegex.test(trimmedLastName)) {
                    alert("Last name can only contain letters.");
                    setLoading(false);
                    return;
                }
                
                if (!phoneRegex.test(trimmedPhone)) {
                    alert(
                        "Phone number must start with + or a non-zero digit and must be 8 to 15 digits long."
                    );
                    setLoading(false);
                    return;
                }
        
                payload.email = email;
                payload.phone = phone;
                payload.first_name = first_name;
                payload.last_name = last_name;
            }

            console.log(payload);

            const res = await api.post(route, payload);
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        }  catch (error) {
            if (error.response) {
                // Log the full error response
                console.error("Error response:", error.response);
                // Extract and display the error message
                const errorMessage = error.response.data.detail || JSON.stringify(error.response.data);
                alert(`Error: ${errorMessage}`);
            } else if (error.request) {
                console.error("Error request:", error.request);
                alert("Network error. Please try again.");
            } else {
                console.error("Error message:", error.message);
                alert(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }

    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1 className="form-headertext">{head}</h1>

            <div className="inputbtn-container">
                <div className="input-container">

                <input
                    id="username"
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username*"
                />

                {method === "register" && (
                    <input
                        id="first_name"
                        className="form-input"
                        type="text"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Name*"
                    />
                )}

                {method === "register" && (
                    <input
                        id="last_name"
                        className="form-input"
                        type="text"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Surname*"
                    />
                )}

                {method === "register" && (
                    <input
                        id="email"
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email*"
                    />
                )}

                {method === "register" && (
                    <input
                        id="phone"
                        className="form-input"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number*"
                     
                    />
                )}

                <input
                    id="password"
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password*"
                />

                {method === "register" && (
                    <input
                        id="passwordrepeat"
                        className="form-input"
                        type="password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        placeholder="Repeat Password*"
                    />
                )}
                </div>

                <button className="form-button-loginregister" type="submit" disabled={loading}>
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
                <p className="hint-required">'*' in placeholder is required field</p>
        </form>
    );
}

export default Form