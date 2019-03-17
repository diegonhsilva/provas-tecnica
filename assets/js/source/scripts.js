var paginaAtual = 1;
var qtdPorPagina = 20;
var quantidade = 0;
var qtdPaginas = 0;
var qtdPaginasExibir = 5;
var contadorAux = 1;
var produtos;

function listaProdutos(){
    var urlService = "/front-end/mock-products.json";
    $.ajax({
        type: "GET", 
        url: urlService,
        timeout: 3000,
        datatype: 'JSON',
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function() {
            $('.loader').show();
        },
        error: function() {
            alert('OPSS! Erro ao carregar produtos.');
        },
        success: function(retorno) {
            produtos = retorno.products;
            quantidade = produtos.length;

            //ordenar produtos
            ordenar();
            
            //montar paginacao
            montarPaginacao();

            $('.loader').hide();
        } 
    });  
}
function montarPaginacao(){
    qtdPaginas = parseInt(quantidade / qtdPorPagina) + 1;
    for (var index = 1; index <= qtdPaginas; index++) {
        $('.paginacao ul').append('<li><a href="javascript:paginar('+index+')">'+index+'</a></li>');        
    }
    $('.paginacao ul li:first-child a').addClass('active');
    $('.paginacao .lk-left').addClass('disable');
    $('.paginacao .lista').css('max-width', qtdPaginasExibir * $('.paginacao ul li').width());
    $('.paginacao ul').width(qtdPaginas * $('.paginacao ul li').width());
}

function paginar(pagina){
    paginaAtual = pagina;
    $(".produtos ul").html('');
    for (var i = (paginaAtual -1) * qtdPorPagina; i < produtos.length && i < paginaAtual * qtdPorPagina; i++) {
        var item = '<li>'+
                        '<a href="#">'+
                            '<img src="'+produtos[i].image+'">'+
                            '<h2>'+produtos[i].name+'</h2>'+
                            '<h3>R$ <span>'+parseInt(produtos[i].price)+'</span></h3>'+
                        '</a>'+
                    '</li>';
        $(".produtos ul").append(item);
    }
    $('.paginacao ul li a').removeClass('active');
    $('.paginacao ul li').eq(paginaAtual -1).find('a').addClass('active');
}

function ordenar(){
    var filtro = $('#selFiltro').val();

    switch(filtro) {
        case 'crescente':
            produtos.sort(function(a,b) {
                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            });
            break;
        case 'decrescente':
            produtos.sort(function(a,b) {
                return b.name < a.name ? -1 : b.name > a.name ? 1 : 0;
            });
            break;
        case 'menor':
            produtos.sort(function(a,b) {
                return a.price < b.price ? -1 : a.price > b.price ? 1 : 0;
            });
            break;
        case 'maior':
        default:
            produtos.sort(function(a,b) {
                return b.price < a.price ? -1 : b.price > a.price ? 1 : 0;
            });
    }

    //paginar produtos
    paginaAtual = 1;
    paginar(paginaAtual);
    $('.paginacao ul').animate({'left': 0}, 500);
    contadorAux = 1;
}

function paginacaoRolagem(direcao){
    var aux = parseInt(qtdPaginas / qtdPaginasExibir);
    if(direcao == "left" && contadorAux > 1){
        contadorAux--;
        $('.paginacao ul').animate({'left': - (contadorAux - 1) * $('.paginacao .lista').width()}, 500);
    }else if(direcao == "right" && contadorAux <= aux){
        $('.paginacao ul').animate({'left': - contadorAux * $('.paginacao .lista').width()}, 500);
        contadorAux++;
    }
    $('.paginacao > a').removeClass('disable');
    if(contadorAux == 1 || contadorAux > aux)
        $('.paginacao > a.lk-' + direcao).addClass('disable');
}


$(document).ready(function(){

    //carrega a lista de produtos
    listaProdutos();

    //ordenacao de produtos
    $('#selFiltro').change(function(){
        ordenar();
    });

    //menu mobile
    $('#topo').on('click', '.lk-menu, .lk-fechar', function(){
        $('#topo .menu-mobile').toggleClass('ativo');
    });

});