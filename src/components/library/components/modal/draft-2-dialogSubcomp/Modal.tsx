import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { ModalContext  } from './ModalContext';
import './Modal.scss';

export interface ModalProps {
    modalId: string;
    open?: boolean;
    children?: ReactNode;
}

export function Modal({modalId, open=false, children}: ModalProps) {
    const [isOpen, setIsOpen] = useState(open);

    function toggleDialog() {
        setIsOpen(!isOpen);
    }
    function openDialog() {
        setIsOpen(true);
    }
    function closeDialog() {
        setIsOpen(false);
    }

    return(
        <ModalContext.Provider value={{modalId, isOpen, setIsOpen, toggleDialog, openDialog, closeDialog}}>
            {children}
        </ModalContext.Provider>
    )
}

//Control - sample
export function ModalControl() {
    const modalContext = useContext(ModalContext);
    if (!modalContext) {
        throw new Error('ModalControl must be used within a Modal component');
    }
    const { modalId, isOpen, openDialog } = modalContext;

    return (
        <button type='button' aria-controls={modalId} aria-expanded={isOpen} onClick={openDialog}>Open Modal</button>
    )
}

interface ModalDialogProps {
    customClass?: string;
    position?: 'fixed' | 'absolute';
    role?: 'dialog' | 'alertdialog';
    hasBackdrop?: boolean;

    children?: ReactNode;
}

export function ModalDialog({customClass='', position='fixed', role='dialog', hasBackdrop=true, children, ...props}: ModalDialogProps) {
    const modalContext = useContext(ModalContext);
    if(!modalContext) {
        throw new Error('ModalDialog should be used within a Modal component');
    }
    const {modalId, isOpen, setIsOpen, closeDialog} = modalContext;

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
    }, [setIsOpen])
    //dialog ui methods - end

    return (
        <dialog ref={dialogRef} id={modalId} role={role}  className={`c-modal__wrap${customClass ? ` ${customClass}` : ''}`} data-position={position}
                data-hasbackdrop={hasBackdrop}
                aria-labelledby={modalId + '-title'} {...props}>
            <div className='c-modal__container'>
                {
                    children ? 
                    children
                    :
                    <>
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
                    </>
                }
            </div>
        </dialog>
    )
}