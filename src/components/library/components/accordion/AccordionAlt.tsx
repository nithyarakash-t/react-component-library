import { useState, createContext, useContext, ReactNode, Children, cloneElement, ReactElement, isValidElement, useEffect, useRef, useCallback } from 'react';
import './AccordionAlt.scss';

/**
 * React Design Patterns Resources
 * 
 * High-Level Pattern Resources:
 * - React Patterns (Official): https://reactpatterns.com/
 * - Kent C. Dodds - Advanced React Patterns: https://kentcdodds.com/blog/advanced-react-patterns
 * - React Patterns on patterns.dev: https://www.patterns.dev/react
 * - Bulletproof React Architecture: https://github.com/alan2207/bulletproof-react
 * 
 * Low-Level Pattern Resources:
 * - useHooks Collection: https://usehooks.com/
 * - React Hook Form Patterns: https://react-hook-form.com/advanced-usage
 * - Hooks Patterns - React Training: https://reacttraining.com/blog/hooks-patterns/
 * - Redux Style Guide: https://redux.js.org/style-guide/style-guide
 * 
 * Compound Components:
 * - LogRocket Guide: https://blog.logrocket.com/guide-compound-components-react/
 * - Smashing Magazine Article: https://www.smashingmagazine.com/2021/08/compound-components-react/
 * - React Training Guide: https://reacttraining.com/blog/compound-components-with-react-hooks/
 * 
 * Registry Pattern:
 * - Nicholas Jamieson article: https://ncjamieson.com/registry-pattern-in-typescript/
 * - Kent C. Dodds - State Colocation: https://kentcdodds.com/blog/state-colocation-will-make-your-react-app-faster
 * - React Hooks - useRegistry: https://github.com/Paol-imi/react-hooks/tree/master/src/hooks/useRegistry
 * 
 * Books:
 * - "Learning Patterns" by Lydia Hallie and Addy Osmani
 * - "React Design Patterns and Best Practices" by Michele Bertoli
 * - "Patterns.dev" (free e-book): https://www.patterns.dev/
 */

/**
 * APPROACH 2: REGISTRY PATTERN WITH useRef
 * 
 * References for Registry Pattern and Compound Components
 * 
 * React Spectrum's Accordion (Adobe)
 * - GitHub Repository: https://github.com/adobe/react-spectrum
 * - Accordion Documentation: https://react-spectrum.adobe.com/react-spectrum/Accordion.html
 * - Component Source: https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/accordion/src/Accordion.tsx
 * 
 * Headless UI's Disclosure
 * - GitHub Repository: https://github.com/tailwindlabs/headlessui
 * - Disclosure Documentation: https://headlessui.dev/react/disclosure
 * - Component Source: https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-react/src/components/disclosure/disclosure.tsx
 * 
 * Radix UI's Accordion
 * - GitHub Repository: https://github.com/radix-ui/primitives
 * - Accordion Documentation: https://www.radix-ui.com/primitives/docs/components/accordion
 * - Component Source: https://github.com/radix-ui/primitives/blob/main/packages/react/accordion/src/Accordion.tsx
 * 
 * This implementation creates an accordion using a registry pattern where
 * collapse components register themselves with the accordion.
 * It prevents unnecessary re-renders of the Accordion component.
 */

/**
 * Accordion Context - Provides registration and control methods
 */
interface AccordionContextType {
    accordionId: string;
    registerCollapse: (id: string, setOpen: (isOpen: boolean) => void) => () => void;
    openCollapse: (id: string) => void;
}
const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

/**
 * Accordion Props Interface
 */
export interface AccordionProps {
    accordionId: string;
    customClass?: string;
    children?: ReactNode;
}

/**
 * Accordion Component - Container for collapse items
 * Uses a registry to manage collapse items
 */
export function Accordion({ accordionId, customClass, children, ...props }: AccordionProps) {
    // Use ref to avoid re-renders when registry changes
    const collapseRegistry = useRef(new Map<string, (isOpen: boolean) => void>());
    
    // Register a collapse component with this accordion
    const registerCollapse = useCallback((id: string, setOpen: (isOpen: boolean) => void) => {
        collapseRegistry.current.set(id, setOpen);
        
        // Return function to unregister when unmounted
        return () => {
            collapseRegistry.current.delete(id);
        };
    }, []);
    
    // Open a specific collapse and close all others
    const openCollapse = useCallback((targetId: string) => {
        collapseRegistry.current.forEach((setOpen, id) => {
            setOpen(id === targetId);
        });
    }, []);
    
    return (
        <AccordionContext.Provider value={{ accordionId, registerCollapse, openCollapse }}>
            <div className={`c-accordion__wrap ${customClass || ''}`} id={accordionId} {...props}>
                {Children.map(children, (child) => {
                    // Only clone if it's a valid React element
                    if (isValidElement(child)) {
                        return cloneElement(child as ReactElement, { 'data-testparentid': accordionId });
                    }
                    return child;
                })}
            </div>
        </AccordionContext.Provider>
    );
}

/**
 * Collapse Context - Handles state for individual collapse components
 */
interface CollapseContextType {
    collapseId: string;
    isOpen: boolean;
    toggleCollapse: () => void;
}
const CollapseContext = createContext<CollapseContextType | undefined>(undefined);

/**
 * Collapse Props Interface
 */
export interface CollapseProps {
    customClass?: string;
    collapseId: string;
    open?: boolean;
    children: ReactNode;
}

/**
 * Collapse Component - Individual expandable section
 * Registers with parent accordion if available
 */
export function Collapse({ customClass, collapseId, open = false, children, ...props }: CollapseProps) {
    const [isOpen, setIsOpen] = useState(open);
    const accordionContext = useContext(AccordionContext);
    const isInAccordion = !!accordionContext?.registerCollapse;
    
    // Register with accordion if we're in one
    useEffect(() => {
        if (isInAccordion) {
            // Register this collapse with parent accordion
            const unregister = accordionContext.registerCollapse(collapseId, setIsOpen);
            
            // If initially open, notify accordion
            if (open) {
                accordionContext.openCollapse(collapseId);
            }
            
            // Clean up on unmount
            return unregister;
        }
    }, [collapseId, accordionContext, isInAccordion, open]);
    
    // Toggle function adapts based on whether it's in accordion
    const toggleCollapse = () => {
        if (isInAccordion) {
            // If in accordion and already open, close it
            // Otherwise open this one (which will close others)
            if (isOpen) {
                setIsOpen(false);
            } else {
                accordionContext.openCollapse(collapseId);
            }
        } else {
            // Standalone toggle
            setIsOpen(!isOpen);
        }
    };
    
    return (
        <CollapseContext.Provider value={{ collapseId, isOpen, toggleCollapse }}>
            <div 
                className={`c-collapse__wrap ${customClass || ''}`}
                data-parentid={accordionContext?.accordionId || null}
                {...props}
            >
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