import styles from "../../styles/components/shared/Button.module.scss";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    style?: "primary" | "secondary";
};

const Button = ({ children, onClick, className, type = "button", style = "primary" }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles['button']} ${className ? className : ''} ${style === 'primary' ? styles['primary'] : styles['secondary']}`}
        >
            {children}
        </button>
    );
};

export default Button;