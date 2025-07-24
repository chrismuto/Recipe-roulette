import '../assets/css/Header.css'
import { Link } from 'react-router-dom'

export default function Header(props) {

    async function logout() {
        await fetch('http://localhost:3500/auth/logout', {
            method: 'POST',
            credentials: 'include', // <-- sends cookie
        });

        window.location="/";
    }

    return props.loggedIn ?
        <>
            <div className="header">
                <button className="logout" onClick={logout} >Log Out</button>
            </div>
            <hr className="horizontal-break" />
        </>
    :
        <>
            <div className="header">
                <Link to="/login"><button className="login">Log In</button></Link>
                <Link to="/signup"><button className="signup">Sign Up</button></Link>
            </div>
            <hr className="horizontal-break" />
        </>
}