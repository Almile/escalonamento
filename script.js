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

            for (let linhasCopiadas = 0; linhasCopiadas <= table; linhasCopiadas++) {
                const newLine = novaTabela.insertRow();
                for (let i = 0; i <= line.length; i++) {
                    const novaCelula = newLine.insertCell();
                    const texto = line[linhasCopiadas].cells[i].innerText;
                    novaCelula.innerText = texto;
                }
            }

            for (let multiplyLine = table + 1; multiplyLine < line.length; multiplyLine++) {
                const pivo = parseFloat(tabelaReferencia.rows[table].cells[table].innerText.match(/-?\d+/)[0]);
                const multiplicador = parseFloat(tabelaReferencia.rows[multiplyLine].cells[table].innerText.match(/-?\d+/)[0]);
                highlightElements(tabelaReferencia.rows[table].cells[table], tabelaReferencia.rows[multiplyLine].cells[table]);

                const newLine = novaTabela.insertRow();
                for (let j = 0; j <= line.length; j++) {
                    const linhaPivo = parseFloat(tabelaReferencia.rows[table].cells[j].innerText.match(/-?\d+/)[0]);
                    const linhaMultiplicador = parseFloat(tabelaReferencia.rows[multiplyLine].cells[j].innerText.match(/-?\d+/)[0]);
                    const resultado = (pivo * linhaMultiplicador) + (-multiplicador * linhaPivo);
                    const celula = newLine.insertCell();
                    celula.innerText = resultado;
                }
            }
        }

        renderEquations(tabelaReferencia);
    }

    function renderEquations(tabelaReferencia) {
        const linhas = tabelaReferencia.getElementsByTagName("tr");
        const areaDeCriacaoEquacao = document.getElementById("resolucaoEquacoes");

        const titulo = document.createElement("h2");
        titulo.innerText = "Equações";
        areaDeCriacaoEquacao.appendChild(titulo);

        let numeroLetra;
        for (let equacao = linhas.length - 1; equacao >= 0; equacao--) {
            const coluna = tabelaReferencia.rows[equacao].cells.length;
            const divEquacao = document.createElement("div");

            const paragrafo = document.createElement("p");
            paragrafo.id = "paragrafo" + equacao;
            paragrafo.style.color = "var(--natural)";

            const paragraf = document.createElement("p");
            paragraf.id = "paragraf" + equacao;

            const paragra = document.createElement("p");
            paragra.id = "paragra" + equacao;

            areaDeCriacaoEquacao.appendChild(divEquacao);
            divEquacao.appendChild(paragrafo);
            divEquacao.appendChild(paragraf);
            divEquacao.appendChild(paragra);

            const divisor = parseFloat(linhas[equacao].cells[equacao].innerText);
            const letters = Array.from(tabela.rows[equacao].cells).map(cell => extractLetters(cell.innerText));
            const texto = letters.map((letter, index) => {
                const value = linhas[equacao].cells[index].innerText;
                return index === letters.length - 1 ? `= ${value} ${letter}` : `${value} ${letter}`;
            }).join(" ");

            paragrafo.innerHTML = texto;

            const valores = Array.from({ length: coluna - 1 }, (_, index) => {
                return index !== equacao ? parseFloat(linhas[equacao].cells[index].innerText) : 0;
            }).filter(value => value !== 0);

            const ultimo = parseFloat(linhas[equacao].cells[coluna - 1].innerText);
            const sumValores = valores.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
            const equationResult = valores.length > 0 ? (ultimo - (sumValores * numeroLetra)) / divisor : ultimo / divisor;
            const montarConta = valores.length > 0 ? `${letters[equacao]} = (${ultimo}) - (${sumValores} * ${numeroLetra}) / ${divisor}` : `${letters[equacao]} = (${ultimo}) / ${divisor}`;

            numeroLetra = equationResult;
            paragraf.innerHTML = montarConta;
            paragra.innerHTML = `${letters[equacao]} = ${equationResult}`;
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
