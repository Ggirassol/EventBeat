import { Link } from 'react-router-dom';
import './NavBar.css'

const NavBar = () => {
    return (
        <nav className='nav-bar'>
            <Link to='/'>HomePage</Link>
            <Link to='/my-events'>My events</Link>
        </nav>
    )
}

export default NavBar;