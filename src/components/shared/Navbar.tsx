import { useCart } from "../../context/CartContext";
import styles from "../../styles/components/shared/Navbar.module.scss";
import { useNavigate } from "react-router";


const Navbar = () => {

    const { totalItems } = useCart();
    const navigate = useNavigate();

    return (
        <nav className={styles['navbar']}>
            <h1>SMARTHPHONE</h1>
            <div className={styles['cart-info']}>
                <button
                    onClick={() => navigate('/cart')}
                >
                    CART: {totalItems}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;