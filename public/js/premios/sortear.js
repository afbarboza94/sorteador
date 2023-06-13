{
    function init() {
        console.clear();

        const form = document.querySelector(".modal form#formSortear");
        form.submitModal({
            success: (response) => {
                // console.log(response);
                // window.location.reload();
                tableElement.JSTable.update();
                setTimeout(() => {
                    modalElement.loadModal();
                }, 1100);
            },
            hideModal: false,
        });
    }

    setTimeout(() => init(), 250);
}