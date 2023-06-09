{
    function init() {
        console.clear();

        flatpickr('[name="data"]', {
            dateFormat: 'd/m/Y',
            allowInput: true,
        });

        Inputmask({ mask: '99/99/9999' })
            .mask('[name="data"]');

        const dataValue = document.getElementById('data').value;
        if (!dataValue) {
            document.getElementById('data').value = moment().format('DD/MM/YYYY');
        }

        document.getElementById('nome').focus();

        const form = document.querySelector(".modal form#formSorteador");
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