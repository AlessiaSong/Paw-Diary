import { useState } from "react";

const UserLogin = ({ setLoggedInUser, updateCallback }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            email,
            password
        }

        // const url = "http://18.140.54.37:5001/login_user"
const url = "http://127.0.0.1:5001/users/login"
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            const data = await response.json()
            setLoggedInUser(data) //保存登录用户
            console.log("Logged in user:", data);
            updateCallback() //关闭弹窗+可选刷新
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default UserLogin