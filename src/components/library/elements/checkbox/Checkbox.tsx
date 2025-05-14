import { ReactNode } from 'react';
import './Chckbox.scss';

export interface CheckboxProps {
    customClass?:string,
    name:string,
    id:string,
    disabled?:boolean,
    children?:ReactNode,
    content?:string
}

export function Checkbox({customClass, name, id, content, disabled, children, ...props}:CheckboxProps) {
    return (
        <label className={'o-checkbox' + ` ${customClass}`}>
            <input type='checkbox' name={name} id={id} 
                tabIndex={disabled ? -1 : undefined} //not really needed
                disabled={disabled ? true : undefined} {...props} />
            {content && <span className='content'>{content}</span>}
            {children}
        </label>
    )
}