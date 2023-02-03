const url = 'http://localhost:3000';
const modal = $('.modal-container')
const sDeleteModal = $('.deleteModalContainer')
const tbody = $('tbody')
const formModal = $('#formModal')

let itemIdGlobal = null
let dadosdaAPI

function openModal() {
    $('.modal-container').addClass("active");

    $('.modal-container').click(e => {
        if (e.target.className.indexOf("modal-container") !== -1) {
            $(".modal-container").removeClass("active");
            itemIdGlobal = null
            location.reload()
        }
    })
}

function deleteModal() {
    $('.deleteModalContainer').addClass("active");
    $(".deleteModalContainer").click(e => {
        if (e.target.className.indexOf("deleteModalContainer") !== -1) {
            $(".deleteModalContainer").removeClass("active");
            itemIdGlobal = null;
            location.reload();
        }
    })
}

function deleteConfirm(itemId) {
    if (itemIdGlobal !== itemId) {
        itemIdGlobal = itemId;
        deleteModal()
        let btnDelete = $('#btnDelete')
        btnDelete.click(async () => {
            deleteItem(itemIdGlobal)
            location.reload()
        }
        );
    }
}




function modalUpdate(itemId, item) {
    openModal()
    modificaModalUpdate()
    const btnUpdate = $('#btnUpdate')
    btnUpdate.click(async () => {
        try {
            let codConc = $('#m-codConcess').val()
            let nomeCar = $('#m-nomeCar').val()
            let valorCar = parseInt($('#m-valorCar').val())
            let marketPlace = $('#marketPlace').prop('checked')
            let site = $('#site').prop('checked')
            let anuncio = $('#anuncio').prop('checked')

            let dados = {
                codigoConcess: codConc || item.codigoConcess,
                nomeCarro: nomeCar ||item.nomeCarro,
                valorCarro: valorCar || item.valorCarro,
                marketPlace: marketPlace || false,
                site: site ||  false,
                anuncio: anuncio || false
            };

            updateItem(dados, itemId);
            location.reload()
        }
        catch (Error) {
            console.log(Error);
        }

    })
}

function modalCadastro() {
    openModal()
    modificaModalCadastro()
    let btnSalvar = $('#btnSalvar')
    btnSalvar.click(async () => {
        try {
            let codConc = $('#m-codConcess').val()
            let nomeCar = $('#m-nomeCar').val()
            let valorCar = parseInt($('#m-valorCar').val())
            let marketPlace = $('#marketPlace').prop('checked')
            let site = $('#site').prop('checked')
            let anuncio = $('#anuncio').prop('checked')

            let carro = {
                codigoConcess: codConc,
                nomeCarro: nomeCar,
                valorCarro: valorCar,
                marketPlace: marketPlace,
                site: site,
                anuncio: anuncio,
            };

            addNewItem(carro);
            location.reload()
        } catch (Error) {
            console.log(Error.response.data);
            console.log(Error.response.status);
            console.log(Error.response.headers);

        }
    })
}

function modificaModalCadastro() {
    retornaModalPadrao()
    $('#modalTitle').html('Cadastrar um carro');
    $('.modalButton').html('Salvar')
        .attr('id', 'btnSalvar')
        .attr('type', 'submit');
}

function modificaModalUpdate() {
    retornaModalPadrao()
    $('#modalTitle').html('Atualizar um carro');
    $('.modalButton').html('Atualizar')
        .attr('id', 'btnUpdate')
        .attr('type', 'submit');
}



function modificaModalPesquisa() {
    $('#modalTitle').html('Encontrar uma Concessionária');
    $('.modalButton').html('Encontrar')
        .attr('id', 'btnFind')
        .attr('type', 'submit');
    $('#formModal').html(`<label for="m-codConcess">Código do Carro</label>
        <input id="m-codConcess" type="text" />`)
}

function modalPesquisa() {
    openModal()
    modificaModalPesquisa()
    let btnFind = $('#btnFind')
    btnFind.click(async function () {
        try {
            let codConc = $('#m-codConcess').val()
            const dados = {
                codigoConcess: codConc
            }
            $('.modal-container').removeClass('active')
            getOneItem(dados)

        } catch (error) {
            console.log(error)
        }
    })
}

function retornaModalPadrao() {
    $('#formModal').html(`<label for="m-codConcess">Código do Carro</label>
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
        let tr = $('<tr></tr>');
        tr.html(`    
                <td> ${item.codigoConcess} </td>
                <td> ${item.nomeCarro} </td>
                <td> ${item.valorCarro} </td>
                <td> ${item.marketPlace ? `<i class="uil uil-check icon"></i>` : `<i class="uil uil-times icon"></i>`} </td>
                <td> ${item.site ? `<i class="uil uil-check icon"></i>` : `<i class="uil uil-times icon"></i>`} </td>
                <td> ${item.anuncio ? `<i class="uil uil-check icon"></i>` : `<i class="uil uil-times icon"></i>`} </td>
                <td class="acao">
                <button><i class="bx bx-edit"></i></button>
                </td>
                <td class="acao">
                <button><i class="bx bx-trash"></i></button>
                </td>`);
        tr.find('button:first').on('click', function () {
            modalUpdate(itemId, item);
        });

        tr.find('button:last').on('click', function () {
            deleteConfirm(itemId);
        });
        $('tbody').append(tr);
    } catch (erro) {
        alert(erro)
    }
}


//FUNCAO CARREGA ITENS
function loadItens() {
    let data
    axios.get(`${url}/lista`)
        .then((response) => {
            dadosdaAPI = response.data;
            data = response.data;
            index = -1
            $('tbody').html('')
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
            $('tbody').html('')
            $
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
