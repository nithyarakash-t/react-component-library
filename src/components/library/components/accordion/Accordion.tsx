import { useState, createContext, useContext, ReactNode, Children, cloneElement, ReactElement, isValidElement, useEffect, useRef } from 'react';
import './Accordion.scss';

/***Accordion***/
interface AccordionContextType {
    accordionId:string;
    activeCollapseId: string | null;
    setActiveCollapseId: (id: string | null) => void;
}
const AccordionContext = createContext<AccordionContextType | undefined>(undefined);
export interface AccordionProps {
    accordionId:string;
    customClass?: string;
    children?: ReactNode;
}
export function Accordion({ accordionId, customClass, children, ...props }: AccordionProps) {
    const [activeCollapseId, setActiveCollapseId] = useState<string | null>(null);

    return (
        <AccordionContext.Provider value={{accordionId, activeCollapseId, setActiveCollapseId}}>
            <div className={`c-accordion__wrap${customClass ? ` ${customClass}` : ''}`} id={accordionId} {...props}>
                {Children.map(children, (child)=>{
                    if (isValidElement(child)) {
                        return cloneElement(child as ReactElement, {'data-testparentid': accordionId})
                    }
                    return child
                })}

                {/* {children} */}
            </div>
        </AccordionContext.Provider>
    );
}

/***Collapse***/
interface CollapseContextType {
    collapseId: string;
    isOpen: boolean;
    toggleCollapse: () => void;
}
const CollapseContext = createContext<CollapseContextType | undefined>(undefined);
export interface CollapseProps {
    customClass?: string;
    collapseId: string;
    open?: boolean;
    children: ReactNode;
}
export function Collapse({ customClass, collapseId, open = false, children, ...props }: CollapseProps) {
    const [localIsOpen, setLocalIsOpen] = useState(open);
    const accordionContext = useContext(AccordionContext);
    const isInAccordion = !!accordionContext;
    const parentId = accordionContext?.accordionId || null;

    // context ? context : localState
    const isOpen = isInAccordion 
        ? accordionContext.activeCollapseId === collapseId 
        : localIsOpen;

    
    const toggleCollapse = () => {
        if (isInAccordion) {
            const newActiveId = isOpen ? null : collapseId;
            accordionContext.setActiveCollapseId(newActiveId);
        } else {
            setLocalIsOpen(!localIsOpen);
        }
    };
    
    // one off useRef because esLint asks for dep. in the dep. array
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            if (isInAccordion && open && accordionContext.activeCollapseId === null) {
                accordionContext.setActiveCollapseId(collapseId);
            } else if (!isInAccordion) {
                setLocalIsOpen(open);
            }
        }
    }, [accordionContext, collapseId, isInAccordion, open]);
    

    useEffect(() => { // non accordion collapse / req. because open is used as prop -> state, if its a prop only - we wont require this
        if (!isInAccordion) {
            setLocalIsOpen(open);
        }
    }, [open, isInAccordion]);

    // //For storybook updates --- above effect already handles this usecase
    // useEffect(()=>{
    //     setIsOpen(open);
    // },[open])
    
    return (
        <CollapseContext.Provider value={{ collapseId, isOpen,  toggleCollapse}}>
            <div className={`c-collapse__wrap${customClass ? ` ${customClass}` : ''}`} data-parentid={parentId} {...props}>
                {children}
            </div>
        </CollapseContext.Provider>
    );
}

export interface CollapseControlProps {
    children: ReactNode;
}
export function CollapseControl({ children, ...props }: CollapseControlProps) {
    const context = useContext(CollapseContext);
    
    if (!context) {
        throw new Error('CollapseControl must be used within a Collapse component');
    }
    
    const { isOpen, toggleCollapse, collapseId } = context;
    
    return (
        <button type='button' 
            className={'c-collapse__control'}
            onClick={toggleCollapse}
            aria-controls={collapseId}
            aria-expanded={isOpen}
            {...props}
        >
            {children}
        </button>
    );
}

export interface CollapseContentProps {
    children: ReactNode;
}
export function CollapseContent({ children, ...props }: CollapseContentProps) {
    const context = useContext(CollapseContext);
    
    if (!context) {
        throw new Error('CollapseContent must be used within a Collapse component');
    }
    
    const { isOpen, collapseId } = context;
    
    return (
        <div id={collapseId} className='c-collapse__contentouter' data-open={isOpen} {...props}>
            <div className='c-collapse__contentinner'>
                <div className={'c-collapse__content'}>
                    {children}
                </div>
            </div>
        </div>
    );
}