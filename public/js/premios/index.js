const modalElement = document.getElementById('crud');

const tableElement = document.querySelector(`#tablePremios`),
    tablePessoasElement = document.querySelector(`#tablePessoas`);

window.addEventListener('load', function () {
    tableElement.serverProcessing({
        ajax: `/premios/serverprocessing`,
        ajaxParams: { sorteio: tableElement.getAttribute('data-id') },
        columns: [{
            select: 0,
            sortable: true,
            sort: "desc",
            render: (cell, idx) => `<div class="text-center">${cell.textContent}</div>`,
        },
        {
            select: 2,
            render: (cell, idx) => `<div class="text-end">${cell.innerHTML}</div>`
        },
        {
            select: 3,
            render: /**
            * @param {Element} cell
            */(cell, idx) => {
                    const sorteadosArray = cell.innerHTML.split(',');
                    return `<div div-sorteados>` +
                        `<span class="text-truncate" style="width: 200px">${(sorteadosArray[0] ?? '')}</span>&nbsp;` +
                        (sorteadosArray.length > 1 ? `<span class="badge bg-secondary" style="cursor: pointer" onclick="showModalSortear(${cell.nextSibling.innerHTML});">+${sorteadosArray.length - 1}</span>` : '') +
                        `</div>`;
                }
        },
        {
            select: 4,
            sortable: false,
            searchable: false,
            render: /**
            * @param {Element} cell
            */
                function (cell, idx) {
                    return `<div class="text-center"><a style="cursor: pointer" class="btn btn-${(cell.previousSibling.innerHTML.length) > 0 ? 'success' : 'secondary'}" onclick="showModalSortear(${cell.innerHTML});">Sortear</a></div>`;
                }
        },
        {
            select: 5,
            sortable: false,
            searchable: false,
            render: function (cell, idx) {
                return `<div class="text-center"><a style="cursor: pointer" onclick="showModal(null,${cell.innerHTML});"><i class="fas fa-pencil"></i></a></div>`;
            }
        },
        {
            select: 6,
            sortable: false,
            searchable: false,
            render: function (cell, idx) {
                return `<div class="text-center"><a style="cursor: pointer" onclick="deleteRow(${cell.innerHTML})"><i class="fas fa-trash"></i></a></div>`;
            }
        }]
    });

    tablePessoasElement.serverProcessing({
        ajax: `/listassorteios/serverprocessing`,
        ajaxParams: { sorteio: tablePessoasElement.getAttribute('data-id') },
        perPage: 500,
        perPageSelect: [5, 10, 15, 20, 25, 500],
        labels: {
            placeholder: "Procure...",
            perPage: "{select}",
            noRows: "Nenhum registro encontrado",
            info: "Exibindo {start} até {end} de {rows} registro(s)",
            loading: "Processando...",
            infoFiltered: "Exibindo {start} até {end} de {rows} registro(s) (filtrado de {rowsTotal} registros)"
        },
    });
});

function showModalSortear(id) {
    modalElement.loadModal(`/listassorteios/sortear?id=${id}`);
}

function showModal(sorteio, id) {
    if (id) {
        modalElement.loadModal(`/premios/createupdate?id=${id}`);
    } else {
        modalElement.loadModal(`/premios/createupdate?sorteio=${sorteio}`);
    }
}

function deleteRow(id) {
    deleteById('/premios/delete', { id }, () => tableElement.JSTable.update());
}