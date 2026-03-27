export function up(knex) {
    return knex.schema.createTable('federative_unit', (table) => {
        table.comment('tabela com os dados de estado do Brasil');
        table.bigIncrements('id').primary();
        table.bigInteger('id_pais');
        table.text('nome').notNullable();
        table.text('codigo').notNullable();
        table.text('sigla').notNullable();
       //Data e hora de criação do registro - preenchida automaticamente;
        table.timestamp('criado_em', { useTZ: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        //Data e hora da ultima atualização - atualizada automaticamente;
        table.timestamp('atualizado_em' , { useTZ: false})
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');

        table
            .foreign('id_pais')   // coluna local
            .references('id')     // coluna referenciada
            .inTable('country')   // tabela referenciada
            .onDelete('CASCADE')  // ao deletar o país, deleta os estados
            .onUpdate('NO ACTION'); // ao atualiazar o país, não faz nada
    });
}

export function down(knex) {
    return knex.schema.dropTable('federative_unit');
}