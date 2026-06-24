import { useParams } from "react-router";
import useDetails from "../hooks/useDetails";
import SmartphoneCard from "../components/dashboard/SmartphoneCard";
import style from '../styles/pages/Details.module.scss';
import BarReturn from "../components/details/BarReturn";
import DetailsOptions from "../components/details/DetailsOptions";


const Details = () => {
    const { id } = useParams<{ id: string }>();
    const {
        productDetails,
        loading,
        error,
        selectedColor,
        setSelectedColor,
        selectedStorage,
        setSelectedStorage,
        handleAddToCart,
    } = useDetails(id!);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!productDetails) {
        return <div>No product details found.</div>;
    }

    if (!selectedColor) {
        return <div>No color options available.</div>;
    }

    return (
        <div className={style['details-page']}>

            <BarReturn />

            <div className={style['details-container']}>
                <div className={style['details-image']}>
                    <img
                        src={selectedColor.imageUrl}
                        alt={productDetails.name}
                    />
                </div>
                <div className={style['details-info']}>
                    <div className={style.header}>
                        <h1 className={style.name}>{
                            productDetails.name.toLocaleUpperCase()
                        }</h1>
                        <p className={style.price}>
                            From {selectedStorage ? selectedStorage.price : productDetails.basePrice} EUR
                        </p>
                    </div>
                    <DetailsOptions
                        storageOptions={productDetails.storageOptions}
                        colorOptions={productDetails.colorOptions}
                        selectedStorage={selectedStorage}
                        selectedColor={selectedColor}
                        onStorageChange={setSelectedStorage}
                        onColorChange={setSelectedColor}
                    />
                    <button
                        className={style['add-button']}
                        disabled={!selectedStorage}
                        onClick={handleAddToCart}
                    >
                        AÑADIR
                    </button>
                </div>
            </div>

            <div className={style['details-specifications']}>
                <h2 className={style['title-section']}>SPECIFICATIONS</h2>
                <ul className={style.list}>
                    {Object.entries(productDetails.specs).map(([key, value]) => (
                        <li key={key} className={style.item}>
                            <p className={style.label}>
                                {key.toLocaleUpperCase()}
                            </p>
                            <p className={style.value}>
                                {value}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={style['details-similar-products']}>
                <h2 className={style['title-section']}>SIMILAR ITEMS</h2>
                <div className={style['similar-products-list']}>
                    {productDetails.similarProducts.map((product) => (
                        <SmartphoneCard
                            className={style['similar-product-card']}
                            key={product.id}
                            {...product}
                        />
                    ))}
                </div>
            </div>

        </div>

    );
};

export default Details;