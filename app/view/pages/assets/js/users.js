const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action');
const Id = document.getElementById('id');
const form = document.getElementById('form');

// 📌 Máscaras
Inputmask({
mask: ['999.999.999-99', '99.999.999-9'],
}).mask('[name="cpf_rg"]');

//  CARREGA DADOS DE EDIÇÃO
(async () => {
    const editData = await api.temp.get('users:edit');

    if (editData) {
        Action.value = editData.action || 'e';
        Id.value = editData.id || '';

        for (const [key, value] of Object.entries(editData)) {
            const field = form.querySelector(`[name="${key}"]`);
            if (!field) continue;

            if (field.type === 'checkbox') {
                field.checked = value === true || value === 'true';
            } else {
                field.value = value || '';
            }
        }

    } else {
        Action.value = 'c';
        Id.value = '';
    }
})();

// SALVAR
InsertButton.addEventListener('click', async () => {

    let timer = 3000;
    $('#insert').prop('disabled', true);

    const data = formToJson(form);
    let id = Action.value !== 'c' ? Id.value : null;

    try {
        // validações básicas
        if (!data.nome) {
            toast('error', 'Erro', 'Nome é obrigatório', timer);
            return;
        }

        if (!data.email) {
            toast('error', 'Erro', 'Email é obrigatório', timer);
            return;
        }

        // normaliza email
        data.email = data.email.toLowerCase().trim();
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValido.test(data.email)) {
            toast('error', 'Erro', 'Email inválido', timer);
            return;
        }

        // limpa CPF/RG (remove máscara)
        if (data.cpf_rg) data.cpf_rg = data.cpf_rg.replace(/\D/g, '');

        // remove senha vazia
        if (!data.senha) delete data.senha;

        const response = Action.value === 'c'
            ? await api.users.insert(data)
            : await api.users.update(id, data);

        if (!response.status) {
            toast('error', 'Erro', response.msg, timer);
            return;
        }

        toast('success', 'Sucesso', response.msg, timer);
        form.reset();

        setTimeout(() => {
            api.window.close();
        }, timer);

    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message, timer);

    } finally {
        $('#insert').prop('disabled', false);
    }
});
