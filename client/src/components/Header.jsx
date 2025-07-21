import '../assets/css/Header.css'

export default function Header(props) {

    async function logout() {
        await fetch('http://localhost:3500/auth/logout', {
            method: 'GET',
            credentials: 'include', // <-- sends cookie
        });

    }

    if (props.loggedIn === true) {
        return (
            <>
                <div className="header">
                    <button className="logout">Log Out</button>
                </div>
                <hr className="horizontal-break" />
            </>
        )
    } else if (props.loggedIn === false ) {
        return (
            <>
                <div className="header">
                    <button className="login">Log In</button>
                    <button className="signup">Sign Up</button>
                </div>
                <hr className="horizontal-break" />
            </>
        )
    }
}