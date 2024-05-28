var tabela = document.getElementById('tabela');

function inserirLinha(){
    var novaLinha = tabela.insertRow();
    var colunas = tabela.rows[0].cells.length;

    if(colunas < 5)
    {
        for (var i = 0; i < colunas; i++) {
            var novaCelula = novaLinha.insertCell();
            novaCelula.contentEditable = "true"; 
        }
        for (var i = 0; i < tabela.rows.length; i++) {
            var novaCelula = tabela.rows[i].insertCell();
            novaCelula.contentEditable = "true";
        }
    }
}

function removerLinha() {
    var linhas = tabela.rows.length;
    var colunas = tabela.rows[0].cells.length;

    if (linhas > 2) {
        tabela.deleteRow(linhas - 1);
    }

    if (colunas > 3) {
        for (var i = 0; i < linhas; i++) {
            tabela.rows[i].deleteCell(colunas - 1);
        }
    }
}

function calcular(){
    var linhas = tabela.getElementsByTagName("tr");
    var matriz = document.getElementById("matriz");
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
    
    var matriz = document.getElementById("matriz");


    var line = matriz.getElementsByTagName("tr");
    var primeiraLinha = line[0]; 
    var somaTabelas = document.getElementById("somaTabelas");
    somaTabelas.innerHTML = "";
    
    var novaLinha = somaTabelas.insertRow();
    
    for (var i = 0; i < primeiraLinha.cells.length; i++) {
        var novaCelula = novaLinha.insertCell();
        novaCelula.innerText = primeiraLinha.cells[i].innerText;
    }
    
    for (let i = 1; i <= line.length - 1; i++) {
        let pivo = parseFloat(matriz.rows[0].cells[0].innerText.match(/-?\d+/)[0]);
        let multiplicador = parseFloat(matriz.rows[i].cells[0].innerText.match(/-?\d+/)[0]);
    
        let linha = somaTabelas.insertRow();
    
        for (let j = 0; j < primeiraLinha.cells.length; j++) {
            let linhaPivo = parseFloat(matriz.rows[0].cells[j].innerText.match(/-?\d+/)[0]);
            let linhaMultiplicador = parseFloat(matriz.rows[i].cells[j].innerText.match(/-?\d+/)[0]);
    
            let resultado = (pivo * linhaMultiplicador) + (-multiplicador * linhaPivo);
    
            let celula = linha.insertCell();
            celula.innerText = resultado;
        }
    }


    // zerar segunda coluna
    var somaTabelas = document.getElementById("extraTable");

    var matriz = document.getElementById("somaTabelas");
    somaTabelas.innerHTML = "";
    var line = matriz.getElementsByTagName("tr");
    var primeiraLinha = line[0]; 
    var segundaLinha = line[1]; 
    
    var novaLinha = somaTabelas.insertRow();
    
    for (var i = 0; i < primeiraLinha.cells.length; i++) {
        var novaCelula = novaLinha.insertCell();
        novaCelula.innerText = primeiraLinha.cells[i].innerText;
    }

    var novaLinha = somaTabelas.insertRow();
    
    for (var i = 0; i < segundaLinha.cells.length; i++) {
        var novaCelula = novaLinha.insertCell();
        novaCelula.innerText = segundaLinha.cells[i].innerText;
    }
    
    
    for (let i = 2; i <= line.length; i++) {
        let pivo = parseFloat(matriz.rows[1].cells[1].innerText.match(/-?\d+/)[0]);
        let multiplicador = parseFloat(matriz.rows[i].cells[1].innerText.match(/-?\d+/)[0]);
    
        let linha = somaTabelas.insertRow();
    
        for (let j = 0; j < primeiraLinha.cells.length; j++) {
            let linhaPivo = parseFloat(matriz.rows[1].cells[j].innerText.match(/-?\d+/)[0]);
            let linhaMultiplicador = parseFloat(matriz.rows[i].cells[j].innerText.match(/-?\d+/)[0]);
    
            let resultado = (pivo * linhaMultiplicador) + (-multiplicador * linhaPivo);
    
            let celula = linha.insertCell();
            celula.innerText = resultado;
        } 
    } 
}
   
