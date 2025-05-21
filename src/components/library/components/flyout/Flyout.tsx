import { Children, cloneElement, isValidElement, ReactElement, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { FlyoutContext, useFlyoutContext } from "./FlyoutContext";
import './Flyout.scss';
import { setFocusToFirstItem, trapTabKey } from '../../../../assets/scripts/utils/util';

//1 - Flyout comp. - wrapper - START
interface FlyoutProps {
    flyoutId:string;
    open?:boolean;
    children:ReactNode;
}
function Flyout({flyoutId='', open=false, children}:FlyoutProps) {

    const [isOpen, setIsOpen] = useState(open); //state to open/close

    // Flyout fns. - start
    function openFlyout() {
        setIsOpen(true);
    }
    function closeFlyout() {
        setIsOpen(false);
    }
    function toggleFlyout() {
        setIsOpen(!isOpen);
    }
    // Flyout fns. - end

    return (
        <FlyoutContext.Provider value={{flyoutId, isOpen, setIsOpen, openFlyout, closeFlyout, toggleFlyout}}>
            {children}
        </FlyoutContext.Provider>
    )
}

//2 - Flyout comp. - dialog - START
interface FlyoutDialogProps {
    role?:'dialog' | 'alertdialog';
    customClass?:string;
    position?: 'absolute' | 'fixed';
    hasBackdrop?:boolean;
    alignment?:'right' | 'left' | 'top' | 'bottom';
    children:ReactNode;
}
function FlyoutDialog({customClass='', role='dialog', position='fixed', alignment='right', hasBackdrop=true, children, ...props }:FlyoutDialogProps) {
    const flyoutContext = useContext(FlyoutContext);
    if(!flyoutContext) {
        throw new Error("Use flyoutdialog inside a Flyout component");
    }

    const flyoutRef = useRef<HTMLDialogElement>(null);
    const {isOpen, closeFlyout, flyoutId} = flyoutContext;

    //dialog ui methods - start
    //useeffect for open/close
    useEffect(()=>{
        if(isOpen) {
            flyoutRef.current?.showModal();
            document.body.style.setProperty('overflow', 'hidden');
            setFocusToFirstItem(flyoutRef.current as HTMLElement);
        }
        else {
            flyoutRef.current?.close();
            document.body.style.removeProperty('overflow');
        }
    }, [isOpen])

    // useEffect for keyboardEvents
    useEffect(()=>{
        const dialog = (flyoutRef.current as HTMLDialogElement);
        //Close dialog on escape, trap tab key
        function handleKeyDown(e:KeyboardEvent) { // role !== alertdialog
            if(e.key === 'Escape') closeFlyout();
            if(e.key === 'Tab') {
                trapTabKey(flyoutRef.current as HTMLElement, e);
            }
        }
        //Close dialog on backdrop click
        function handlePointerDown(event:PointerEvent) {
            if ( event.target === dialog ) closeFlyout();
        }

        dialog.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('keydown', handleKeyDown);

        return ()=>{
            dialog.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [closeFlyout])
        //dialog ui methods - end

    return (
        <dialog ref={flyoutRef} id={flyoutId} role={role}  className={`c-flyout__wrap${customClass ? ` ${customClass}` : ''}`} data-position={position}
                data-hasbackdrop={hasBackdrop} data-alignment={alignment}
                aria-labelledby={flyoutId + '-title'} {...props}>
            <div className='c-flyout__container'>
                {
                    children ? children
                    :
                    <>
                        <section className='c-flyout__header'>
                            <button type='button' className='c-flyout__header-close' aria-label='Close' onClick={closeFlyout}>Close</button>
                            <h2 className='c-flyout__header-title' id={flyoutId + '-title'}>Dialog title</h2>
                        </section>
                        <section className='c-flyout__body'>
                            Sample content
                        </section>
                        <section className='c-flyout__footer'>
                            Sample footer
                        </section>
                    </>
                }
            </div>
        </dialog>
    )
}

// 3 - Flyout contol
function FlyoutControl({children}:{children:ReactNode}) {
    const flyoutContext = useFlyoutContext();
    if (!flyoutContext) {
        throw new Error('FlyoutControl must be used within a Flyout component');
    }

   const { flyoutId, isOpen, openFlyout } = flyoutContext;

     return (
        Children.map(children, (child)=>{
            if(isValidElement(child)) {
                return cloneElement(child as ReactElement, {
                    "aria-controls": flyoutId,
                    "aria-expanded": isOpen,
                    "onClick": openFlyout
                })
            }
           return child;
        })
    )
}

// 4- Assignments
Flyout.Dialog = FlyoutDialog;
Flyout.Control = FlyoutControl;
Flyout.displayName = "Flyout";
FlyoutDialog.displayName = "Flyout.Dialog";
FlyoutControl.displayName = "Flyout.Control";

// 5 - Exports
export {
    Flyout
}
export type {
    FlyoutProps,
    FlyoutDialogProps
}