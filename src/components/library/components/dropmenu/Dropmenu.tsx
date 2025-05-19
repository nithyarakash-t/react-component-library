import { useState, KeyboardEvent as ReactKeyboardEvent, useRef, useEffect, useContext, Children, isValidElement, ReactElement, cloneElement, ReactNode, Fragment, useCallback } from "react";
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
 * 5. CONTD. --- But without href, <a> doesnt recogize enter as Enter as a click -- we dont want to handle this via our keyboardHandler 
 *              -- because this is expected to be handled via common click for mouse, enter and touch 
*/


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

    /** 4 - Register / unregister options */
    const registerOption = useCallback((el: HTMLElement | null): number => {

        if (el) {
            // Check if element is already registered
            const existingIndex = optionRefs.current.findIndex(ref => ref === el);
            if (existingIndex !== -1) {
                return existingIndex;
            }
            
            // Otherwise add it to the end
            optionRefs.current.push(el);
            console.log(optionRefs.current)
            return optionRefs.current.length - 1;
        }
        return -1;
    }, []);
    const unregisterOption = useCallback((el: HTMLElement | null): void => {
        if (el) {
            const index = optionRefs.current.findIndex(ref => ref === el);
            if (index !== -1) {
                // Remove the element
                optionRefs.current.splice(index, 1);
                
                // Update activeIndex using a functional update to avoid closure issues
                setActiveIndex(prevActiveIndex => {
                    if (prevActiveIndex === null) return null;
                    
                    if (index === prevActiveIndex) {
                        // The active element was removed, choose a new active element
                        return optionRefs.current.length > 0 ? 
                            Math.min(prevActiveIndex, optionRefs.current.length - 1) : null;
                    } else if (index < prevActiveIndex) {
                        // An element before the active element was removed, shift index down
                        return prevActiveIndex - 1;
                    }
                    
                    // Otherwise, leave activeIndex unchanged
                    return prevActiveIndex;
                });
            }
        }
    }, []);
    // const unregisterOption = useCallback((el: HTMLElement | null): void => {
    //     if (el) {
    //         const index = optionRefs.current.findIndex(ref => ref === el);
    //         if (index !== -1) {
    //             optionRefs.current.splice(index, 1);
                
    //             // Update active index if needed
    //             if (activeIndex !== null && activeIndex >= optionRefs.current.length) {
    //                 setActiveIndex(optionRefs.current.length > 0 ? optionRefs.current.length - 1 : null);
    //             }
    //         }
    //     }
    // }, [activeIndex]);

    return(
        <DropmenuContext.Provider value={{dropmenuId:id ,isOpen, setIsOpen, parentRef, controlRef, menuRef, optionRefs, activeIndex, openDropmenu:openMenu, closeDropmenu:closeMenu, toggleDropmenu:toggleMenu, registerOption, unregisterOption}}>
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
    
    // Extract the actual element if wrapped in a fragment
    let childElement: ReactElement | null = null;
    
    // Handle fragment case
    const childrenArray = Children.toArray(children);
    if (childrenArray.length === 1) {
        const child = childrenArray[0];
        if (isValidElement(child)) {
            // If it's a fragment, get its children
            if (child.type === Fragment) {
                const fragmentChildren = Children.toArray(child.props.children);
                if (fragmentChildren.length === 1 && isValidElement(fragmentChildren[0])) {
                    childElement = fragmentChildren[0] as ReactElement;
                } else {
                    throw new Error('When using a fragment in DropmenuControl, it must contain exactly one child element');
                }
            } else {
                childElement = child as ReactElement;
            }
        }
    } else {
        throw new Error('DropmenuControl must have exactly one child element');
    }
    
    if (!childElement) {
        throw new Error('DropmenuControl child must be a valid React element');
    }
    
    const {controlRef, isOpen, dropmenuId, toggleDropmenu, activeIndex, optionRefs} = CONTEXT;
    
    return cloneElement(childElement, {
        // "type": "button",
        "className": `${childElement.props.className || ''} c-dropmenu__control`.trim(),        "role": "combobox",
        "ref": controlRef,
        "aria-haspopup": true,
        "aria-controls": dropmenuId,
        "aria-expanded": isOpen,
        "onClick": toggleDropmenu,
        "aria-activedescendant": activeIndex !== null ? optionRefs.current[activeIndex]?.id : undefined
    });
}

// 3. Dropmenu Menu
export interface DropmenuMenuProps {
     // strategy?:'static' | 'dynamic',
    placement?: "bottom-start" | "bottom-end" //'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
    role?:"menu" | "dialog" | "listbox" | "true" | "grid" | "tree";
    children:ReactNode;
}
export function DropmenuMenu({placement="bottom-start", role="menu", children}:DropmenuMenuProps) {
    const CONTEXT = useContext(DropmenuContext);
    if(!CONTEXT) throw new Error('Use dropmenu control within Dropmenu Context');

    const {menuRef, isOpen, dropmenuId} = CONTEXT;

    return (
        <div id={dropmenuId} className={"c-dropmenu__container"+`${isOpen ? ' -open' : '' }`} data-placement={placement}>
            <div ref={menuRef} className="c-dropmenu__menu" role={role} aria-labelledby={dropmenuId + "-label"} >
                {children}
            </div>
        </div>
    )
}

export interface DropmenuOptionProps {
    children:ReactNode
    // optionRole?: "listitem" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "option" | "treeitem"
}
export function DropmenuOption({children}:DropmenuOptionProps) {

    const CONTEXT = useContext(DropmenuContext);
    if(!CONTEXT) throw new Error('Use dropmenu option within Dropmenu Context');
    
    // 1 - 
    // Extract the actual element if wrapped in a fragment
    let childElement: ReactElement | null = null;
    
    // Handle fragment case
    const childrenArray = Children.toArray(children);
    if (childrenArray.length === 1) {
        const child = childrenArray[0];
        if (isValidElement(child)) {
            // If it's a fragment, get its children
            if (child.type === Fragment) {
                const fragmentChildren = Children.toArray(child.props.children);
                if (fragmentChildren.length === 1 && isValidElement(fragmentChildren[0])) {
                    childElement = fragmentChildren[0] as ReactElement;
                } else {
                    throw new Error('When using a fragment in DropmenuOption, it must contain exactly one child element');
                }
            } else {
                childElement = child as ReactElement;
            }
        }
    } else {
        throw new Error('DropmenuOption must have exactly one child element');
    }
    
    if (!childElement) {
        throw new Error('DropmenuOption child must be a valid React element');
    }

    // 2 - 
    const {registerOption, closeDropmenu} = CONTEXT;

    // Register / Unregister
    const elementRef = useRef<HTMLElement | null>(null); // If we directly use optionRef.current in cleanup - The ref value 'optionRef.current' will likely have changed by the time this effect cleanup function runs. If this ref points to a node rendered by React, copy 'optionRef.current' to a variable inside the effect, and use that variable in the cleanup function
    const setOptionRef = useCallback((el: HTMLElement | null) => {
        elementRef.current = el;
        if (el) registerOption(el);
    }, [registerOption]);
    // useEffect(() => {
    //     return () => {
    //         if (elementRef.current) {
    //             unregisterOption(elementRef.current);
    //         }
    //     };
    // }, [unregisterOption]);

    // 3 - Event handler
    function handleOptionClick(event:React.MouseEvent) {
        if(event.currentTarget.tagName.toLowerCase() !== 'input') {
            closeDropmenu();
        }
    }
    
    return cloneElement(childElement, {
        "ref": setOptionRef,
        "onClick": (e:React.MouseEvent) => {
            // Preserve the original onClick if it exists
            if (childElement.props.onClick) {
                childElement.props.onClick(e);
            }
            handleOptionClick(e);
        }
    });
}






/**
 * 
 * export function DropmenuControl({children}:{children:ReactNode}) {
    const CONTEXT = useContext(DropmenuContext);
    if(!CONTEXT) throw new Error('Use dropmenu control within Dropmenu Context');
    
    // Validate that there's only one child
    const childrenArray = Children.toArray(children);
    if (childrenArray.length !== 1) {
        throw new Error('DropmenuControl must have exactly one child element');
    }
    
    const child = childrenArray[0];
    const {controlRef, isOpen, dropmenuId, toggleDropmenu, activeIndex, optionRefs} = CONTEXT;
    
    if (isValidElement(child)) {
        return cloneElement(child as ReactElement, {
            "type": "button",
            "className": "c-dropmenu__control",
            "role": "combobox",
            "ref": controlRef,
            "aria-haspopup": true,
            "aria-controls": dropmenuId,
            "aria-expanded": isOpen,
            "onClick": toggleDropmenu,
            "aria-activedescendant": activeIndex ? optionRefs.current[activeIndex]?.id : undefined
        });
    }
    
    // Handle case where child is not a valid element
    throw new Error('DropmenuControl child must be a valid React element');
   }
    
  export function DropmenuContrxl({children}:{children:ReactNode}) {
    const CONTEXT = useContext(DropmenuContext);
    if(!CONTEXT) throw new Error('Use dropmenu control within Dropmenu Context');    
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
 */