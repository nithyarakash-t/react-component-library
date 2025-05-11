import { createContext, useContext } from "react";

// context
export interface FlyoutContextProps {
    flyoutId:string;
    isOpen:boolean;
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
    openFlyout:()=>void;
    closeFlyout:()=>void;
    toggleFlyout:()=>void;
}
export const FlyoutContext = createContext<FlyoutContextProps | undefined>(undefined);

// cust. hook
export function useFlyoutContext() {
    const context = useContext(FlyoutContext);
    if(!context) {
        throw new Error('useFlyoutContext shouldnt be used outside of FlyoutContext')
    }
    return context;
}