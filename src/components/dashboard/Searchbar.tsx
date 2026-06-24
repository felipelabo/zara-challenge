import styles from '../../styles/components/dashboard/Searchbar.module.scss';


type SearchbarProps = {
    quantity: number;
    searchQuery: string;
    onSearch: (query: string) => void;
    onClearSearch: () => void;
};

const Searchbar = ({
    quantity,
    onSearch,
    onClearSearch,
    searchQuery
}: SearchbarProps) => {

    return (
        <div className={styles['searchbar']}>
            <div className={styles['search-input-wrapper']}>
                <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    className={styles['search-input']}
                    placeholder={`Search for smartphones`}
                    autoComplete="off"
                />
                {searchQuery !== '' && (
                    <button onClick={onClearSearch} className={styles['clear-button']}>
                        ✕
                    </button>
                )}
            </div>

            <div className={styles['search-quantity']}>
                <p>{quantity} RESULTS</p>
            </div>
        </div>
    );
};

export default Searchbar;