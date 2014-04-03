(function () {
    var BDialogPrototype = Object.create(HTMLElement.prototype, {
            createdCallback: {
                enumerable: true,
                value: function () {
                    var root = this.createShadowRoot();
                    root.appendChild(this.template.content.cloneNode(true));
                }
            },
            show: {
                enumerable: true,
                value: function () {
                    this.setAttribute('visible', '');
                    this.keyupListener = this.onKeyup.bind(this);
                    document.addEventListener('keyup', this.keyupListener, false);
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
            onKeyup: {
                enumerable: true,
                value: function (e) {
                    if (e.which === 27) {
                        this.cancel();
                    }
                }
            },
            hide: {
                enumerable: true,
                value: function () {
                    this.removeAttribute('visible');
                    if (this.overlay) {
                        this.parentNode.removeChild(this.overlay);
                    }
                    document.removeEventListener('keyup', this.keyupListener, false);
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