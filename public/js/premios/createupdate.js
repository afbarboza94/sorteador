{
    function init() {
        console.clear();

        document.querySelector('[name="quantidade"]')
            .mask('99.999.999.999', {
                autoUnmask: true,
                removeMaskOnSubmit: true,
                numericInput: true,
            });

        document.getElementById('nome').focus();

        const form = document.querySelector(".modal form#formPremio");
        form.submitModal({
            success: (response) => {
                // console.log(response);
                // window.location.reload();
                tableElement.JSTable.update();
            }
        });
    }

    setTimeout(() => init(), 250);
}