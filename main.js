//No vue so consigo renderizar os components a partir da modularização se eu passar a info deles como herança ou composition, igual react mas com outra sintaxe

//Exemplo abaixo utilizando a composição para renderizar, observe no new Vue(app component) a composição é utilizada passando como chave components

const mock = [
	{
		id: 'abc123',
		nome: 'Vanilla para FW',
		preco: 300,
		descricao: 'O melhor site do mundo, segundo ele, o Poblemático. Pois a modéstia é seu forte!',
		imagem: 'https://lorempixel.com/490/300'
	}, 
	{
		id: 'bbc123',
		nome: 'Vanilla para Node',
		preco: 1200,
		descricao: 'O melhor curso do mundo, segundo eu e os colegas. Saímos dele sabendo!',
		imagem: 'https://lorempixel.com/495/300'
	},   
	{
		id: 'cbc123',
		nome: 'Programação Funcional com JS',
		preco: 500,
		descricao: 'O melhor funcional de todos. Pois ele vem de anos de prática!',
		imagem: 'https://lorempixel.com/500/300'
	}
]

const ProdutoComponent = {
    props: ['mockProduto'],
    methods: {  //boa explicação no txt-evento-estado
        addCarrinho(produto) {
            this.$emit('add-Carrinho', produto)
        }
    },
    template: `
            <div class="col-sm-4 mb-3">
                <div class="card loja__item">
                    <img class="card-img-top" :src="mockProduto.imagem"  alt="lojinha">
                    <div class="card-body">
                        <h5 class="card-title">{{ mockProduto.nome }}</h5>
                            <small> R$\{{ mockProduto.preco }},00 </small>
                            <p class="card-text">{{ mockProduto.descricao }}</p>
                            <button class="btn btn-primary btn-add" v-on:click="addCarrinho(mockProduto)">Adicionar</button>
                    </div>
                </div>             
            </div>`
}

const ListaProdutosComponent = {
    template: `
            <div class="row loja">   
                <slot />
            </div>`
}


const CarrinhoComponent = {
    props:['items'],
    methods: {
        removerItem(produtoId) { //observação!!!! isso é um objeto, lembrando!!! parece função pois abreviei o function e os :
            this.$emit('remover-item', produtoId) //passo o nome que quiser aqui, so optei por remover-item mesmo
        }
    },
    template: `
            <div class="card carrinho__item">
                <div class="card-body">
                    <h5 class="card-title">{{items.nome}}</h5>
                    <p class="card-text"> Preço Unidade: R$\{{items.preco}},00 | Quantidade: {{items.quantidade}}</p>
                    <p class="card-text"> Valor: R$\{{items.preco * items.quantidade}},00</p>
                    <button class="btn btn-danger btn-sm btn-remove" v-on:click="removerItem(items.id)">Remover</button>                
                </div>
            </div>`
}

const ListaCarrinhoComponent = {
    //<slot /> exemplo de props.children no Vue (composição)
    props:['items'],
    computed: {
        total() { //ler observação importante dessa parte no TXT
            return Object.keys(this.items).reduce((acc, produtoId) => {
                return acc + ( this.items[produtoId].quantidade * this.items[produtoId].preco )
            }, 0)
        }
    },
    template: `
            <div class="carrinho">
                    <div class="carrinho__itens">
                        <slot />
                    </div>
                <div class='carrinho__total mt-2 p-3'>
                    <h6>Total: <strong>R$\{{ total }},00</strong></h6>
                </div>
            </div>`
}

//Vue.component('ListaProdutos', ListaProdutosComponent) --> vizualização global para esse componente


new Vue({           //função AppComponent (mais informações importantes no TXT)
    components: {                  //necessario para vizualizar o componente e renderizar
        ListaCarrinho: ListaCarrinhoComponent,          
        Carrinho: CarrinhoComponent,
        ListaProdutos: ListaProdutosComponent,
        Produto: ProdutoComponent
    },
    el: '#app',
    data: function() {
        return {
            produto: mock,
            carrinhoItens: {}
        }
    },
    methods: {
        addItemCarrinho(produto){  //nome dessa função foi criado na parte do template ao receber a função dada no $emit
            this.carrinhoItens[produto.id] ? ++this.carrinhoItens[produto.id].quantidade :
            this.carrinhoItens = {
                ...this.carrinhoItens,
                [produto.id]: {
                    ...produto,
                    quantidade: 1
                }
            }
        },
        //exemplo do ayrton: 
        /*
            const quantidade = this.carrinhoItens[produto.id] ? ++this.carrinhoItens[produto.id].quantidade : 1
            
            this.carrinhoItens = {
                ...this.carrinhoItens,
                [produto.id] : {
                    ...produto,
                    quantidade            quando a propriedade tem o mesmo nome da variavel passada, posso abreviar dessa forma
                }
            }
        
        
        
        
        */

        removerItemCarrinho(produtoId) {
            if ( this.carrinhoItens[produtoId].quantidade <= 1 ){
                delete this.carrinhoItens[produtoId]
                
            }else{
                --this.carrinhoItens[produtoId].quantidade
            }

            this.carrinhoItens = { ...this.carrinhoItens } //o Vue trabalha melhor a reatividade na parte de mudança de estado pois, 
                                                            //seu algoritmo detecta qualquer mudança no objeto e renderiza novamente, o React utiliza funçoes por debaixo dos panos para fazer a mesma funcionalidade
        }//explicação 2: o Vue tenta simular melhor a reatividade entao basta eu alterar o objeto(setando delete ou --) e chama-lo de novo passando os valores de antes, ele renderiza novamente
        
    },
    //Posso retirar o v-bind , o vue entende.
    template: `
            <div class="container">
                <h1>Carrinho Vue</h1>
                <hr>
                <div class="row">  
                    <div class="col-sm-8">
                        <ListaProdutos>
                            <Produto 
                              v-for='items in produto'
                              :mockProduto='items'
                              :key="items.id"
                              v-on:add-Carrinho="addItemCarrinho"
                            />
                        </ListaProdutos>
                    </div>

                    <div class="col-sm-4">
                        <ListaCarrinho v-bind:items="carrinhoItens">
                            <Carrinho
                            v-for="produto in carrinhoItens"
                            :items="produto"
                            :key="produto.id"
                            v-on:remover-item="removerItemCarrinho"
                            />
                        </ListaCarrinho>
                    </div>
                </div>
            </div>`
})