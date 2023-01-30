const url = 'http://localhost:3000';
const modal = document.querySelector('.modal-container')
const sDeleteModal = document.querySelector('.deleteModalContainer')
const tbody = document.querySelector('tbody')
const sNomeCar = document.querySelector('#m-nomeCar')
const sCodConc = document.querySelector('#m-codConcess')
const sValorCar = document.querySelector('#m-valorCar')
const sMarketPlace = document.querySelector('#marketPlace')
const sSite = document.querySelector('#site')
const sAnuncio = document.querySelector('#anuncio')
const formModal = document.querySelector('#formModal')

let itemIdGlobal = null
let dadosdaAPI
let itens
let id

function openModal() {

    modal.classList.add('active')

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active')
            itemIdGlobal = null
            console.log(itemIdGlobal)
        }
    }
}

function deleteModal() {
    sDeleteModal.classList.add('active')
    sDeleteModal.onclick = e => {
        if (e.target.className.indexOf('deleteModalContainer') !== -1) {
            sDeleteModal.classList.remove('active')
            itemIdGlobal = null
            window.location.reload()


        }
    }
}


function deleteConfirm(itemId) {
    if (itemIdGlobal !== itemId) {
        itemIdGlobal = itemId;
        deleteModal()
        const btnDelete = document.querySelector('#btnDelete')
        btnDelete.addEventListener('click', async () => {
            deleteItem(itemIdGlobal)
            window.location.reload()
        }
        );
    }
}

function modalUpdate(itemId) {
    openModal()
    modificaModalUpdate()
    const btnUpdate = document.querySelector('#btnUpdate')
    btnUpdate.addEventListener('click', () => {
        try {
            let codConc = document.querySelector('#m-codConcess').value
            let nomeCar = document.querySelector('#m-nomeCar').value
            let valorCar = parseInt(document.querySelector('#m-valorCar').value)
            let marketPlace = document.querySelector('#marketPlace').checked
            let site = document.querySelector('#site').checked
            let anuncio = document.querySelector('#anuncio').checked

            let dados = {
                codigoConcess: codConc,
                nomeCarro: nomeCar,
                valorCarro: valorCar,
                marketPlace: marketPlace,
                site: site,
                anuncio: anuncio,
            };

            updateItem(dados, itemId);
            window.location.reload()
        }
        catch (Error) {
            console.log(Error);
        }

    })
}

function modalCadastro() {
    openModal()
    modificaModalCadastro()
    const btnSalvar = document.querySelector('#btnSalvar')
    btnSalvar.addEventListener('click', async () => {
        try {
            let codConc = document.querySelector('#m-codConcess').value
            let nomeCar = document.querySelector('#m-nomeCar').value
            let valorCar = parseInt(document.querySelector('#m-valorCar').value)
            let marketPlace = document.querySelector('#marketPlace').checked
            let site = document.querySelector('#site').checked
            let anuncio = document.querySelector('#anuncio').checked

            let carro = {
                codigoConcess: codConc,
                nomeCarro: nomeCar,
                valorCarro: valorCar,
                marketPlace: marketPlace,
                site: site,
                anuncio: anuncio,
            };

            addNewItem(carro);
            window.location.reload()
        } catch (Error) {
            console.log(Error.response.data);
            console.log(Error.response.status);
            console.log(Error.response.headers);

        }
    })
}

function modificaModalCadastro() {
    retornaModalPadrao()
    const modalTitle = document.querySelector('#modalTitle')
    const modalButton = document.querySelector('.modalButton')
    modalTitle.innerHTML = 'Cadastrar um carro'
    modalButton.innerHTML = 'Salvar'
    modalButton.setAttribute('id', 'btnSalvar')
    modalButton.setAttribute('type', 'submit')
}

function modificaModalUpdate() {
    retornaModalPadrao()
    const modalTitle = document.querySelector('#modalTitle')
    const modalButton = document.querySelector('.modalButton')
    modalTitle.innerHTML = 'Atualizar um carro'
    modalButton.innerHTML = 'Atualizar'
    modalButton.setAttribute('id', 'btnUpdate')
    modalButton.setAttribute('type', 'submit')
}

function modificaModalDelete() {
    const modalTitle = document.querySelector('#modalTitle')
    const formModal = document.querySelector('#formModal')
    const modalButton = document.querySelector('.modalButton')
    const h4 = ('<h4>Tem Certeza?</h4>')
    formModal.innerHTML = ''
    modalTitle.innerHTML = h4
    modalButton.innerHTML = 'Deletar'
    modalButton.setAttribute('id', 'btnDelete')
    modalButton.setAttribute('type', 'button')
}

function modificaModalPesquisa() {
    const modalTitle = document.querySelector('#modalTitle')
    const modalButton = document.querySelector('.modalButton')
    modalTitle.innerHTML = 'Encontrar uma Concessionária'
    modalButton.innerHTML = 'Encontrar'
    modalButton.setAttribute('id', 'btnFind')
    modalButton.setAttribute('type', 'submit')
    formModal.innerHTML = (`<label for="m-codConcess">Código do Carro</label>
    <input id="m-codConcess" type="text" />`)
}

function modalPesquisa() {
    openModal()
    modificaModalPesquisa()
    let btnFind = document.querySelector('#btnFind')
    btnFind.addEventListener('click', async () => {
        try {
            let codConc = document.querySelector('#m-codConcess').value
            const dados = {
                codigoConcess: codConc
            }
            getOneItem(dados)
            modal.classList.remove('active')

        } catch (error) {
            console.log(error)
        }
    })
}

function retornaModalPadrao() {
    formModal.innerHTML = (`<label for="m-codConcess">Código do Carro</label>
    <input id="m-codConcess" type="text" />

    <label for="m-nomeCar">Nome do Carro</label>
    <input id="m-nomeCar" type="text" />

    <label for="m-valorCar">Valor do Carro</label>
    <input id="m-valorCar" type="number" />

    <div class="plataformaCheck">
      <div>
        <label for="marketPlace">MarketPlace</label>
        <input type="checkbox" id="marketPlace" class="plataformaInput" name="marketPlace" >
      </div>
      <div>
        <label for="site">Site</label>
        <input type="checkbox" id="site" class="plataformaInput" name="site" >
      </div>
      <div>
        <label for="anuncio">Anuncio</label>
        <input type="checkbox" id="anuncio" class="plataformaInput" name="anuncio">
      </div>
    </div>`)
}

//FUNCAO CRIA TABELA
function insertItem(item, itemId) {

    try {
        let tr = document.createElement('tr')

        tr.innerHTML = `    
            <td> ${item.codigoConcess} </td>
            <td> ${item.nomeCarro} </td>
            <td> ${item.valorCarro} </td>
            <td> ${item.marketPlace ? "Sim" : "Não"} </td>
            <td> ${item.site ? "Sim" : "Não"} </td>
            <td> ${item.anuncio ? "Sim" : "Não"} </td>
            <td class="acao">
            <button onclick = "modalUpdate(${itemId})"><i class="bx bx-edit"></i></button>
            </td>
            <td class="acao">
            <button onclick="deleteConfirm(${itemId})"><i class="bx bx-trash"></i></button>
            </td>`

        tbody.appendChild(tr)
    } catch (erro) {
        alert(erro)
    }
}


//FUNCAO CARREGA ITENS
function loadItens() {
    let data
    axios.get('http://localhost:3000/lista')
        .then((response) => {
            dadosdaAPI = response.data;
            data = response.data;
            index = -1
            tbody.innerHTML = ''
            for (let item of data) {
                let itemId
                index += 1
                itemId = (dadosdaAPI[index].id)
                insertItem(item, itemId)
            }

            return data
        })
        .catch((error) => {
            console.log(error);
        }
        )

}


//POST CADASTRO ITENS
const addNewItem = async (carro) => {

    axios.post(`${url}/cadastrar`, carro)
        .then(alert('Carro Cadastrado'))
        .catch(error => {
            alert('Não foi possível Cadastrar, Erro: ', error)
            if (error.response) {
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            }
        });

};

//PUT ATUALIZA ITENS
const updateItem = async (dados, itemId) => {
    axios
        .put(`${url}/atualizar/${itemId}`, dados)
        .then(() => {
            alert('Dados Atualizados');
        })
        .catch(error => {
            alert('Não foi possível atualizar, Erro: ', error)
            if (error.response) {
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            }
        });
}

//DELETE ITEM
const deleteItem = async (itemId) => {
    console.log('abc')
    axios
        .delete(`${url}/deletar/${itemId}`)
        .then(() => {
            alert('Dados Deletados');
        })
        .catch(error => {
            alert('Não foi possível deletar, Erro: ', error)
            if (error.response) {
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            }
        });
}

//FIND ITEM
const getOneItem = async (dados) => {
    let data
    let itemId
    axios
        .post(`${url}/pesquisa`, dados)
        .then((response) => {

            dadosdaAPI = response.data;
            data = response.data;
            index = -1
            tbody.innerHTML = ''
            for (let item of data) {
                index += 1
                itemId = (dadosdaAPI[index].id)
                insertItem(item, itemId)
            }

        })
        .catch(error => {
            alert('Não foi possível Pesquisar, Erro: ', error)
            if (error.response) {
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            }
        });
};


loadItens()
