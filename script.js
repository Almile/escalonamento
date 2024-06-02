var tabela = document.getElementById('tabela');

function inserirLinha(){
    var novaLinha = tabela.insertRow();
    var colunas = tabela.rows[0].cells.length;

    for (var i = 0; i < colunas; i++) {
        var novaCelula = novaLinha.insertCell();
        novaCelula.contentEditable = "true"; 
    }
    for (var i = 0; i < tabela.rows.length; i++) {
        var novaCelula = tabela.rows[i].insertCell();
        novaCelula.contentEditable = "true";
    }

    const tabelas = document.querySelectorAll('#novasTabelas');
    const areaDeCriacaoEquacao = document.getElementById("resolucaoEquacoes");
    // Itera sobre cada tabela e limpa seu conteúdo
    tabelas.forEach(tabela => {
        tabela.innerHTML = '';
        areaDeCriacaoEquacao.innerHTML = '';
    });

    matriz.style.display = "none";
}

function removerLinha() {
    var tabela = document.getElementById('tabela');
    var linhas = tabela.rows.length;
    var colunas = tabela.rows[0].cells.length;

    // Remover a última linha se houver mais de uma linha
    if (linhas > 1) {
        tabela.deleteRow(linhas - 1);
    }

    // Remover a última coluna se houver mais de uma coluna
    if (colunas > 1) {
        // Atualiza o número de linhas depois de remover a última linha
        linhas = tabela.rows.length;
        for (var i = 0; i < linhas; i++) {
            tabela.rows[i].deleteCell(colunas - 1);
        }
    }
    const tabelas = document.querySelectorAll('#novasTabelas');
    const areaDeCriacaoEquacao = document.getElementById("resolucaoEquacoes");
    
    // Itera sobre cada tabela e limpa seu conteúdo
    tabelas.forEach(tabela => {
        tabela.innerHTML = '';
        areaDeCriacaoEquacao.innerHTML = '';

    });

    matriz.style.display = "none";
    
}


function calcular(){

    var linhas = tabela.getElementsByTagName("tr");
    var matriz = document.getElementById("matriz");
    matriz.style.display = "table";
    matriz.innerHTML = ""; 

    for (var i = 0; i < linhas.length; i++) {
        var celulas = linhas[i].getElementsByTagName("td");
        var novaLinha = matriz.insertRow();

        for (var j = 0; j < celulas.length; j++) {
            var valor = celulas[j].innerText.trim();
            var numero = valor.match(/-?\d+/); 
            var letra = valor.match(/[a-zA-Z]/); 
            if (numero === null) {
                numero = "1";
                if (valor.startsWith("-")) {
                    numero = "-" + numero;
                }
            } else {
                numero = numero[0];
            }
            if (letra === null) {
                letra = "";
            } else {
                letra = letra[0];
            }

            var novaCelula = novaLinha.insertCell();
            novaCelula.innerText = numero;
        }
    }   

    let tabelaReferencia;
    let tabelaReferenciaAnterior;  
    for (let table = 0; table < linhas.length - 1; table++) {
        const areaDeCriacaoTabelas = document.getElementById("novasTabelas");
        let tabela = document.createElement("table");
        let nomeTabela = "tabela" + table;           

        areaDeCriacaoTabelas.appendChild(tabela);
        tabela.setAttribute("id",nomeTabela);

        if (table === 0)
        {
            tabelaReferencia = matriz;
            tabelaReferenciaAnterior = matriz;
        }
        else
        {
           tabelaReferenciaAnterior = tabelaReferencia;
        }

        let line = tabelaReferencia.getElementsByTagName("tr");

            for (let linhasCopiadas = 0; linhasCopiadas <= table; linhasCopiadas++) {
                let newLine = tabela.insertRow();
                for (let i = 0; i <= line.length; i++) {
                    var novaCelula = newLine.insertCell();
                    let texto = line[linhasCopiadas].cells[i].innerText;
                    novaCelula.innerText = texto;
                }
            }

            for (let multiplyLine = table+1; multiplyLine < line.length; multiplyLine++) {
                let pivo = parseFloat(tabelaReferenciaAnterior.rows[table].cells[table].innerText.match(/-?\d+/)[0]);
                let pivoElemento = tabelaReferenciaAnterior.rows[table].cells[table]; // Elemento do DOM correspondente ao pivô
                let multiplicador = parseFloat(tabelaReferenciaAnterior.rows[multiplyLine].cells[table].innerText.match(/-?\d+/)[0]);
                let multiplicadorElemento = tabelaReferenciaAnterior.rows[multiplyLine].cells[table]; // Elemento do DOM correspondente ao multiplicador
                
                // Destaque o pivô e o multiplicador
                destacarElementos(pivoElemento, multiplicadorElemento);
                

                let newLine = tabela.insertRow();

                for (let j = 0; j <= line.length; j++) {
                    let linhaPivo = parseFloat(tabelaReferenciaAnterior.rows[table].cells[j].innerText.match(/-?\d+/)[0]);
                    let linhaMultiplicador = parseFloat(tabelaReferenciaAnterior.rows[multiplyLine].cells[j].innerText.match(/-?\d+/)[0]);
            
                    let resultado = (pivo * linhaMultiplicador) + (-multiplicador * linhaPivo);
            
                    let celula = newLine.insertCell();
                    celula.innerText = resultado;
                }
            }
        tabelaReferencia = document.getElementById(nomeTabela);
    }
    let line = tabelaReferencia.getElementsByTagName("tr");
    const areaDeCriacaoEquacao = document.getElementById("resolucaoEquacoes");
    let titulo = document.createElement("h2");
    titulo.innerText = "Equações"; // Set the text content separately
    areaDeCriacaoEquacao.appendChild(titulo); // Append the element to its parent
    
    let numeroLetra;

    for (let equacao = line.length - 1; equacao >= 0; equacao--) {
        var coluna = tabelaReferencia.rows[equacao].cells.length;


        let divEquacao = document.createElement("div");

        let paragrafo = document.createElement("p");
        let nomeParagrafo = "paragrafo" + equacao;
    
        areaDeCriacaoEquacao.appendChild(divEquacao);
        divEquacao.appendChild(paragrafo);

        paragrafo.setAttribute("id", nomeParagrafo);
        divEquacao.setAttribute("id", "divEquacao");

        let paragraf = document.createElement("p");
        let nomeParagraf = "paragraf" + equacao;
        paragrafo.style.color = "var(--butter)";
        divEquacao.appendChild(paragraf);
        paragraf.setAttribute("id", nomeParagraf);

        let paragra = document.createElement("p");
        let nomeParagra = "paragra" + equacao;
    
        divEquacao.appendChild(paragra);
        paragra.setAttribute("id", nomeParagra);
    
        // Solve the equation
        let divisor = parseFloat(line[equacao].cells[equacao].innerText);
        // Select the table
        const table = document.getElementById('tabela');
        // Select all rows of the table
        const row = table.getElementsByTagName('tr');
        // Select cells of the current row
        const cells = row[equacao].getElementsByTagName('td');
    
        // Initialize an array to store letters
        let letters = [];
    
        // Iterate over the cells of the current row
        for (let i = 0; i < cells.length; i++) {
            // Extract letters from each cell and add to the array
            letters.push(extractLetters(cells[i].innerText));
        }
    
        // Prepare the text to be set as the paragraph's content
        let texto = [];
        for (let index = 0; index < letters.length; index++) {

            if (index === letters.length - 1) {
                // Add "=" before the last element
                texto.push(`= ${line[equacao].cells[index].innerText} ${letters[index]}`);
            } else {
                if(line[equacao].cells[index].innerText != 0)
                {
                    texto.push(`${line[equacao].cells[index].innerText} ${letters[index]}`);
                }

            }
        }
    
        // Set the inner HTML of the paragraph to the constructed text
        document.getElementById(nomeParagrafo).innerHTML = texto.join(" ");
    
    
        let valores = [];
        for (let value = 0; value < coluna-1; value++) { // Iterate correctly up to coluna - 1
            if (value != equacao) {
            let valor = parseFloat(line[equacao].cells[value].innerText);       

                if (valor != 0) {
                    valores.push(valor);
                }

            }
        }

        let ultimo = parseFloat(line[equacao].cells[coluna - 1].innerText);

        let equationResult;
        let sumValores;
        let montarConta;
        if (valores.length > 0 ) {
            sumValores = valores.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
            equationResult = (ultimo - (sumValores*numeroLetra)) / divisor;
            montarConta = `${letters[equacao]} = (${ultimo}) - (${sumValores} * ${numeroLetra}) / ${divisor}`;
        } else {
            equationResult = ultimo / divisor;
            montarConta = `${letters[equacao]} = (${ultimo})/ ${divisor}`;
        }
        numeroLetra = equationResult;

        let result = `${letters[equacao]} = ${equationResult}`;

        alert(numeroLetra);
        document.getElementById(nomeParagraf).innerHTML = montarConta;

        document.getElementById(nomeParagra).innerHTML = result;

    }    
}

function limparTodasTabelas() {
    window.location.reload();
}

function extractLetters(str) {
    return str.replace(/[^a-zA-Z]/g, '');
}

function destacarElementos(pivo, multiplicador) {
    pivo.setAttribute("id", "pivo");
    multiplicador.setAttribute("id", "circulo");
}

