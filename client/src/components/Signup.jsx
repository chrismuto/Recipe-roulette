import '../assets/css/Login.css'

function Signup() {

    const createUser = async (e) => {
        try {
            e.preventDefault()
            let formUsername = document.getElementById('username').value
            let formPassword = document.getElementById('password').value
            let formConfirmPassword = document.getElementById('confirm-username').value
            
            let serverResponse = await fetch(
                "http://localhost:3500/users",
                {
                    method: 'POST',
                    body: JSON.stringify({ username: formUsername, confirmPassword: formConfirmPassword, password: formPassword}),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )

            let status = serverResponse.status
            let json = await serverResponse.json()

            if (status !== 201) {
                alert(json.message);
            } else {
                window.location.href = "/login";
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <img src="../../src/assets/images/empty-bowl-md.png"></img>

            <form className="login-form">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username"></input>

                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password"></input>
                
                <label htmlFor="confirm-username">Confirm Password</label>
                <input type="password" name="confirm-username" id="confirm-username"></input>

                <button onClick={createUser} className="signup-button">Create User</button>
            </form>
        </>
    )
}

export default Signup