import type { Product } from '../../types/products';
import styles from '../../styles/components/dashboard/SmartphoneCard.module.scss';
import { useNavigate } from "react-router";

interface SmartphoneCardProps extends Product {
    className?: string;
}

const SmartphoneCard = ({
    id,
    brand,
    name,
    basePrice,
    imageUrl,
    className
}: SmartphoneCardProps) => {

    const navigate = useNavigate();

    return (
        <div
            className={`${styles['smartphone-card']} ${className || ''}`}
            onClick={() => navigate(`/product/${id}`)}
        >
            <div className={styles['smartphone-card-content']}>
                <div className={styles['smartphone-image-container']}>
                    <img
                        src={imageUrl}
                        alt={name}
                        className={styles.image}
                    />
                </div>
                <div className={styles['smartphone-info']}>
                    <div className={styles['smartphone-brand']}>
                        <h4 className={styles.brand}>{brand.toLocaleUpperCase()}</h4>
                        <h3 className={styles.name}>{name.toLocaleUpperCase()}</h3>
                    </div>
                    <div className={styles['smartphone-price']}>
                        <p className='price'>{basePrice} EUR</p>
                    </div>
                </div>
            </div>
            <div className={styles['smartphone-fill']}></div>
        </div>
    );
};

export default SmartphoneCard;