import { useState } from "react";
import "./Dropmenu.scss";
/**
 * https://www.a11y-collective.com/blog/mastering-web-accessibility-making-drop-down-menus-user-friendly/
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/
 * https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/listbox/listbox-collapsible.html
 */
export interface DropmenuProps {
    id:string,
    customClass?:string,
    role?:"menu" | "dialog" | "listbox" | "true" | "grid" | "tree";
    // optionRole?: "listitem" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "option" | "treeitem"
}
export function Dropmenu({id, customClass, role="menu"}:DropmenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <div className="c-dropmenu__wrap" data-class={customClass}>
            <label className="sr-only" id={id + "-label"}>Sample label</label>
            <button type="button" className="c-dropmenu__control" role="combobox" aria-haspopup={role}
                aria-controls={id} aria-expanded="true" aria-labelledby={id + "-label"}
                onClick={()=>{setIsOpen(!isOpen)}}aria-activedescendant={undefined}>
                Open Dropmenu
            </button>

            <div id={id} className={"c-dropmenu__container"+`${isOpen ? '-open' : '' }`}>
                <ul className="c-dropmenu__menu" role={role} aria-labelledby={id + "-label"}
                >
                    <li role="option">
                        <button type="button" id={id+"-option1"}>Option 1</button>
                    </li>
                     <li role="option">
                        <button type="button" id={id+"-option2"}>Option 2</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}