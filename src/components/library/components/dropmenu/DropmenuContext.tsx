import { createContext, useContext, RefObject, MutableRefObject } from "react";

export interface DropmenuContextType {
    dropmenuId:string,
    parentRef: RefObject<HTMLElement>,
    controlRef: RefObject<HTMLElement>,
    menuRef: RefObject<HTMLDivElement>,
    optionRefs: MutableRefObject<(HTMLElement | null)[]>,
    activeIndex:number | null,
    isOpen:boolean,
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>,
    openDropmenu:()=>void,
    closeDropmenu:(flag?:boolean)=>void,
    toggleDropmenu:()=>void
}
export const DropmenuContext = createContext<DropmenuContextType | undefined>(undefined);

export function useDropmenu() {
    const CONTEXT = useContext(DropmenuContext);
    if(!CONTEXT) {
        throw new Error("usedropmenu should be used within DropmenuContext");
    }

    return CONTEXT;
}