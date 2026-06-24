
import useDashboard from "../hooks/useDashboard";
import SmartphoneCard from "../components/dashboard/SmartphoneCard";
import styles from '../styles/pages/Dashboard.module.scss';
import SearchBar from "../components/dashboard/Searchbar";

const Dashboard = () => {
    const {
        products,
        loading,
        error,
        handleSearch,
        searchQuery
    } = useDashboard();




    return (
        <div className={styles['dashboard']}>

            <SearchBar
                quantity={products.length}
                onSearch={handleSearch}
                searchQuery={searchQuery}
                onClearSearch={() => handleSearch('')}
            />

            {!loading && !error && products && <div className={styles['product-list']}>
                {products.map((product) => (
                    <SmartphoneCard
                        key={product.id}
                        {...product}
                    />
                ))}
            </div>}
        </div>
    );
};

export default Dashboard;