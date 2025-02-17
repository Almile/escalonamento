document.addEventListener('DOMContentLoaded', (event) => {
    const tabela = document.getElementById('tabela');
    const areaDeCriacaoEquacao = document.getElementById("resolucaoEquacoes");

    function clearPreviousCalculations() {
        const tabelas = document.querySelectorAll('#novasTabelas');
        tabelas.forEach(tabela => {
            tabela.innerHTML = '';
        });
        areaDeCriacaoEquacao.innerHTML = '';
    }

    function toggleMatrixDisplay(show) {
        const matriz = document.getElementById("matriz");
        matriz.style.display = show ? "table" : "none";
    }

    function inserirLinha() {
        const novaLinha = tabela.insertRow();
        const colunas = tabela.rows[0].cells.length;

        for (let i = 0; i < colunas; i++) {
            const novaCelula = novaLinha.insertCell();
            novaCelula.contentEditable = "true";
        }
        for (var i = 0; i < tabela.rows.length; i++) {
            var novaCelula = tabela.rows[i].insertCell();
            novaCelula.contentEditable = "true";
        }
    

        clearPreviousCalculations();
        toggleMatrixDisplay(false);
    }

    function removerLinha() {
        var tabela = document.getElementById('tabela');
        var linhas = tabela.rows.length;
        var colunas = tabela.rows[0].cells.length;
    
        // Remover a última linha se houver mais de uma linha
        if (linhas > 2) {
            tabela.deleteRow(linhas - 1);
        }
    
        // Remover a última coluna se houver mais de uma coluna
        if (colunas > 3) {
            // Atualiza o número de linhas depois de remover a última linha
            linhas = tabela.rows.length;
            for (var i = 0; i < linhas; i++) {
                tabela.rows[i].deleteCell(colunas - 1);
            }
        }

        clearPreviousCalculations();
        toggleMatrixDisplay(false);
    }

    function limparCalculoAnterior() {
        clearPreviousCalculations();
        toggleMatrixDisplay(false);
        calcular();
    }

    function extractLetters(str) {
        return str.replace(/[^a-zA-Z]/g, '');
    }

    function highlightElements(pivo, multiplicador) {
        pivo.setAttribute("id", "pivo");
        multiplicador.setAttribute("id", "circulo");
    }

    function calcular() {
        const linhas = tabela.getElementsByTagName("tr");
        const matriz = document.getElementById("matriz");
        matriz.innerHTML = "";
        toggleMatrixDisplay(true);
    
        // Preenche a matriz com os valores da tabela
        for (let i = 0; i < linhas.length; i++) {
            const celulas = linhas[i].getElementsByTagName("td");
            const novaLinha = matriz.insertRow();
    
            for (let j = 0; j < celulas.length; j++) {
                const valor = celulas[j].innerText.trim();
                let numero = valor.match(/-?\d+/) ? valor.match(/-?\d+/)[0] : "1";
                if (valor.startsWith("-")) {
                    numero = "-" + numero;
                }
                const letra = valor.match(/[a-zA-Z]/) ? valor.match(/[a-zA-Z]/)[0] : "";
                const novaCelula = novaLinha.insertCell();
                novaCelula.innerText = numero;
            }
        }
    
        let tabelaReferencia;
        for (let table = 0; table < linhas.length - 1; table++) {
            const novaTabela = document.createElement("table");
            novaTabela.id = "tabela" + table;
            document.getElementById("novasTabelas").appendChild(novaTabela);
    
            tabelaReferencia = table === 0 ? matriz : document.getElementById("tabela" + (table - 1));
            const line = tabelaReferencia.getElementsByTagName("tr");
    
            // Copiar as linhas de referência
            for (let linhasCopiadas = 0; linhasCopiadas <= table; linhasCopiadas++) {
                const newLine = novaTabela.insertRow();
                for (let i = 0; i < line[linhasCopiadas].cells.length; i++) {
                    const novaCelula = newLine.insertCell();
                    const texto = line[linhasCopiadas].cells[i].innerText;
                    novaCelula.innerText = texto;
                }
            }
    
            // Calcular as novas linhas após a operação
            for (let multiplyLine = table + 1; multiplyLine < line.length; multiplyLine++) {
                const pivo = parseFloat(tabelaReferencia.rows[table].cells[table].innerText.match(/-?\d+/)[0]);
                const multiplicador = parseFloat(tabelaReferencia.rows[multiplyLine].cells[table].innerText.match(/-?\d+/)[0]);
                highlightElements(tabelaReferencia.rows[table].cells[table], tabelaReferencia.rows[multiplyLine].cells[table]);
    
                const newLine = novaTabela.insertRow();
                for (let j = 0; j < line[multiplyLine].cells.length; j++) {
                    const linhaPivo = parseFloat(tabelaReferencia.rows[table].cells[j].innerText.match(/-?\d+/)[0]);
                    const linhaMultiplicador = parseFloat(tabelaReferencia.rows[multiplyLine].cells[j].innerText.match(/-?\d+/)[0]);
                    const resultado = (pivo * linhaMultiplicador) - (multiplicador * linhaPivo);
                    const celula = newLine.insertCell();
                    celula.innerText = resultado.toFixed(2);  // Ajuste de precisão
                }
            }
            tabelaReferencia = novaTabela;
        }
        renderEquations(tabelaReferencia);
    }
    
    function renderEquations(tabelaReferencia) {
        
        const linhas = tabelaReferencia.getElementsByTagName("tr");
        const areaDeCriacaoEquacao = document.getElementById("resolucaoEquacoes");
    
        areaDeCriacaoEquacao.innerHTML = ""; // Limpa equações anteriores
    
        const titulo = document.createElement("h2");
        titulo.innerText = "Equações";
        areaDeCriacaoEquacao.appendChild(titulo);
    
        let valoresEncontrados = {};
    
        // Processa as equações de baixo para cima
        for (let equacao = linhas.length - 1; equacao >= 0; equacao--) {
            const letra = Array.from(tabela.rows[equacao].cells).map(cell => extractLetters(cell.innerText));
            const coluna = linhas[equacao].cells.length;
            let divisor = parseFloat(linhas[equacao].cells[equacao].innerText);
            let ultimaColuna = parseFloat(linhas[equacao].cells[coluna - 1].innerText);
            let termos = [];
            let somaTermos = 0;
    
            // Monta a equação incluindo todas as variáveis
            for (let j = 0; j < coluna - 1; j++) {
                let coeficiente = parseFloat(linhas[equacao].cells[j].innerText);
                let variavel = `${letra[j]}`; // Exemplo: x1, x2, x3...
    
                if (j === equacao) {
                    termos.push(`${coeficiente} ${variavel}`);
                } else {
                    let valorEncontrado = valoresEncontrados[variavel] || 0;
                    somaTermos += coeficiente * valorEncontrado;
                    termos.push(`${coeficiente} * ${variavel}`);
                }
            }
    
            const expressao = termos.join(" + ") + ` = ${ultimaColuna}`;
            const resolucao = `(${ultimaColuna} - ${somaTermos}) / ${divisor}`;
            const resultado = (ultimaColuna - somaTermos) / divisor;
    
            valoresEncontrados[`${letra[equacao]}`] = resultado;
    
            // Criação dos elementos na interface
            const divEquacao = document.createElement("div");
            divEquacao.innerHTML = `
                <p style="color: var(--natural);">${expressao}</p>
                <p>${resolucao}</p>
                <p><strong>${letra[equacao]} = ${resultado.toFixed(2)}</strong></p>
            `;
            areaDeCriacaoEquacao.appendChild(divEquacao);
        }
    }
    
    
    
    function limparTodasTabelas() {
        window.location.reload();
    }

    window.inserirLinha = inserirLinha;
    window.removerLinha = removerLinha;
    window.limparCalculoAnterior = limparCalculoAnterior;
    window.limparTodasTabelas = limparTodasTabelas;
});
