import './checkbox.scss';

export interface CheckboxProps {
    customClass?:string,
    name:string,
    id:string,
    content?:string
}

export function Checkbox({customClass, name, id, content, ...props}:CheckboxProps) {
    return (
        <label className={'o-checkbox' + ` ${customClass}`}>
            <input type='checkbox' name={name} id={id} {...props} />
            {content && <span>{content}</span>}
        </label>
    )
}