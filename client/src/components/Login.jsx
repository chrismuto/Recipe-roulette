import '../assets/css/Login.css'

function Signup() {

    const login = async (e) => {
        e.preventDefault(); // prevent form submit reload if any
        try {
            const formUsername = document.getElementById('username').value;
            const formPassword = document.getElementById('password').value;

            const res = await fetch("http://localhost:3500/auth", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ username: formUsername, password: formPassword }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Login failed:", errorData.message);
            return;
            }

            // Redirect or update UI here after login
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    return (
        <>
            <img src="../../src/assets/images/empty-bowl-md.png"></img>

            <form className="login-form">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username"></input>

                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password"></input>

                <button onClick={login}>Log In</button>
            </form>
        </>
    )
}

export default Signup