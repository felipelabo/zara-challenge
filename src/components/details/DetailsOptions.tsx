import type {
    StorageOptions,
    ColorOptions
} from "../../types/products";
import style from "../../styles/components/details/DetailsOptions.module.scss";


type DetailsOptionsProps = {
    storageOptions: StorageOptions[];
    colorOptions: ColorOptions[];
    selectedStorage: StorageOptions | null;
    selectedColor: ColorOptions | null;
    onStorageChange: (storage: StorageOptions) => void;
    onColorChange: (color: ColorOptions) => void;
};

const DetailsOptions = ({
    storageOptions,
    colorOptions,
    selectedStorage,
    selectedColor,
    onStorageChange,
    onColorChange
}: DetailsOptionsProps) => {

    return (

        <div className={style['details-options']}>
            <div className={style['storage-options']}>
                <h3 className={style.title}>
                    STORAGE ¿HOW MUCH SPACE DO YOU NEED?
                </h3>
                <div>
                    {storageOptions.map((storage) => (
                        <button
                            className={`${style['storage-button']} ${selectedStorage?.capacity === storage.capacity ? style['selected-storage'] : ''}`}
                            key={storage.capacity}
                            onClick={() => onStorageChange(storage)}
                        >
                            {storage.capacity}
                        </button>
                    ))}
                </div>
            </div>

            <div className={style['color-options']}>
                <h3 className={style.title}>
                    COLOR. PICK YOUR FAVOURITE.
                </h3>
                <div className={style['color-options-container']}>
                    <div className={style['color-button-wrapper']}>
                        {colorOptions.map((color) => (
                            <button
                                className={`${style['color-button']} ${selectedColor?.hexCode === color.hexCode ? style['selected-color'] : ''}`}
                                key={color.hexCode}
                                onClick={() => onColorChange(color)}
                            >
                                <span
                                    style={{ backgroundColor: color.hexCode }}
                                ></span>
                            </button>
                        ))}
                    </div>
                    <p>{selectedColor?.name}</p>
                </div>
            </div>

        </div>
    )
}

export default DetailsOptions;