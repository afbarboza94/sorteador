window.addEventListener('DOMContentLoaded', event => {
    flatpickr('[name="data"]', {
        dateFormat: 'd/m/Y',
        allowInput: true,
    });

    Inputmask({ mask: '99/99/9999' })
        .mask('[name="data"]');
});