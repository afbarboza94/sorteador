const modalElement = document.getElementById('crud');

const tableElement = document.querySelector(`#tableSorteios`);

window.addEventListener('load', function () {
    tableElement.serverProcessing({
        ajax: `/serverprocessing`,
        columns: [{
            select: 0,
            sortable: true,
            sort: "desc",
            render: (cell, idx) => `<div class="text-center">${cell.textContent}</div>`,
        },
        {
            select: 3,
            sortable: false,
            searchable: false,
            render: function (cell, idx) {
                return `<div class="text-center"><a href="/premios?sorteio=${cell.innerHTML}" class="btn btn-success btn-sm">Prêmios</i></a></div>`;
            }
        },
        {
            select: 4,
            sortable: false,
            searchable: false,
            render: function (cell, idx) {
                return `<div class="text-center"><a style="cursor: pointer" onclick="showModal(${cell.innerHTML});"><i class="fas fa-pencil"></i></a></div>`;
            }
        },
        {
            select: 5,
            sortable: false,
            searchable: false,
            render: function (cell, idx) {
                return `<div class="text-center"><a style="cursor: pointer" onclick="deleteRow(${cell.innerHTML})"><i class="fas fa-trash"></i></a></div>`;
            }
        }]
    });
});

function showModal(id) {
    const modalElement = document.getElementById('crud');

    if (id) {
        modalElement.loadModal(`/sorteios/createupdate?id=${id}`);
    } else {
        modalElement.loadModal(`/sorteios/createupdate`);
    }
}

function deleteRow(id) {
    deleteById('/sorteios/delete', { id }, () => tableElement.JSTable.update());
}