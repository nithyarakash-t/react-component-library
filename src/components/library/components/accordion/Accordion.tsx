import { useState, createContext, useContext, ReactNode } from 'react';
import './Accordion.scss';

/***Accordion***/
export interface AccordionProps {
    customClass?: string;
    children?: ReactNode;
}
export function Accordion({ customClass, children }: AccordionProps) {
    return (
        <div className={'c-accordion__wrap' + ' ' + customClass}>
            {children}
        </div>
    );
}

/***Collapse***/
interface CollapseContextType {
    id: string;
    isOpen: boolean;
    toggleCollapse: () => void;
}
const CollapseContext = createContext<CollapseContextType | undefined>(undefined);
export interface CollapseProps {
    customClass?: string;
    id: string;
    open?: boolean;
    children: ReactNode;
}
export function Collapse({ customClass, id, open = false, children }: CollapseProps) {
    const [isOpen, setIsOpen] = useState(open);
    
    const toggleCollapse = () => setIsOpen(!isOpen);
    
    return (
        <CollapseContext.Provider value={{ isOpen, toggleCollapse, id }}>
            <div className={'c-collapse__wrap' + ' ' + customClass}>
                {children}
            </div>
        </CollapseContext.Provider>
    );
}

export interface CollapseControlProps {
    children: ReactNode;
}
export function CollapseControl({ children }: CollapseControlProps) {
    const context = useContext(CollapseContext);
    
    if (!context) {
        throw new Error('CollapseControl must be used within a Collapse component');
    }
    
    const { isOpen, toggleCollapse, id } = context;
    
    return (
        <button type='button' 
            className={'c-collapse__control'}
            onClick={toggleCollapse}
            aria-controls={id}
            aria-expanded={isOpen}
        >
            {children}
        </button>
    );
}

export interface CollapseContentProps {
    children: ReactNode;
}
export function CollapseContent({ children }: CollapseContentProps) {
    const context = useContext(CollapseContext);
    
    if (!context) {
        throw new Error('CollapseContent must be used within a Collapse component');
    }
    
    const { isOpen, id } = context;
    
    return (
        <div id={id} className='c-collapse__contentouter' data-open={isOpen}>
            <div className='c-collapse__contentinner'>
                <div className={'c-collapse__content'}>
                    {children}
                </div>
            </div>
        </div>
    );
}