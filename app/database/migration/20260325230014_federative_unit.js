export function up(knex) {
    return knex.schema.createTable('federative_unit', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('sigla').notNullable();

        table.bigInteger('country_id').unsigned().notNullable()
            .references('id').inTable('country');

        table.unique(['sigla', 'country_id']);

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
    return knex.schema.dropTable('federative_unit');
}