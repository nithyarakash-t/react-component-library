import { useState, KeyboardEvent as ReactKeyboardEvent, useRef, useEffect, useContext, Children, isValidElement, ReactElement, cloneElement, ReactNode } from "react";
import "./Dropmenu.scss";
import { DropmenuContext } from "./DropmenuContext";
/**
 * https://www.a11y-collective.com/blog/mastering-web-accessibility-making-drop-down-menus-user-friendly/
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/
 * https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/listbox/listbox-collapsible.html
 * https://github.com/FreedomScientific/standards-support/issues/211
 * https://github.com/microsoft/fluentui/issues/16490
 */

/**
 * Cxnstraints | rules -
 * 1. Control can only be button / anchor
 * 2. Options can only be button / anchor / input - [ checkbox / radio ]
 * 3. Need to support searchfield in menu ?!
 * 4. While using anchor tabIndex becomes necessary for focus
 * 5. But without href, <a> doesnt recogize enter as Enter as a click -- we dont want to handle this via our keyboardHandler 
 *              -- because this is expected to be handled via common click for mouse, enter and touch 
*/

const TEST_OPTIONS = [
    "Option 1",
    "Option 2"
]

// 1. Dropmenu
export interface DropmenuProps {
    id:string,
    customClass?:string,
    label:string;
    children:ReactNode;
}
export function Dropmenu({id, customClass, label='', children}:DropmenuProps) {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ activeIndex, setActiveIndex ] = useState<number | null>(null);

    const parentRef = useRef<HTMLDivElement>(null);
    const controlRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<(HTMLElement | null)[]>([]);

    /** 1 - Effects */

    // Set up refs for options
    useEffect(()=>{
        if(activeIndex !== null) {
            console.log(activeIndex, optionRefs.current)
            optionRefs.current[activeIndex]?.focus({focusVisible:true} as FocusOptions);
        }
    }, [activeIndex])

    // Effect to handle opn/close
    useEffect(()=>{
        function watchClickOutside(event: MouseEvent) {
            if (parentRef.current && (event.target !== parentRef.current) && !parentRef.current.contains(event.target as HTMLElement)) {
                closeMenu(false);
            }
        }

        if (isOpen) {
            document.addEventListener('click', watchClickOutside);
        }
            
        return () => {
            document.removeEventListener('click', watchClickOutside);
        };
    },[isOpen])

    /** 2 - Open / Close */
    function toggleMenu() {
        if(isOpen) closeMenu();
        else openMenu();
    }
    function openMenu() {
        setIsOpen(true);
    }
    function closeMenu(setFocusBack = true) {
        setIsOpen(false);
        setActiveIndex(null);
        console.log(controlRef.current)
        if(setFocusBack) controlRef.current?.focus({focusVisible:true} as FocusOptions);
    }

    /** 3 - Event handlers */
    function handleParentKeydown(event:ReactKeyboardEvent) {
        // BRUTE FORCE CHECK - Keys currently being handled
        // || event.key === 'Space' || event.key === ' '
        if( !(event.key==='Tab' || event.key==='Escape' || event.key==='Enter' || event.key==='ArrowUp' || event.key==='ArrowDown') ) return;

        const IS_CONTROL_THE_TRIGGER = (event.target === controlRef.current);

        // 1. ESC
        if(event.key === 'Escape') closeMenu();

        // 2. TAB
        if(event.key === 'Tab') closeMenu(false);

        //3. Arrow Keys
        if(event.key === 'ArrowDown') {
            if(!isOpen && IS_CONTROL_THE_TRIGGER) {
                setActiveIndex(0);
                openMenu();
            }
            else {
                const NEXT_INDEX = Math.min((activeIndex ?? -1) + 1, optionRefs.current.length - 1);
                // console.log(NEXT_INDEX, optionRefs.current[NEXT_INDEX])
                setActiveIndex(NEXT_INDEX);
                // optionRefs.current[NEXT_INDEX]?.focus({focusVisible:true} as FocusOptions);
            }
        }
        if(event.key === 'ArrowUp') {
            if(!isOpen && IS_CONTROL_THE_TRIGGER) {
                setActiveIndex(optionRefs.current.length - 1);
                openMenu();
            }
            else {
                const PREV_INDEX = Math.max((activeIndex ?? 0) - 1, 0);
                // console.log(activeIndex, PREV_INDEX,  optionRefs.current[PREV_INDEX])
                setActiveIndex(PREV_INDEX);
                // optionRefs.current[PREV_INDEX]?.focus({focusVisible:true} as FocusOptions);
            }
        }
    }

    return(
        <DropmenuContext.Provider value={{dropmenuId:id ,isOpen, setIsOpen, parentRef, controlRef, menuRef, optionRefs, activeIndex, openDropmenu:openMenu, closeDropmenu:closeMenu, toggleDropmenu:toggleMenu}}>
            <div className="c-dropmenu__wrap" data-class={customClass} onKeyDown={handleParentKeydown} ref={parentRef}>
                <label className="sr-only" id={id + "-label"}>{label}</label>      
                {children}
            </div>
        </DropmenuContext.Provider>
    )
}

// 2. Dropmenu Control
export function DropmenuControl({children}:{children:ReactNode}) {
    const CONTEXT = useContext(DropmenuContext);
    if(!CONTEXT) throw new Error('Use dropmenu control within Dropmenu Context');
    
    // const role = 'combomenu';
    
    const {controlRef, isOpen, dropmenuId, toggleDropmenu, activeIndex, optionRefs} = CONTEXT;
    
    return (
        Children.map(children, (child)=>{
            if(isValidElement(child)) {
                return cloneElement(child as ReactElement, {
                    "type": "button",
                    "className": "c-dropmenu__control",
                    "role": "combobox",
                    "ref": controlRef,
                    "aria-haspopup":true,
                    "aria-controls": dropmenuId,
                    "aria-expanded": isOpen,
                    "onClick": toggleDropmenu,
                    "aria-activedescendant" : activeIndex ? optionRefs.current[activeIndex]?.id : undefined

                })
            }
            return child;
        })
    )
}

// 3. Dropmenu Menu
export interface DropmenuMenuProps {
     // strategy?:'static' | 'dynamic',
    placement?: "bottom-start" | "bottom-end" //'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
    role?:"menu" | "dialog" | "listbox" | "true" | "grid" | "tree";
    children?:ReactNode;
    // optionRole?: "listitem" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "option" | "treeitem"
}
export function DropmenuMenu({placement="bottom-start", role="menu"}:DropmenuMenuProps) { //{children}:{children:ReactNode}
    const CONTEXT = useContext(DropmenuContext);
    if(!CONTEXT) throw new Error('Use dropmenu control within Dropmenu Context');

    const {optionRefs, menuRef, isOpen, dropmenuId, closeDropmenu} = CONTEXT;

    function handleOptionClick(event:React.MouseEvent) {
        console.info(event);
        closeDropmenu();
    }

    return (
        <div id={dropmenuId} className={"c-dropmenu__container"+`${isOpen ? ' -open' : '' }`} data-placement={placement}>
            <div ref={menuRef} className="c-dropmenu__menu" role={role} aria-labelledby={dropmenuId + "-label"} >
                {TEST_OPTIONS.map((option, index)=>{
                    return (
                        <button key={index} ref={el => optionRefs.current[index] = el}
                        role="option" className="c-dropmenu__item" id={dropmenuId + "-option-" + index}
                        aria-selected={undefined}
                        onClick={handleOptionClick}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// export function DropmenuOption() {
//     return <></>
// }