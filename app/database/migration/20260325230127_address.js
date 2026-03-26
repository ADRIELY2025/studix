export function up(knex) {
    return knex.schema.createTable('address', (table) => {
        table.bigIncrements('id').primary();
        table.text('logradouro').notNullable();
        table.text('numero');
        table.text('complemento');
        table.text('bairro');
        table.text('cep');

        table.bigInteger('city_id').unsigned().notNullable()
            .references('id').inTable('city');

        table.boolean('ativo').defaultTo(true);
        table.boolean('excluido').defaultTo(false);
        table.timestamps(true, true);
    });
}

export function down(knex) {
    return knex.schema.dropTable('address');
}