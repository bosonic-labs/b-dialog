(function () {
    var KEY = {
            ENTER: 13,
            ESC: 27,
            TAB: 9
        };
    var focusableElementsSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
    function getFocusableElements(container) {
        return container.querySelectorAll(focusableElementsSelector);
    }
    function getFirstFocusableElement(container) {
        return container.querySelector(focusableElementsSelector);
    }
    var BDialogPrototype = Object.create(HTMLElement.prototype, {
            createdCallback: {
                enumerable: true,
                value: function () {
                    this.tabIndex = -1;
                    this.setAttribute('role', 'dialog');
                    this.setAttribute('aria-hidden', 'true');
                    var root = this.createShadowRoot();
                    root.appendChild(this.template.content.cloneNode(true));
                }
            },
            show: {
                enumerable: true,
                value: function () {
                    this.setAttribute('visible', '');
                    this.setAttribute('aria-hidden', 'false');
                    this.keydownListener = this.onKeydown.bind(this);
                    document.addEventListener('keydown', this.keydownListener, false);
                    this.grabFocus();
                }
            },
            showModal: {
                enumerable: true,
                value: function () {
                    this.overlay = document.createElement('b-overlay');
                    this.parentNode.appendChild(this.overlay);
                    this.show();
                }
            },
            grabFocus: {
                enumerable: true,
                value: function () {
                    this.previouslyFocusedElement = document.querySelector(':focus');
                    var firstFocusableElement = getFirstFocusableElement(this);
                    if (firstFocusableElement) {
                        firstFocusableElement.focus();
                    } else {
                        this.focus();
                    }
                }
            },
            releaseFocus: {
                enumerable: true,
                value: function () {
                    if (this.previouslyFocusedElement) {
                        this.previouslyFocusedElement.focus();
                        this.previouslyFocusedElement = null;
                    }
                }
            },
            trapFocus: {
                enumerable: true,
                value: function (e) {
                    var focusableElements = getFocusableElements(this), currentlyFocused = this.querySelector(':focus'), currentlyFocusedIndex = Array.prototype.indexOf.call(focusableElements, currentlyFocused), lastFocusableElementIndex = focusableElements.length - 1;
                    if (e.shiftKey && currentlyFocusedIndex === 0) {
                        focusableElements.item(lastFocusableElementIndex).focus();
                        e.preventDefault();
                    } else if (!e.shiftKey && currentlyFocusedIndex === lastFocusableElementIndex) {
                        focusableElements.item(0).focus();
                        e.preventDefault();
                    }
                }
            },
            onKeydown: {
                enumerable: true,
                value: function (e) {
                    switch (e.which) {
                    case KEY.ESC: {
                            this.cancel();
                            break;
                        }
                    case KEY.TAB: {
                            this.trapFocus(e);
                            break;
                        }
                    default:
                        return;
                    }
                }
            },
            hide: {
                enumerable: true,
                value: function () {
                    this.releaseFocus();
                    this.removeAttribute('visible');
                    this.setAttribute('aria-hidden', 'true');
                    if (this.overlay) {
                        this.parentNode.removeChild(this.overlay);
                    }
                    document.removeEventListener('keydown', this.keydownListener, false);
                    this.dispatchEvent(new CustomEvent('b-close'));
                }
            },
            close: {
                enumerable: true,
                value: function () {
                    this.hide();
                }
            },
            open: {
                enumerable: true,
                value: function () {
                    this.show();
                }
            },
            cancel: {
                enumerable: true,
                value: function () {
                    var doCancel = this.dispatchEvent(new CustomEvent('b-cancel', { cancelable: true }));
                    if (doCancel) {
                        this.hide();
                    }
                }
            }
        });
    window.BDialog = document.registerElement('b-dialog', { prototype: BDialogPrototype });
    Object.defineProperty(BDialogPrototype, 'template', {
        get: function () {
            var fragment = document.createDocumentFragment();
            var div = fragment.appendChild(document.createElement('div'));
            div.innerHTML = ' <div class="b-dialog"> <content></content> </div> ';
            while (child = div.firstChild) {
                fragment.insertBefore(child, div);
            }
            fragment.removeChild(div);
            return { content: fragment };
        }
    });
}());
(function () {
    var BOverlayPrototype = Object.create(HTMLElement.prototype, {
            createdCallback: {
                enumerable: true,
                value: function () {
                    this.appendChild(this.template.content.cloneNode(true));
                }
            }
        });
    window.BOverlay = document.registerElement('b-overlay', { prototype: BOverlayPrototype });
    Object.defineProperty(BOverlayPrototype, 'template', {
        get: function () {
            var fragment = document.createDocumentFragment();
            var div = fragment.appendChild(document.createElement('div'));
            div.innerHTML = ' <div class="b-overlay"></div> ';
            while (child = div.firstChild) {
                fragment.insertBefore(child, div);
            }
            fragment.removeChild(div);
            return { content: fragment };
        }
    });
}());