import '../assets/css/Login.css'

function Signup() {

    const createUser = async (e) => {
        try {
            e.preventDefault()
            let formUsername = document.getElementById('username').value
            let formPassword = document.getElementById('password').value
            
            await fetch(
                "http://localhost:3500/users",
                {
                    method: 'POST',
                    body: JSON.stringify({ username: formUsername, password: formPassword}),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
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

                <button onClick={createUser}>Create User</button>
            </form>
        </>
    )
}

export default Signup