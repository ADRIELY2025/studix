import { BrowserWindow } from 'electron'
import path from 'path'
import fs from 'fs'
import os from 'os'

export class Print {
    #html = null
    #opcoes = {
        marginsType: 0,
        pageSize: 'A4',
        printBackground: true,
        landscape: false
    }
    //  Factory — ponto de entrada da interface fluente
    static create() {
        return new Print();
    }
    //  Define o conteúdo HTML a ser impresso
    stringHTML(html) {
        this.#html = html;
        return this;
    }
    //Abre o PDF para exibição ou impressão
    async print() {
        if (!this.#html) {
            throw new Error('HTML não definido.');
        }

        // 🪟 2. Cria uma janela invisível do Electron
        // Essa janela é necessária porque o Electron só consegue gerar PDF a partir de uma página renderizada
        const win = new BrowserWindow({
            show: false, // não mostra na tela
            webPreferences: {
                sandbox: false // evita restrições que podem quebrar o carregamento
            }
        });

        // 🌐 3. Carrega o HTML na janela
        // Usa uma URL especial "data:" para injetar HTML direto (sem arquivo físico)
        await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(this.#html)}`);

        // ⏳ 4. Espera o HTML terminar de carregar
        // Sem isso, o PDF pode sair em branco ou incompleto
        await new Promise(resolve => {
            win.webContents.on('did-finish-load', resolve);
        });

        // 📄 5. Gera o PDF
        // Aqui o Electron "tira uma foto" da página e transforma em PDF
        const pdfBuffer = await win.webContents.printToPDF(this.#opcoes);

        // 📁 6. Define onde salvar o arquivo
        const filePath = this.#filePath ||
            path.join(os.tmpdir(), `print-${Date.now()}.pdf`);

        // 💾 7. Salva o PDF no disco
        fs.writeFileSync(filePath, pdfBuffer);

        // 🚀 8. Abre o PDF no leitor padrão do sistema
        const { shell } = require('electron');
        await shell.openPath(filePath);

        // ❌ 9. Fecha a janela invisível (boa prática)
        win.close();

        // 🔁 10. Retorna o caminho do arquivo gerado
        return filePath;
    }

}

