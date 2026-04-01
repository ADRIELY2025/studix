export function up(knex) {
    return knex.schema.createTable('supplier', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome_fantasia').notNullable();
        table.text('sobrenome_razao');
        table.text('cpf_cnpj');
        table.text('rg_ie');
        table.boolean('ativo').defaultTo(true);
        table.boolean('excluido').defaultTo(false);
        
         table.timestamp('criado_em', { useTZ: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');

        table.timestamp('atualizado_em' , { useTZ: false})
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
    
    });
}

export function down(knex) {
    return knex.schema.dropTable('supplier');
}

       