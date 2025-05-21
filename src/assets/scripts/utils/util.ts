export const setFocusToFirstItem = (element:HTMLElement | Document = document) => {
  const focusableChildren = getFocusableChildren(element);
  const focused = element.querySelector('[autofocus]') || focusableChildren[0];

  if(focused) {
    (focused as HTMLElement).focus();
  }
}

export const getKeyboardFocusableElements = (element:HTMLElement | Document = document):HTMLElement[] => {
  return [...(element).querySelectorAll(
    'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
  )]
    .filter(el => !el.hasAttribute('disabled'))
    .filter(el => el.getAttribute('aria-disabled') !== 'true') as HTMLElement[];
}

export const getFocusableChildren = (element:HTMLElement | Document = document) => {
  const focusableSelectors = getKeyboardFocusableElements(element);
  return focusableSelectors.filter((child:HTMLElement) => !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length));
}

export const trapTabKey = (node:HTMLElement, event:KeyboardEvent) => {
    const focusableChildren = getFocusableChildren(node);
    const focusedItemIndex = focusableChildren.indexOf(document.activeElement as HTMLElement);
    
    // If the SHIFT key is being pressed while tabbing (moving backwards) and
    // the currently focused item is the first one, move the focus to the last
    // focusable item from the dialog element
    if ((event.shiftKey) && focusedItemIndex === 0) {
    focusableChildren[focusableChildren.length - 1].focus();
    event.preventDefault();
    // If the SHIFT key is not being pressed (moving forwards) and the currently
    // focused item is the last one, move the focus to the first focusable item
    // from the dialog element
    } else if ( (!event.shiftKey) && (focusedItemIndex === focusableChildren.length - 1)) {
    focusableChildren[0].focus();
    event.preventDefault();
    }
}