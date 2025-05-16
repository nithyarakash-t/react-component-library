import { useState } from "react";
import "./Dropmenu.scss";
/**
 * https://www.a11y-collective.com/blog/mastering-web-accessibility-making-drop-down-menus-user-friendly/
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/
 * https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/listbox/listbox-collapsible.html
 * https://github.com/FreedomScientific/standards-support/issues/211
 * https://github.com/microsoft/fluentui/issues/16490
 */
export interface DropmenuProps {
    id:string,
    customClass?:string,
    // strategy?:'static' | 'dynamic',
    placement?: "bottom-left" | "bottom-right" //'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
    role?:"menu" | "dialog" | "listbox" | "true" | "grid" | "tree";
    // optionRole?: "listitem" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "option" | "treeitem"
}
export function Dropmenu({id, customClass, placement="bottom-left" , role="menu"}:DropmenuProps) {
    const [isOpen, setIsOpen] = useState(true);

    return(
        <div className="c-dropmenu__wrap" data-class={customClass}>
            <label className="sr-only" id={id + "-label"}>Sample label</label>
            <button type="button" className="c-dropmenu__control" role="combobox" aria-haspopup={role}
                aria-controls={id} aria-expanded={isOpen} aria-labelledby={id + "-label"}
                onClick={()=>{setIsOpen(!isOpen)}} aria-activedescendant={undefined}>
                Open Dropmenu
            </button>

            <div id={id} className={"c-dropmenu__container"+`${isOpen ? ' -open' : '' }`} data-placement={placement}>
                <div className="c-dropmenu__menu" role={role} aria-labelledby={id + "-label"} >
                    <a role="option" className="c-dropmenu__item" id={id+"-option1"}>Option 1</a>
                    <a role="option" className="c-dropmenu__item" id={id+"-option2"}>Option 2</a>
                </div>
            </div>
        </div>
    )
}