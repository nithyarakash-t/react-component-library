import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import './ModalDraft.scss';

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
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function Modal({modalId, customClass, position='fixed', role='dialog', open=false, hasBackdrop=true, children, ...props}:ModalProps) {
    const [isOpen, setIsOpen] = useState(open);
    const dialogRef = useRef<HTMLDialogElement>(null);

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
            {children}
            <dialog ref={dialogRef} id={modalId} role={role}  className={`c-modal__wrap${customClass ? ` ${customClass}` : ''}`} data-position={position}
                data-hasbackdrop={hasBackdrop}
                aria-labelledby={modalId + '-title'} {...props}>
                <div className='c-modal__container'>
                    <div className='c-modal__header'>
                        <button type='button' className='c-modal__header-close' aria-label='Close' onClick={closeDialog}>Close</button>
                        <h2 className='c-modal__header-title' id={modalId + '-title'}>Dialog title</h2>
                    </div>
                    <div className='c-modal__body'>
                        Sample content
                    </div>
                    <div className='c-modal__footer'>
                        Sample footer
                    </div>
                </div>
            </dialog>
        </ModalContext.Provider>
    )
}

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
// interface ModalDialogProps {
//     modalId:string;
// }
// export function ModalDialog() {

// }