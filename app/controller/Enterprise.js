import connection from '../database/Connection.js';

export default class Enterprise {

    static table = 'enterprise';

    // Colunas do DataTable
    static #columns = [
        'id',
        'razao_social',
        'nome_fantasia',
        'cnpj',
        'email',
        'telefone'
    ];

    // Campos pesquisáveis
    static #searchable = [
        'razao_social',
        'nome_fantasia',
        'cnpj',
        'email'
    ];

    // INSERT
    static async insert(data) {

        if (!data.razao_social || data.razao_social.trim() === '') {
            return { status: false, msg: 'Razão social é obrigatória', data: [] };
        }

        if (!data.cnpj || data.cnpj.trim() === '') {
            return { status: false, msg: 'CNPJ é obrigatório', data: [] };
        }

        try {
            const clean = Enterprise.#sanitize(data);

            const [result] = await connection(Enterprise.table)
                .insert(clean)
                .returning('*');

            return {
                status: true,
                msg: 'Empresa cadastrada com sucesso!',
                id: result.id,
                data: [result]
            };

        } catch (err) {

            // erro de CNPJ duplicado
            if (err.message.includes('unique')) {
                return { status: false, msg: 'CNPJ já cadastrado', data: [] };
            }

            return { status: false, msg: 'Erro: ' + err.message, data: [] };
        }
    }

    // FIND (DataTable)
    static async find(data = {}) {

        const {
            term = '',
            limit = 10,
            offset = 0,
            orderType = 'asc',
            column = 0,
            draw = 1
        } = data;

        const [{ count: total }] = await connection(Enterprise.table)
            .where({ excluido: false })
            .count('id as count');

        const search = term?.trim();

        function applySearch(query) {
            if (search) {
                query.where(function () {
                    for (const col of Enterprise.#searchable) {
                        this.orWhereRaw(`CAST("${col}" AS TEXT) ILIKE ?`, [`%${search}%`]);
                    }
                });
            }
            return query;
        }

        // filtrado
        const filteredQ = connection(Enterprise.table)
            .where({ excluido: false })
            .count('id as count');

        applySearch(filteredQ);
        const [{ count: filtered }] = await filteredQ;

        // dados
        const orderColumn = Enterprise.#columns[column] || 'id';
        const orderDir = orderType === 'desc' ? 'desc' : 'asc';

        const dataQ = connection(Enterprise.table)
            .where({ excluido: false })
            .select('*');

        applySearch(dataQ);

        dataQ.orderBy(orderColumn, orderDir);
        dataQ.limit(parseInt(limit));
        dataQ.offset(parseInt(offset));

        const rows = await dataQ;

        return {
            draw: parseInt(draw),
            recordsTotal: parseInt(total),
            recordsFiltered: parseInt(filtered),
            data: rows,
        };
    }

    // DELETE (soft delete)
    static async delete(id) {

        if (!id) {
            return { status: false, msg: 'ID é obrigatório' };
        }

        try {

            const updated = await connection(Enterprise.table)
                .where({ id })
                .update({ excluido: true });

            if (!updated) {
                return { status: false, msg: 'Empresa não encontrada' };
            }

            return { status: true, msg: 'Excluído com sucesso!' };

        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message };
        }
    }

    // UPDATE
    static async update(id, data) {

        if (!id) {
            return { status: false, msg: 'ID é obrigatório', data: [] };
        }

        if (!data.razao_social || data.razao_social.trim() === '') {
            return { status: false, msg: 'Razão social é obrigatória', data: [] };
        }

        try {
            const clean = Enterprise.#sanitize(data);

            delete clean.id;

            const [result] = await connection(Enterprise.table)
                .where({ id })
                .update({
                    ...clean,
                    atualizado_em: connection.fn.now()
                })
                .returning('*');

            if (!result) {
                return { status: false, msg: 'Empresa não encontrada', data: [] };
            }

            return {
                status: true,
                msg: 'Atualizado com sucesso!',
                id: result.id,
                data: [result]
            };

        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message, data: [] };
        }
    }

    // FIND BY ID
    static async findById(id) {

        if (!id) return null;

        const row = await connection(Enterprise.table)
            .where({ id, excluido: false })
            .first();

        return row || null;
    }

    // SANITIZE
    static #sanitize(data) {

        const ignore = ['id', 'action'];

        const clean = {};

        for (const [key, value] of Object.entries(data)) {

            if (ignore.includes(key)) continue;
            if (value === '' || value === null || value === undefined) continue;

            if (value === 'true') {
                clean[key] = true;
                continue;
            }

            if (value === 'false') {
                clean[key] = false;
                continue;
            }

            clean[key] = value;
        }

        return clean;
    }
}