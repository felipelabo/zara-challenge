import style from '../../styles/components/cart/CartItem.module.scss';
import { useCart } from '../../context/CartContext';
import type { CartItem as CartItemType } from '../../types/cart';

interface CartItemProps {
    item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {

    const { removeFromCart } = useCart();

    return (
        <div className={style['cart-item']}>
            <div className={style['cart-item-image']}>
                <img src={item.colorOptions.imageUrl} alt={item.name} />
            </div>
            <div className={style['cart-item-info']}>
                <div className={style['cart-item-details']}>
                    <div className={style['cart-item-name']}>
                        <h3>{item.name}</h3>
                        <p>
                            {item.storageOptions.capacity} | {item.colorOptions.name}
                        </p>
                    </div>
                    <div className={style['cart-item-price']}>
                        <p>{item.storageOptions.price} EUR</p>
                    </div>
                </div>
                <div className={style['cart-item-actions']}>
                    <button
                        className={style['remove-button']}
                        onClick={() => removeFromCart(item.idCart)}
                    >
                        ELIMINAR
                    </button>
                </div>
            </div>

        </div>
    )

}

export default CartItem;