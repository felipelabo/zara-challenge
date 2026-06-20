import type { ProductList } from './../types/products';

interface SmartphoneCardProps extends ProductList { }

const SmartphoneCard = ({
    id,
    brand,
    name,
    basePrice,
    imageUrl
}: SmartphoneCardProps) => {

    return (
        <div className="smartphone-card">
            <img
                src={imageUrl}
                alt={name}
                className="smartphone-image"
            />
            <div className="smartphone-info">
                <div className="smartphone-brand">
                    <h4 className='brand'>{brand}</h4>
                    <h3 className='name'>{name}</h3>
                </div>
                <div className="smartphone-price">
                    <p className='price'>{basePrice} EUR</p>
                </div>
            </div>
        </div>
    );
};

export default SmartphoneCard;