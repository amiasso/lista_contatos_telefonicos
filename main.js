const KEY_BD ='@usuariosestudo';


var listaRegistro = {
    ultimoIdGerado:0,
    usuario:[]
}

function gravaBd(){
    localStorage.setItem(KEY_BD,JSON.stringify(listaRegistro) )
}

var FILTRO = '';

function lerBd(){
    const data =localStorage.getItem(KEY_BD)
    if(data){
        listaRegistro = JSON.parse(data)
    }
    desenhar()
}

function pesquisar(value){
    FILTRO =value;
    desenhar()
}

function desenhar(){
    const tbody = document.getElementById('listaRegistroBody')
    if(tbody){
        var data = listaRegistro.usuario;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter(usuario => {
                return expReg.test(usuario.nome) || expReg.test(usuario.fone)
            })
        }
        data = data
            .sort((a, b) =>{
                return a.nome < b.nome ? -1 : 1
            })
            
            .map(usuario => {
                return`<tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.fone}</td>
                        <td>
                    <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                    <button class='vermelho' onclick='perguntaSeDeleta(${usuario.id})'>Deletar</button>
                    </td>
                    </tr>`
            })
            tbody.innerHTML = data.join('')
        }
}

function insertUsuario(nome, fone){
    const id = listaRegistro.ultimoIdGerado + 1;
    listaRegistro.ultimoIdGerado = id ;
    listaRegistro.usuario.push({
        id, nome,fone
    })
    gravaBd()
    desenhar()
    vizualizar('lista')
}

function editUsuario(id, nome, fone){
    var usuario = listaRegistro.usuario.find(usuario => usuario.id == id)
    usuario.nome = nome;
    usuario.fone = fone;
    gravaBd() 
    desenhar()
    vizualizar('lista')   
}

function deleteUsuario(id){
    listaRegistro.usuario = listaRegistro.usuario.filter(usuario =>{
        return usuario.id != id 
    })
    gravaBd()
    desenhar()
    
}

function perguntaSeDeleta(id){
    if(confirm('quer deletar o registro de id ' + id)){
        deleteUsuario(id) 

    }
}

function limpaEdicao(){
    document.getElementById('nome').value = ''
    document.getElementById('fone').value = ''
}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limpaEdicao()
        if(id){
            const usuario = listaRegistro.usuario.find( usuario => usuario.id == id)
            if(usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('nome').value = usuario.nome 
                document.getElementById('fone').value = usuario.fone
            }
        }
        document.getElementById('nome').focus()
    }
}

function submeter(e){
    e.preventDefault()
    const data ={
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        fone: document.getElementById('fone').value,
    }
    if(data.id){
        editUsuario(data.id,data.nome,data.fone)
    }else if (insertUsuario(data.nome, data.fone)){
        alert('usuario inserido')
    }else{
        deleteUsuario(data.id,data.nome,data.fone)
    }
}

window.addEventListener('load',() =>{
    lerBd()
    desenhar()
    document.getElementById('cadastroRegistro').addEventListener('submit',submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})