describe("Dialog component", function() {
    var dialog = document.createElement('b-dialog');
    document.body.appendChild(dialog);

    it('should stay hidden when created', function() {
        expect(dialog.hasAttribute('visible')).to.be.false;
    });

    it('should show up when requested', function() {
        dialog.show();
        expect(dialog.hasAttribute('visible')).to.be.true;
    });
});