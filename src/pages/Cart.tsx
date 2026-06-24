import style from "../styles/pages/Cart.module.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router";
import CartItem from "../components/cart/CartItem";
import Button from "../components/shared/Button";

const Cart = () => {

    const { items, totalItems, totalPrice } = useCart();
    const navigate = useNavigate();

    return (
        <div className={style['cart-page']}>
            <h1>{`CART (${totalItems})`}</h1>
            <div className={style['cart-items-container']}>
                {items.length > 0 && items.map((item) => (
                    <CartItem key={item.idCart} item={item} />
                ))}
            </div>
            <div className={style['cart-footer']}>
                <Button
                    style="secondary"
                    onClick={() => navigate('/')}
                >
                    CONTINUE SHOPPING
                </Button>
                <div className={style['total-price']}>
                    <p>TOTAL <span>{totalPrice} EUR</span></p>
                </div>
                <Button>
                    PAY
                </Button>
            </div>
        </div>
    );
};

export default Cart;