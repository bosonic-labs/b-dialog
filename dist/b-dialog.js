(function() {
    

    Bosonic.registerElement(
        'b-dialog',
        {
    readyCallback: function () {
        var root = this.createShadowRoot();
        root.appendChild(this.template.content.cloneNode(true));
    },
    show: function () {
        this.setAttribute('visible', '');
    },
    showModal: function () {
        this.overlay = document.createElement('b-overlay');
        this.parentNode.appendChild(this.overlay);
        var that = this;
        document.addEventListener('keyup', function (e) {
            if (e.which === 27) {
                that.cancel();
            }
        }, false);
        this.show();
    },
    hide: function () {
        this.removeAttribute('visible');
        if (this.overlay) {
            this.parentNode.removeChild(this.overlay);
        }
        this.dispatchEvent(new CustomEvent('close'));
    },
    close: function () {
        this.hide();
    },
    open: function () {
        this.show();
    },
    cancel: function () {
        var doCancel = this.dispatchEvent(new CustomEvent('cancel', { cancelable: true }));
        if (doCancel) {
            this.hide();
        }
    },
    template: '        <div class="b-dialog">            <content></content>        </div>    '
}
    );
}());
(function() {
    

    Bosonic.registerElement(
        'b-overlay',
        {
    readyCallback: function () {
        this.appendChild(this.template.content.cloneNode(true));
    },
    template: '        <div class="b-overlay"></div>    '
}
    );
}());