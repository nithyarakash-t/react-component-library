import { ButtonHTMLAttributes, ReactNode } from "react";
import './Button.scss';

interface ButtonProps {
    type?: 'button' | 'submit';
    customClass?:string;
    variant?: 'primary' | 'secondary' | 'tertiary';
    children?:ReactNode;
}
export function Button({type='button', customClass='', variant='primary', children, ...props}:ButtonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonProps>) {
    return (
        <button type={type} className={`o-button ${customClass}`}
        data-variant={variant} {...props}>
            {children}
        </button>
    )
}