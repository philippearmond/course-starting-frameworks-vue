//No vue so consigo renderizar os components a partir da modularização se eu passar a info deles como herança ou composition, igual react mas com outra sintaxe

//Exemplo abaixo utilizando a herança para renderizar, observe que deixei uma lista como global apenas para demonstrar a utilização da
//....vizualização do componente como global (todos os componentes podem acessa-lo)

const ProdutoComponent = {
    template: `
            <div class="col-sm-4 mb-3">
                <div class="card loja__item">
                    <img class="card-img-top" src="https://lorempixel.com/500/300"  alt="lojinha">
                    <div class="card-body">
                        <h5 class="card-title">{produto.nome}</h5>
                            <small> {produto.preco},00 </small>
                            <p class="card-text">{produto.descricao}</p>
                            <button class="btn btn-primary btn-add">Adicionar</button>
                    </div>
                </div>             
            </div>`
}

const ListaProdutosComponent = {
    components: {
        Produto: ProdutoComponent
    },
    template: `<div class="row loja">
                <Produto />
                <Produto />
                <Produto />
                <Produto />
                <Produto />
                <Produto />
                <Produto />

            </div>`
}


const CarrinhoComponent = {
    template: `
            <div class="card carrinho__item">
                <div class="card-body">
                    <h5 class="card-title">{props.nome}</h5>
                    <p class="card-text"> Preço Unidade: R{props.preco},00 | Quantidade: {props.quantidade}</p>
                    <p class="card-text"> Valor: R{props.preco * props.quantidade},00</p>
                    <button class="btn btn-danger btn-sm btn-remove">Remover</button>                
                </div>
            </div>`
}

const ListaCarrinhoComponent = {
    components: {
        Carrinho: CarrinhoComponent
    },
    template: `
            <div class="carrinho">
                    <div class="carrinho__itens">
                        <Carrinho />
                    </div>
                <div class='carrinho__total mt-2 p-3'>
                    <h6>Total: <strong>{R$,00}</strong></h6>
                </div>
            </div>`
}

Vue.component('ListaProdutos', ListaProdutosComponent) //vizualização global para esse componente

new Vue({           //função AppComponent (mais informações importantes no TXT)
    components: {                  //necessario para vizualizar o componente e renderizar
        ListaCarrinho: ListaCarrinhoComponent
    },
    el: '#app',
    template: `
            <div class="container">
                <h1>Carrinho Vue</h1>
                <hr>
                <div class="row">  
                    <div class="col-sm-8">
                        <ListaProdutos />
                    </div>

                    <div class="col-sm-4">
                        <ListaCarrinho />
                    </div>
                </div>
            </div>`
})