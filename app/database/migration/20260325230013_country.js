export function up(knex) {
    return knex.schema.createTable('country', (table) => {
        table.bigIncrements('id').primary();
        table.text('codigo').notNullable().unique();
        table.text('nome').notNullable();
        table.text('regiao');
        table.text('subRegiao');
        table.text('localizacao');
        table.text('lingua');
        table.text('moeda');
        
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
    return knex.schema.dropTable('country');
}