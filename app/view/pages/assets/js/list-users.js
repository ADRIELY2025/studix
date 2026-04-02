import { Datatables } from "../components/Datatables.js";

//  Reload da tabela quando houver atualização
api.users.onReload(() => {
    $('#table-users').DataTable().ajax.reload(null, false);
});

//Inicializa a tabela de usuários
Datatables.SetTable('#table-users', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'sobrenome' },
    { data: 'cpf_rg' },
    { data: 'email' },
    { data: 'senha' },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: (row) => `
            <div class="d-flex gap-1">
                <button onclick="editUser(${row.id})" class="btn btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="deleteUser(${row.id})" class="btn btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `
    }
]).getData(filter => api.users.find(filter));

//  DELETE de usuário
async function deleteUser(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
        const response = await api.users.delete(id);

        if (!response.status) {
            toast('error', 'Erro', response.msg);
            return;
        }

        toast('success', 'Excluído', response.msg);
        $('#table-users').DataTable().ajax.reload();

    } catch (err) {
        toast('error', 'Falha', err.message);
    }
}

// EDIT de usuário
async function editUser(id) {
    try {
        const user = await api.users.findById(id);

        if (!user) {
            toast('error', 'Erro', 'Usuário não encontrado.');
            return;
        }

        // Salva temporariamente para o modal de edição
        await api.temp.set('users:edit', {
            action: 'e',
            ...user,
        });

        // Abre modal de edição
        api.window.openModal('pages/users', {
            width: 600,
            height: 500,
            title: 'Editar Usuário',
        });

    } catch (err) {
        toast('error', 'Falha', err.message);
    }
}

//  Disponível globalmente para os botões da tabela
window.deleteUser = deleteUser;
window.editUser = editUser;