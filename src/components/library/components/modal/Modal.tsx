import { Children, cloneElement, isValidElement, ReactElement, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { ModalContext, useModalContext  } from './ModalContext';
import './Modal.scss';
// import { Button } from '../../elements/button/Button';
import { setFocusToFirstItem, trapTabKey } from '../../../../assets/scripts/utils/util';

//1 - Modal
interface ModalProps {
    modalId: string;
    open?: boolean;
    children?: ReactNode;
}
function Modal({modalId, open=false, children}: ModalProps) {
    const [isOpen, setIsOpen] = useState(open);

    // Modal fns. - start
    function toggleDialog() {
        setIsOpen(!isOpen);
    }
    function openDialog() {
        setIsOpen(true);
    }
    function closeDialog() {
        setIsOpen(false);
    }
    // Modal fns. - end

    return(
        <ModalContext.Provider value={{modalId, isOpen, setIsOpen, toggleDialog, openDialog, closeDialog}}>
            {children}
        </ModalContext.Provider>
    )
}

//2 - Modal dialog
interface ModalDialogProps {
    role?:'dialog' | 'alertdialog';
    customClass?:string;
    position?: 'absolute' | 'fixed';
    hasBackdrop?:boolean;
    children?: ReactNode;
}
function ModalDialog({customClass='', role='dialog', position='fixed', hasBackdrop=true, children, ...props}: ModalDialogProps) {
    const modalContext = useContext(ModalContext);
    if(!modalContext) {
        throw new Error('ModalDialog should be used within a Modal component');
    }
    const {modalId, isOpen, closeDialog} = modalContext;

    const dialogRef = useRef<HTMLDialogElement>(null);

    //dialog ui methods - start
    //useeffect for open/close
    useEffect(()=>{
        if(isOpen) {
            dialogRef.current?.showModal();
            document.body.style.setProperty('overflow', 'hidden');
            setFocusToFirstItem(dialogRef.current as HTMLElement);
        }
        else {
            dialogRef.current?.close();
            document.body.style.removeProperty('overflow');
        }
    }, [isOpen])

    // useEffect for keyboardEvents
    useEffect(()=>{
        const dialog = (dialogRef.current as HTMLDialogElement);
        //Close dialog on escape, trap tab key
        function handleKeyDown(e:KeyboardEvent) { // role !== alertdialog
            if(e.key === 'Escape') closeDialog();
            if(e.key === 'Tab') {
                trapTabKey(dialogRef.current as HTMLElement, e);
            }
        }
        //Close dialog on backdrop click
        function handlePointerDown(event:PointerEvent) {
            if ( event.target === dialog ) closeDialog();
        }

        dialog.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('keydown', handleKeyDown);

        return ()=>{
            dialog.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [closeDialog])
    //dialog ui methods - end

    return (
        <dialog ref={dialogRef} id={modalId} role={role}  className={`c-modal__wrap${customClass ? ` ${customClass}` : ''}`} data-position={position}
                data-hasbackdrop={hasBackdrop}
                aria-labelledby={modalId + '-title'} {...props}>
            <div className='c-modal__container'>
                {
                    children ? children
                    :
                    <>
                        <section className='c-modal__header'>
                            <button type='button' className='c-modal__header-close' aria-label='Close' onClick={closeDialog}>Close</button>
                            <h2 className='c-modal__header-title' id={modalId + '-title'}>Dialog title</h2>
                        </section>
                        <section className='c-modal__body'>
                            Sample content
                        </section>
                        <section className='c-modal__footer'>
                            Sample footer
                        </section>
                    </>
                }
            </div>
        </dialog>
    )
}

//3- Control
function ModalControl({children}:{children:ReactNode}) {
    const modalContext = useModalContext();
    if (!modalContext) {
        throw new Error('ModalControl must be used within a Modal component');
    }
    const { modalId, isOpen, openDialog } = modalContext;

    return (
        Children.map(children, (child)=>{
            if(isValidElement(child)) {
                return cloneElement(child as ReactElement, {
                    "aria-controls": modalId,
                    "aria-expanded": isOpen,
                    "onClick": openDialog
                })
            }
           return child;
        })
    )
}
//3.1 - Control - sample
// function ModalContrxl() {
//     const modalContext = useContext(ModalContext);
//     if (!modalContext) {
//         throw new Error('ModalControl must be used within a Modal component');
//     }
//     const { modalId, isOpen, openDialog } = modalContext;

//     return (
//         <Button type='button' aria-controls={modalId} aria-expanded={isOpen} onClick={openDialog}>Open Modal</Button>
//     )
// }

// 4- Assignments
Modal.Dialog = ModalDialog;
Modal.Control = ModalControl;
Modal.displayName = "Modal";
ModalDialog.displayName = "Modal.Dialog";
ModalControl.displayName = "Modal.Control";

// 5 - Exports
export {
    Modal
}
export type {
    ModalProps,
    ModalDialogProps
}