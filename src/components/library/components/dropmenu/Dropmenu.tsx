import { useState, KeyboardEvent as ReactKeyboardEvent, useRef, useEffect, RefObject } from "react";
import "./Dropmenu.scss";
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
*/

const TEST_OPTIONS = [
    "Option 1",
    "Option 2"
]
export interface DropmenuProps {
    id:string,
    customClass?:string,
    // strategy?:'static' | 'dynamic',
    placement?: "bottom-left" | "bottom-right" //'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
    role?:"menu" | "dialog" | "listbox" | "true" | "grid" | "tree";
    // optionRole?: "listitem" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "option" | "treeitem"
}
export function Dropmenu({id, customClass, placement="bottom-left" , role="menu"}:DropmenuProps) {
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
            optionRefs.current[activeIndex]?.focus();
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
        if(setFocusBack) controlRef.current?.focus();
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

    function handleOptionClick(event:React.MouseEvent) {
        console.info(event, event.target);
        closeMenu();
    }

    return(
        <div className="c-dropmenu__wrap" data-class={customClass} onKeyDown={handleParentKeydown} ref={parentRef}>
            <label className="sr-only" id={id + "-label"}>Sample label</label>
            <button ref={controlRef as RefObject<HTMLButtonElement>} type="button" className="c-dropmenu__control" role="combobox" aria-haspopup={role}
                aria-controls={id} aria-expanded={isOpen} aria-labelledby={id + "-label"}
                onClick={toggleMenu} 
                aria-activedescendant={activeIndex ? optionRefs.current[activeIndex]?.id : undefined}>
                Open Dropmenu
            </button>

            <div id={id} className={"c-dropmenu__container"+`${isOpen ? ' -open' : '' }`} data-placement={placement}>
                <div ref={menuRef} className="c-dropmenu__menu" role={role} aria-labelledby={id + "-label"} >
                    {TEST_OPTIONS.map((option, index)=>{
                        return (
                            <a tabIndex={0} key={index} ref={el => optionRefs.current[index] = el}
                            role="option" className="c-dropmenu__item" id={id + "-option-" + index}
                            aria-selected={undefined}
                            onClick={handleOptionClick}
                            // onKeyDown={handleParentKeydown}
                            >
                                {option}
                            </a>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}