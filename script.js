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

let dadosdaAPI
let itens
let id

function openModal() {

    modal.classList.add('active')

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active')
        }
    }
}

function deleteModal() {
    sDeleteModal.classList.add('active')

    sDeleteModal.onclick = e => {
        if (e.target.className.indexOf('deleteModalContainer') !== -1) {
            sDeleteModal.classList.remove('active')
        }
    }
}

function deleteConfirm(itemId) {
    deleteModal()
    const btnDelete = document.querySelector('#btnDelete')
    btnDelete.addEventListener('click', async () => {
        deleteItem(itemId)
    })
}

function modalUpdate(itemId) {
    openModal()
    modificaModalUpdate()
    const btnUpdate = document.querySelector('#btnUpdate')
    btnUpdate.addEventListener('click', () => {
        try {
            let codConc = sCodConc.value
            let nomeCar = sNomeCar.value
            let valorCar = parseInt(sValorCar.value)
            let marketPlace = sMarketPlace.checked
            let site = sSite.checked
            let anuncio = sAnuncio.checked

            let dados = {
                nomeCarro: nomeCar,
                codigoConcess: codConc,
                valorCarro: valorCar,
                marketPlace: marketPlace,
                site: site,
                anuncio: anuncio,
            };
            id = itemId
            updateItem(dados);
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
            let codConc = sCodConc.value
            let nomeCar = sNomeCar.value
            let valorCar = parseInt(sValorCar.value)
            let marketPlace = sMarketPlace.checked
            let site = sSite.checked
            let anuncio = sAnuncio.checked

            let carro = {
                codigoConcess: codConc,
                nomeCarro: nomeCar,
                valorCarro: valorCar,
                marketPlace: marketPlace,
                site: site,
                anuncio: anuncio,
            };
            addNewItem(carro);

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
    modalButton.setAttribute('type', 'button')
}

function modificaModalUpdate() {
    retornaModalPadrao()
    const modalTitle = document.querySelector('#modalTitle')
    const modalButton = document.querySelector('.modalButton')
    modalTitle.innerHTML = 'Atualizar um carro'
    modalButton.innerHTML = 'Atualizar'
    modalButton.setAttribute('id', 'btnUpdate')
    modalButton.setAttribute('type', 'button')
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
            //getOneItem(dados)

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
            <td> ${item.id} </td>
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
let itemId
function loadItens() {
    let data
    axios.get('http://localhost:3000/lista')
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

            return data
        })
        .catch((error) => {
            console.log(error);
        }
        )

}


//POST CADASTRO ITENS
const addNewItem = async (carro) => {
    try {
        axios.post(`${url}/cadastrar`, carro).then(alert('Carro Cadastrado'));
    } catch (Error) {
        console.log('nao cadastrado')
    }
};

//PUT ATUALIZA ITENS
const updateItem = async (dados) => {
    axios
        .put(`${url}/atualizar/${id}`, dados)
        .then(() => {
            alert('Dados Atualizados');
        })
        .catch((error) => console.log(error));
}

//DELETE ITEM
const deleteItem = async (itemId) => {
    console.log('abc')
    axios
        .delete(`${url}/deletar/${itemId}`)
        .then(() => {
            alert('Dados Deletados');
        })
        .catch((error) => console.log(error));
}

//FIND ITEM
const getOneItem = async (dados) => {
    let data
    let itemId
    axios
        .post(`${url}/pesquisa`, dados)
        .then((response) => {
            console.log(dados)
            dadosdaAPI = response.data;
            data = response.data;
            console.log(data)
            index = -1
            tbody.innerHTML = ''
            for (let item of data) {
                index += 1
                console.log(index)
                itemId = (dadosdaAPI[index].id)
                insertItem(item, itemId)
            }

        })
        .catch((error) => console.log(error));
};

loadItens()
