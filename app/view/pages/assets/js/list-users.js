import { Datatables } from "../components/Datatables.js";

// Reload da tabela
api.users.onReload(() => {
    $('#table-users').DataTable().ajax.reload(null, false);
});

//  Inicializa a tabela
Datatables.SetTable('#table-users', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'email' },
    { data: 'senha' },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editUser(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteUser(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.users.find(filter));