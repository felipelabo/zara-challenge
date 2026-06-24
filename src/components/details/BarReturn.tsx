import { useNavigate } from "react-router";
import style from '../../styles/components/details/BarReturn.module.scss';

const BarReturn = () => {
    const navigate = useNavigate();

    return (
        <div className={style['bar-return']}>
            <button
                className={style['return-button']}
                onClick={() => navigate('/')}
            >
                BACK
            </button>
        </div>
    );
};

export default BarReturn;