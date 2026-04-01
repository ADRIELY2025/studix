import { Datatables } from "../components/Datatables.js";

// 🔄 Reload da tabela
api.enterprise.onReload(() => {
    $('#table-enterprises').DataTable().ajax.reload(null, false);
});

// 📊 Inicializa a tabela
Datatables.SetTable('#table-enterprises', [
    { data: 'id' },
    { data: 'razao_social' },
    { data: 'nome_fantasia' },
    { data: 'cnpj' },
    { data: 'email' },
    {
        data: 'ativo',
        render: function (data) {
            return data
                ? '<span class="badge bg-success">Ativo</span>'
                : '<span class="badge bg-danger">Inativo</span>';
        }
    },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editEnterprise(${row.id})" class="btn btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteEnterprise(${row.id})" class="btn btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.enterprise.find(filter));


// 🗑️ DELETE
async function deleteEnterprise(id) {

    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {

        const response = await api.enterprise.delete(id);

        if (response.status) {
            toast('success', 'Excluído', response.msg);
            $('#table-enterprises').DataTable().ajax.reload();
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}


// ✏️ EDIT
async function editEnterprise(id) {
    try {

        const enterprise = await api.enterprise.findById(id);

        if (!enterprise) {
            toast('error', 'Erro', 'Empresa não encontrada.');
            return;
        }

        await api.temp.set('enterprise:edit', {
            action: 'e',
            ...enterprise,
        });

        api.window.openModal('pages/enterprise', {
            width: 700,
            height: 550,
            title: 'Editar Empresa',
        });

    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}


// 🌐 Disponível no HTML
window.deleteEnterprise = deleteEnterprise;
window.editEnterprise = editEnterprise;