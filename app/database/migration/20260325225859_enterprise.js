export function up(knex) {
    return knex.schema.createTable('enterprise', (table) => {
        table.bigIncrements('id').primary();
        table.text('razao_social').notNullable();
        table.text('nome_fantasia').index();
        table.text('cnpj').unique();

        table.text('email');
        table.text('telefone');

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
    return knex.schema.dropTable('enterprise');
}