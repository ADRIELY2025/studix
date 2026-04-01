const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action');
const Id = document.getElementById('id');
const form = document.getElementById('form');

InsertButton.addEventListener('click', async () => {

    try {
        InsertButton.disabled = true;

        const data = formToJson(form);
        let id = Action.value !== 'c' ? Id.value : null;

        // ✔ valida email
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValido.test(data.email)) {
            toast('error', 'Erro', 'Email inválido');
            return;
        }

        // ✔ normaliza email
        data.email = data.email.toLowerCase().trim();
        if (!data.senha) delete data.senha;

        // ✔ evita sobrescrever senha vazia no update
        if (!data.senha) delete data.senha;

        const response = Action.value === 'c'
            ? await api.users.insert(data)
            : await api.users.update(id, data);

        if (!response.status) {
            toast('error', 'Erro', response.msg);
            return;
        }

        toast('success', 'Sucesso', response.msg);
        api.window.close();

    } catch (err) {
        toast('error', 'Falha', err.message);
    } finally {
        InsertButton.disabled = false;
    }
});