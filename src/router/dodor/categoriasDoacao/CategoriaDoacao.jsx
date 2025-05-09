import React, { useState } from 'react';
import { Grid, Card, Icon, Label } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Headers from '../../../components/Header';
import Swal from 'sweetalert2';
import './CategoriaDoacao.css';

const CategoriaDoacao = () => {
    // Dados estáticos de produtos para doação
    const todosProdutosParaDoacao = [
        { id: 1, name: "Brinquedos", requirement: "ALTO" },
        { id: 2, name: "Alimentos", requirement: "MEDIO" },
        { id: 3, name: "Bebidas", requirement: "BAIXO" },
        { id: 4, name: "Roupas", requirement: "MEDIO" },
        { id: 5, name: "Medicamentos", requirement: "ALTO" },
        { id: 6, name: "Higienicos", requirement: "BAIXO" }
    ];

    // Função para retornar a classe CSS com base no nível de prioridade
    const getPriorityClassBorder = (requirement) => {
        switch (requirement) {
            case "ALTO": return 'borda-alta';
            case "MEDIO": return 'borda-media';
            case "BAIXO": return 'borda-baixa';
            default: return '';
        }
    };

    const getPriorityClassIcon = (requirement) => {
        switch (requirement) {
            case "ALTO": return 'color-icon-star-alta';
            case "MEDIO": return 'color-icon-star-media';
            case "BAIXO": return 'color-icon-star-baixa';
            default: return '';
        }
    };

    // Estados para as quantidades
    const [quantidadeAlimento, setQuantidadeAlimento] = useState(0);
    const [quantidadeBebida, setQuantidadeBebida] = useState(0);
    const [quantidadeBrinquedo, setQuantidadeBrinquedo] = useState(0);
    const [quantidadeRoupas, setQuantidadeRoupas] = useState(0);
    const [quantidadeMedicamento, setQuantidadeMedicamento] = useState(0);
    const [quantidadeHigienicos, setQuantidadeHigienicos] = useState(0);
    const [itensCarrinho, setItensCarrinho] = useState([]);

    // Atualiza o carrinho quando as quantidades mudam
    React.useEffect(() => {
        const itens = [];
        if (quantidadeAlimento > 0) itens.push({ name: "Alimentos", quantity: quantidadeAlimento });
        if (quantidadeBebida > 0) itens.push({ name: "Bebidas", quantity: quantidadeBebida });
        if (quantidadeBrinquedo > 0) itens.push({ name: "Brinquedos", quantity: quantidadeBrinquedo });
        if (quantidadeRoupas > 0) itens.push({ name: "Roupas", quantity: quantidadeRoupas });
        if (quantidadeMedicamento > 0) itens.push({ name: "Medicamentos", quantity: quantidadeMedicamento });
        if (quantidadeHigienicos > 0) itens.push({ name: "Higiênicos", quantity: quantidadeHigienicos });
        setItensCarrinho(itens);
    }, [quantidadeAlimento, quantidadeBebida, quantidadeBrinquedo, quantidadeRoupas, quantidadeMedicamento, quantidadeHigienicos]);

    const temItensNoCarrinho = itensCarrinho.length > 0;

    const confirmarDoacao = () => {
        if (!temItensNoCarrinho) {
            Swal.fire({
                title: 'Cesta vazia',
                text: 'Adicione alguma categoria antes de confirmar a doação.',
                icon: 'info',
                showConfirmButton: false,
                timer: 2500
            });
            return;
        }

        const totalQuantity = itensCarrinho.reduce((total, item) => total + item.quantity, 0);

        const tabelaItens = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #135F99; color: #fff">
                        <th style="border: 1px solid #ddd; padding: 8px;">Categoria</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Quantidade</th>
                    </tr>
                </thead>
                <tbody>
                    ${itensCarrinho.map(item => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr style="background-color: #135F99; font-weight: bold; color:#fff">
                        <td style="border: 1px solid #ddd; padding: 8px; color=#fff">Total</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; color=#fff">${totalQuantity}</td>
                    </tr>
                </tfoot>
            </table>
        `;

        Swal.fire({
            title: 'Confirmar Doação',
            html: tabelaItens,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#135F99',
            cancelButtonColor: '#882020',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, Doar!',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Doação realizada com sucesso! (Simulação)',
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                });
                // Resetar quantidades
                setQuantidadeAlimento(0);
                setQuantidadeBebida(0);
                setQuantidadeBrinquedo(0);
                setQuantidadeRoupas(0);
                setQuantidadeMedicamento(0);
                setQuantidadeHigienicos(0);
            }
        });
    };

    return (
        <>
            <Headers title1={"Agende sua"} title2={"Doação"} />
            <div className="container-caregoria-doacao">
                <h1 className="title">Categorias</h1>
                
                <Grid container stackable columns={3} doubling>
                    {/* Alimentos */}
                    <Grid.Column>
                        <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[1].requirement)}>
                            <Label className={getPriorityClassIcon(todosProdutosParaDoacao[1].requirement)} corner="right">
                                <Icon name='star' />
                            </Label>
                            <Card.Content textAlign="center">
                                <Icon name="food" size="huge" color="blue" />
                                <Card.Header className='cardHeader'>Alimentos</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls">
                                    <div className="minus-btn" onClick={() => setQuantidadeAlimento(quantidadeAlimento > 0 ? quantidadeAlimento - 1 : 0)}>−</div>
                                    <div>{quantidadeAlimento}</div>
                                    <div className="plus-btn" onClick={() => setQuantidadeAlimento(quantidadeAlimento + 1)}>+</div>
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    {/* Bebidas */}
                    <Grid.Column>
                        <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[2].requirement)}>
                            <Label className={getPriorityClassIcon(todosProdutosParaDoacao[2].requirement)} corner="right">
                                <Icon name='star' />
                            </Label>
                            <Card.Content textAlign="center">
                                <Icon name="food" size="huge" color="blue" />
                                <Card.Header className='cardHeader'>Bebidas</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls">
                                    <div className="minus-btn" onClick={() => setQuantidadeBebida(quantidadeBebida > 0 ? quantidadeBebida - 1 : 0)}>−</div>
                                    <div>{quantidadeBebida}</div>
                                    <div className="plus-btn" onClick={() => setQuantidadeBebida(quantidadeBebida + 1)}>+</div>
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    {/* Brinquedos */}
                    <Grid.Column>
                        <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[0].requirement)}>
                            <Label className={getPriorityClassIcon(todosProdutosParaDoacao[0].requirement)} corner="right">
                                <Icon name='star' />
                            </Label>
                            <Card.Content textAlign="center">
                                <Icon name="gamepad" size="huge" color="blue" />
                                <Card.Header className='cardHeader'>Brinquedos</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls">
                                    <div className="minus-btn" onClick={() => setQuantidadeBrinquedo(quantidadeBrinquedo > 0 ? quantidadeBrinquedo - 1 : 0)}>−</div>
                                    <div>{quantidadeBrinquedo}</div>
                                    <div className="plus-btn" onClick={() => setQuantidadeBrinquedo(quantidadeBrinquedo + 1)}>+</div>
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    {/* Roupas */}
                    <Grid.Column>
                        <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[3].requirement)}>
                            <Label className={getPriorityClassIcon(todosProdutosParaDoacao[3].requirement)} corner="right">
                                <Icon name='star' />
                            </Label>
                            <Card.Content textAlign="center">
                                <Icon name="shopping bag" size="huge" color="blue" />
                                <Card.Header className='cardHeader'>Roupas</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls">
                                    <div className="minus-btn" onClick={() => setQuantidadeRoupas(quantidadeRoupas > 0 ? quantidadeRoupas - 1 : 0)}>−</div>
                                    <div>{quantidadeRoupas}</div>
                                    <div className="plus-btn" onClick={() => setQuantidadeRoupas(quantidadeRoupas + 1)}>+</div>
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    {/* Medicamentos */}
                    <Grid.Column>
                        <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[4].requirement)}>
                            <Label className={getPriorityClassIcon(todosProdutosParaDoacao[4].requirement)} corner="right">
                                <Icon name='star' />
                            </Label>
                            <Card.Content textAlign="center">
                                <Icon name="medkit" size="huge" color="blue" />
                                <Card.Header className='cardHeader'>Medicamentos</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls">
                                    <div className="minus-btn" onClick={() => setQuantidadeMedicamento(quantidadeMedicamento > 0 ? quantidadeMedicamento - 1 : 0)}>−</div>
                                    <div>{quantidadeMedicamento}</div>
                                    <div className="plus-btn" onClick={() => setQuantidadeMedicamento(quantidadeMedicamento + 1)}>+</div>
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    {/* Higienicos */}
                    <Grid.Column>
                        <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[5].requirement)}>
                            <Label className={getPriorityClassIcon(todosProdutosParaDoacao[5].requirement)} corner="right">
                                <Icon name='star' />
                            </Label>
                            <Card.Content textAlign="center">
                                <Icon name="shower" size="huge" color="blue" />
                                <Card.Header className='cardHeader'>Higiênicos</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div className="counter-controls">
                                    <div className="minus-btn" onClick={() => setQuantidadeHigienicos(quantidadeHigienicos > 0 ? quantidadeHigienicos - 1 : 0)}>−</div>
                                    <div>{quantidadeHigienicos}</div>
                                    <div className="plus-btn" onClick={() => setQuantidadeHigienicos(quantidadeHigienicos + 1)}>+</div>
                                </div>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid>

                <div className="container-legenda">
                    <div className="item-legenda">
                        <div className="circle-legenda yellow-legenda"></div>
                        <p>Baixa</p>
                    </div>
                    <div className="item-legenda">
                        <div className="circle-legenda green-legenda"></div>
                        <p>Média</p>
                    </div>
                    <div className="item-legenda">
                        <div className="circle-legenda red-legenda"></div>
                        <p>Alta</p>
                    </div>
                </div>
                <button className="btn-doar" onClick={confirmarDoacao}>Doar</button>
            </div>
        </>
    );
};

export default CategoriaDoacao;

// import React, { useState, useEffect } from 'react';
// import { Grid, Card, Icon, Segment, Label, Button, Popup, GridColumn, Header, Container } from 'semantic-ui-react';
// import 'semantic-ui-css/semantic.min.css';
// import Headers from '../../../components/Header';
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import './CategoriaDoacao.css';

// const CategoriaDoacao = () => {

//     useEffect(() => {
//         window.scrollTo(0, 0); // Rola para o topo ao montar o componente
//     }, []);

//     const [todosProdutosParaDoacao, setProdutosParaDoacao] = useState([]); // Estado inicial vazio
//     const location = useLocation();
//     // const endereco = location.state.enderecoEnvi;
//     const idPerson = location.state.id; // ID recebido via state
//     // const navigate = useNavigate(); // Hook para navegação

//     // console.log("assim vem o endereco: ", endereco);
//     console.log("ID do person recebido:", idPerson);

//     useEffect(() => {
//         const mostrarProdutosAll = async () => {
//             try {
//                 const response = await axios.get('https://apianjobom.victordev.shop/produtos');
//                 setProdutosParaDoacao(response.data);
//             } catch (error) {
//                 console.error('Erro ao buscar produtos:', error);
//             }
//         };

//         mostrarProdutosAll();

//         const interval = setInterval(mostrarProdutosAll, 5000); // Atualiza a cada 5 segundos

//         return () => clearInterval(interval); // Limpa o intervalo ao desmontar

//     }, []);


//     // Função para retornar a classe CSS com base no nível de prioridade
//     const getPriorityClass = (requirement) => {
//         switch (requirement) {
//             case "ALTO":
//                 return 'nivel-prioridade-prioridade-alta';
//             case "MEDIO":
//                 return 'nivel-prioridade-prioridade-media';
//             case "BAIXO":
//                 return 'nivel-prioridade-prioridade-baixa';
//             default:
//                 return '';
//         }
//     };

//     // Função para retornar a classe CSS com base no nível de prioridade
//     const getPriorityClassBorder = (requirement) => {
//         switch (requirement) {
//             case "ALTO":
//                 return 'borda-alta';
//             case "MEDIO":
//                 return 'borda-media';
//             case "BAIXO":
//                 return 'borda-baixa';
//             default:
//                 return '';
//         }
//     };

//     // Função para retornar a classe CSS com base no nível de prioridade
//     const getPriorityClassIcon = (requirement) => {
//         switch (requirement) {
//             case "ALTO":
//                 return 'color-icon-star-alta';
//             case "MEDIO":
//                 return 'color-icon-star-media';
//             case "BAIXO":
//                 return 'color-icon-star-baixa';
//             default:
//                 return '';
//         }
//     };

//     const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
//     const [isMobile, setIsMobile] = useState(false);

//     useEffect(() => {

//         // Atualiza o estado de "isMobile" com base no tamanho da janela
//         const checkIfMobile = () => {
//             setIsMobile(window.innerWidth <= 768);
//         };

//         // Verifica a rolagem para exibir o carrinho
//         const handleScroll = () => {
//             if (window.scrollY > 300 && isMobile) {
//                 setMostrarCarrinho(true);
//             } else if (!isMobile) {
//                 setMostrarCarrinho(true); // Sempre visível no desktop
//             } else {
//                 setMostrarCarrinho(false); // Oculto no mobile antes de atingir a rolagem
//             }
//         };

//         // Configurações iniciais
//         checkIfMobile();
//         window.addEventListener('resize', checkIfMobile); // Escuta redimensionamento da tela
//         window.addEventListener('scroll', handleScroll); // Escuta a rolagem da página

//         return () => {
//             window.removeEventListener('resize', checkIfMobile);
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, [isMobile]);

//     const [quantidadeAlimento, setQuantidadeAlimento] = useState(0);
//     const [quantidadeBebida, setQuantidadeBebida] = useState(0);
//     const [quantidadeBrinquedo, setQuantidadeBrinquedo] = useState(0);
//     const [quantidadeRoupas, setQuantidadeRoupas] = useState(0);
//     const [quantidadeMedicamento, setQuantidadeMedicamento] = useState(0);
//     const [quantidadeHigienicos, setQuantidadeHigienicos] = useState(0);
//     const [itensCarrinho, setItensCarrinho] = useState([]);
//     const [carrinhoVisivel, setCarrinhoVisivel] = useState(false);
//     const [status, setStatus] = useState("");

//     const temItensNoCarrinho =
//         quantidadeAlimento > 0 ||
//         quantidadeBebida > 0 ||
//         quantidadeBrinquedo > 0 ||
//         quantidadeRoupas > 0 ||
//         quantidadeMedicamento > 0 ||
//         quantidadeHigienicos > 0;

//     // Atualiza o carrinho quando as quantidades mudam
//     useEffect(() => {
//         const itens = [];
//         if (quantidadeAlimento > 0) itens.push({ name: "Alimentos", quantity: quantidadeAlimento });
//         if (quantidadeBebida > 0) itens.push({ name: "Bebidas", quantity: quantidadeBebida });
//         if (quantidadeBrinquedo > 0) itens.push({ name: "Brinquedos", quantity: quantidadeBrinquedo });
//         if (quantidadeRoupas > 0) itens.push({ name: "Roupas", quantity: quantidadeRoupas });
//         if (quantidadeMedicamento > 0) itens.push({ name: "Medicamentos", quantity: quantidadeMedicamento });
//         if (quantidadeHigienicos > 0) itens.push({ name: "Higiênicos", quantity: quantidadeHigienicos });
//         setItensCarrinho(itens);
//     }, [quantidadeAlimento, quantidadeBebida, quantidadeBrinquedo, quantidadeRoupas, quantidadeMedicamento, quantidadeHigienicos]);

//     const toggleCarrinho = () => {
//         setCarrinhoVisivel(!carrinhoVisivel);
//     };

//     const calcularTotalItens = () => {
//         return quantidadeAlimento + quantidadeBebida + quantidadeBrinquedo + quantidadeRoupas + quantidadeMedicamento + quantidadeHigienicos;
//     };


//     const confirmarDoacao = () => {
//         // Verifica se há itens no carrinho
//         if (!temItensNoCarrinho) {
//             Swal.fire({
//                 title: 'Cesta vazia',
//                 text: 'Adicione alguma categoria antes de confirmar a doação.',
//                 icon: 'info',
//                 showConfirmButton: false,
//                 timer: 2500
//             });
//             window.scrollTo(0, 0);
//             return;
//         }
//         const totalQuantity = itensCarrinho.reduce((total, item) => total + item.quantity, 0);


//         // Cria o HTML da tabela dinamicamente com os itens do carrinho
//         const tabelaItens = `
//             <table style="width: 100%; border-collapse: collapse;">
//                 <thead>
//                     <tr style="background-color: #135F99; color: #fff">
//                         <th style="border: 1px solid #ddd; padding: 8px;">Categoria</th>
//                         <th style="border: 1px solid #ddd; padding: 8px;">Quantidade</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${itensCarrinho.map(item => `
//                         <tr>
//                             <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
//                             <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
//                         </tr>
//                     `).join('')}
//                 </tbody>
//                 <tfoot>
//                     <tr style="background-color: #135F99; font-weight: bold; color:#fff">
//                         <td style="border: 1px solid #ddd; padding: 8px; color=#fff">Total</td>
//                         <td style="border: 1px solid #ddd; padding: 8px; text-align: center; color=#fff">${totalQuantity}</td>
//                     </tr>
//                 </tfoot>
//             </table>
//         `;

//         Swal.fire({
//             title: 'Confirmar Doação',
//             html: `
//                 ${tabelaItens}
//             `,
//             icon: 'question',
//             showCancelButton: true,
//             confirmButtonColor: '#135F99',
//             cancelButtonColor: '#882020',
//             cancelButtonText: 'Cancelar',
//             confirmButtonText: 'Sim, Doar!',
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 console.log("Confirmação de Doação recebida:");
//                 handleDoar();
//             }
//         });
//     };


//     // Função para enviar a doação para a API
//     const handleDoar = async () => {
//         // if (!temItensNoCarrinho) {
//         //     alert("Adicione itens ao carrinho antes de doar.");
//         //     return;
//         // }

//         console.log("vamos ver", itensCarrinho);

//         const url = `https://apianjobom.victordev.shop/doador/doarProduto/CriarCesta/${idPerson}`;
//         const requestBody = {
//             items: itensCarrinho,
//             status: "PENDENTE",
//         };

//         try {
//             const response = await axios.post(url, requestBody, {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });
//             console.log("Doação realizada com sucesso:", response.data);
//             Swal.fire({
//                 title: 'Sucesso!',
//                 text: 'Doação realizada com sucesso! Anjo Bom entrará em contato pelo WhatsApp',
//                 icon: 'success',
//                 timer: 3000,
//                 showConfirmButton: false,
//             })
//             setStatus("Doação realizada com sucesso!");
//             // Limpar as quantidades após doar
//             setQuantidadeAlimento(0);
//             setQuantidadeBebida(0);
//             setQuantidadeBrinquedo(0);
//             setQuantidadeRoupas(0);
//             setQuantidadeMedicamento(0);
//             setQuantidadeHigienicos(0);
//             setCarrinhoVisivel(false);
//             window.scrollTo(0, 0);
//         } catch (error) {
//             console.error("Erro ao realizar a doação:", error);
//             setStatus("Erro ao realizar a doação. Tente novamente.");
//         }
//     };
//     return (
//         <>

//             <Headers title1={"Agende sua"} title2={"Doação"} />
//             <div className="container-caregoria-doacao">
//                 <h1 className="title">Categorias</h1>
//                 {!todosProdutosParaDoacao.length ? <h1 className="title">Carregando...</h1> :

//                     <Grid container stackable columns={3} doubling>
//                         <Grid.Column>
//                             <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[1].requirement)}>
//                                 <Label className={getPriorityClassIcon(todosProdutosParaDoacao[1].requirement)} corner="right">
//                                     <Icon name='star' />
//                                 </Label>
//                                 <Card.Content textAlign="center">
//                                     <Icon name="food" size="huge" color="blue" />
//                                     <Card.Header className='cardHeader'>Alimentos</Card.Header>
//                                 </Card.Content>
//                                 <Card.Content extra>
//                                     <div className="counter-controls">
//                                         <div className="minus-btn" onClick={() => setQuantidadeAlimento(quantidadeAlimento > 0 ? quantidadeAlimento - 1 : 0)}>−</div>
//                                         <div>{quantidadeAlimento}</div>
//                                         <div className="plus-btn" onClick={() => setQuantidadeAlimento(quantidadeAlimento + 1)}>+</div>
//                                     </div>
//                                 </Card.Content>
//                             </Card>
//                         </Grid.Column>

//                         <Grid.Column>
//                             <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[2].requirement)}>
//                                 <Label className={getPriorityClassIcon(todosProdutosParaDoacao[2].requirement)} corner="right">
//                                     <Icon name='star' />
//                                 </Label>
//                                 <Card.Content textAlign="center">
//                                     <Icon name="food" size="huge" color="blue" />
//                                     <Card.Header className='cardHeader'>Bebibas</Card.Header>
//                                 </Card.Content>
//                                 <Card.Content extra>
//                                     <div className="counter-controls">
//                                         <div className="minus-btn" onClick={() => setQuantidadeBebida(quantidadeBebida > 0 ? quantidadeBebida - 1 : 0)}>−</div>
//                                         <div>{quantidadeBebida}</div>
//                                         <div className="plus-btn" onClick={() => setQuantidadeBebida(quantidadeBebida + 1)}>+</div>
//                                     </div>
//                                 </Card.Content>
//                             </Card>
//                         </Grid.Column>

//                         <Grid.Column>
//                             <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[0].requirement)}>
//                                 <Label className={getPriorityClassIcon(todosProdutosParaDoacao[0].requirement)} corner="right">
//                                     <Icon name='star' />
//                                 </Label>
//                                 <Card.Content textAlign="center">
//                                     <Icon name="gamepad" size="huge" color="blue" />
//                                     <Card.Header className='cardHeader'>Brinquedos</Card.Header>
//                                 </Card.Content>
//                                 <Card.Content extra>
//                                     <div className="counter-controls">
//                                         <div className="minus-btn" onClick={() => setQuantidadeBrinquedo(quantidadeBrinquedo > 0 ? quantidadeBrinquedo - 1 : 0)}>−</div>
//                                         <div>{quantidadeBrinquedo}</div>
//                                         <div className="plus-btn" onClick={() => setQuantidadeBrinquedo(quantidadeBrinquedo + 1)}>+</div>
//                                     </div>
//                                 </Card.Content>
//                             </Card>
//                         </Grid.Column>

//                         <Grid.Column>
//                             <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[3].requirement)}>
//                                 <Label className={getPriorityClassIcon(todosProdutosParaDoacao[3].requirement)} corner="right">
//                                     <Icon name='star' />
//                                 </Label>
//                                 <Card.Content textAlign="center">
//                                     <Icon name="shopping bag" size="huge" color="blue" />
//                                     <Card.Header className='cardHeader'>Roupas</Card.Header>
//                                 </Card.Content>
//                                 <Card.Content extra>
//                                     <div className="counter-controls">
//                                         <div className="minus-btn" onClick={() => setQuantidadeRoupas(quantidadeRoupas > 0 ? quantidadeRoupas - 1 : 0)}>−</div>
//                                         <div>{quantidadeRoupas}</div>
//                                         <div className="plus-btn" onClick={() => setQuantidadeRoupas(quantidadeRoupas + 1)}>+</div>
//                                     </div>
//                                 </Card.Content>
//                             </Card>
//                         </Grid.Column>

//                         <Grid.Column>
//                             <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[4].requirement)}>
//                                 <Label className={getPriorityClassIcon(todosProdutosParaDoacao[4].requirement)} corner="right">
//                                     <Icon name='star' />
//                                 </Label>
//                                 <Card.Content textAlign="center">
//                                     <Icon name="medkit" size="huge" color="blue" />
//                                     <Card.Header className='cardHeader'>Medicamentos</Card.Header>
//                                 </Card.Content>
//                                 <Card.Content extra>
//                                     <div className="counter-controls">
//                                         <div className="minus-btn" onClick={() => setQuantidadeMedicamento(quantidadeMedicamento > 0 ? quantidadeMedicamento - 1 : 0)}>−</div>
//                                         <div>{quantidadeMedicamento}</div>
//                                         <div className="plus-btn" onClick={() => setQuantidadeMedicamento(quantidadeMedicamento + 1)}>+</div>
//                                     </div>
//                                 </Card.Content>
//                             </Card>
//                         </Grid.Column>

//                         <Grid.Column>
//                             <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[5].requirement)}>
//                                 <Label className={getPriorityClassIcon(todosProdutosParaDoacao[5].requirement)} corner="right">
//                                     <Icon name='star' />
//                                 </Label>
//                                 <Card.Content textAlign="center">
//                                     <Icon name="shower" size="huge" color="blue" />
//                                     <Card.Header className='cardHeader'>Higiênicos</Card.Header>
//                                 </Card.Content>
//                                 <Card.Content extra>
//                                     <div className="counter-controls">
//                                         <div className="minus-btn" onClick={() => setQuantidadeHigienicos(quantidadeHigienicos > 0 ? quantidadeHigienicos - 1 : 0)}>−</div>
//                                         <div>{quantidadeHigienicos}</div>
//                                         <div className="plus-btn" onClick={() => setQuantidadeHigienicos(quantidadeHigienicos + 1)}>+</div>
//                                     </div>
//                                 </Card.Content>
//                             </Card>
//                         </Grid.Column>

//                     </Grid>
//                 }

//                 <div class="container-legenda">
//                     <div class="item-legenda">
//                         <div class="circle-legenda yellow-legenda"></div>
//                         <p>Baixa</p>
//                     </div>
//                     <div class="item-legenda">
//                         <div class="circle-legenda green-legenda"></div>
//                         <p>Média</p>
//                     </div>
//                     <div class="item-legenda">
//                         <div class="circle-legenda red-legenda"></div>
//                         <p>Alta</p>
//                     </div>
//                 </div>
//                 <Button className="btn-doar" onClick={confirmarDoacao}>Doar</Button>

//             </div>
//         </>
//     );
// };

// export default CategoriaDoacao;