export function up(knex) {
    return knex.schema.createTable('product', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('descricao');
        table.decimal('preco_compra', 10, 2).notNullable();
        table.decimal('preco_venda').defaultTo(0);
        table.text('unidade', 10).notNullable();
        table.text('codigo_barras', 50).unique();
       

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
    return knex.schema.dropTable('product');
}