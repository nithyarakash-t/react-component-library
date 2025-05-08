import { Children, createContext, isValidElement, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import './Modal.scss';

export interface ModalProps {
    modalId:string;
    customClass?:string;
    position?:'fixed' | 'absolute';
    role?:'dialog' | 'alertdialog';
    open?:boolean;
    hasBackdrop?: boolean;
    children?:ReactNode;
}
interface ModalContextType {
    modalId:string;
    isOpen:boolean;
    toggleDialog:()=>void;
    openDialog:()=>void;
    closeDialog:()=>void;
}
export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function Modal({modalId, customClass, position='fixed', role='dialog', open=false, hasBackdrop=true, children, ...props}:ModalProps) {
    const [isOpen, setIsOpen] = useState(open);
    const dialogRef = useRef<HTMLDialogElement>(null);

    // Find specific child components
    let header =  null, body = null, footer = null;
    
    Children.forEach(children, child => {
        if (!isValidElement(child)) return;
        
        if (child.type === ModalHeader) {
        header = child;
        } else if (child.type === ModalBody) {
        body = child;
        } else if (child.type === ModalFooter) {
        footer = child;
        }
    });

    //dialog ui methods - start
    //useeffect for open/close
    useEffect(()=>{
        if(isOpen) {
            dialogRef.current?.showModal();
            document.body.style.setProperty('overflow', 'hidden');
        }
        else {
            dialogRef.current?.close();
            document.body.style.removeProperty('overflow');
        }
    }, [isOpen])

    useEffect(()=>{
        const dialog = (dialogRef.current as HTMLDialogElement);
        //Close dialog on escape
        function handleKeyDown(e:KeyboardEvent) {
            if(e.key === 'Escape') setIsOpen(false);
        }
        //Close dialog on backdrop click
        function handlePointerDown(event:PointerEvent) {
            if ( event.target === dialog ) setIsOpen(false);
        }
        
        dialog.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('keydown', handleKeyDown);

        return ()=>{
            dialog.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [])

    function toggleDialog() {
        setIsOpen(!isOpen);
    }
    function openDialog() {
        setIsOpen(true);
    }
    function closeDialog() {
        setIsOpen(false);
    }
    //dialog ui methods - end

    return(
        <ModalContext.Provider value={{modalId, isOpen, toggleDialog, openDialog, closeDialog}}>
            {/* Render non - header, body , footer children */}
            {Children.map(children, child => {
                if ( !isValidElement(child) || (child.type !== ModalHeader && child.type !== ModalBody && child.type !== ModalFooter) ) {
                    return child;
                }
                return null;
            })}
            <dialog ref={dialogRef} id={modalId} role={role}  className={`c-modal__wrap${customClass ? ` ${customClass}` : ''}`} data-position={position}
                data-hasbackdrop={hasBackdrop}
                aria-labelledby={modalId + '-title'} {...props}>
                <div className='c-modal__container'>
                    {header}
                    
                    {body}

                    {footer}
                </div>
            </dialog>
        </ModalContext.Provider>
    )
}

//Control
export function ModalControl() {
    const modalContext = useContext(ModalContext);
    if (!modalContext) {
        throw new Error('CollapseControl must be used within a Collapse component');
    }
    const { modalId, isOpen, openDialog } = modalContext;

    return (
        <button type='button' aria-controls={modalId} aria-expanded={isOpen} onClick={openDialog}>Open Modal</button>
    )
}

// Header, body and footer
export function ModalHeader({ children }: { children: ReactNode }) {    
    return (
      <div className='c-modal__header'>
        {children || 'Sample Header'}
      </div>
    );
}
export function ModalBody({ children }: { children: ReactNode }) {
    return (
        <div className='c-modal__body'>
        {children || 'Sample content'}
        </div>
    );
}
export function ModalFooter({ children }: { children: ReactNode }) {
    return (
        <div className='c-modal__footer'>
        {children || 'Sample footer'}
        </div>
    );
}