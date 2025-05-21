import { ReactNode } from 'react';
import './Radio.scss';

export interface RadioProps {
    customClass?:string,
    name:string,
    id:string,
    disabled?:boolean,
    children?:ReactNode,
    content?:string
}

export function Radio({customClass, name, id, content, disabled, children, ...props}:RadioProps) {
    return (
        <label className={'o-radio' + ` ${customClass}`}>
            <input type='radio' name={name} id={id} 
                tabIndex={disabled ? -1 : undefined}
                disabled={disabled ? true : undefined} {...props} />
            {content && <span className='content'>{content}</span>}
            {children}
        </label>
    )
}