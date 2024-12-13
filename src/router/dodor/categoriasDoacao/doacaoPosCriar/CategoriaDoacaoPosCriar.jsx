import React, { useState, useEffect } from 'react';
import { Grid, Card, Icon, Segment, Label, Button, Popup, GridColumn, Header } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Headerss from '../../../../components/Header';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
import './CategoriaDoacaoPosDoacao.css';

const CategoriaDoacaoPosDoacao = () => {

    const [todosProdutosParaDoacao, setProdutosParaDoacao] = useState([]); // Estado inicial vazio
    // const idPerson = location.state?.id; // ID recebido via state
    const location = useLocation();
    const idPerson2 = location.state; // Dados recebidos do formulário
    console.log("Dados do formulário recebdido:", idPerson2.idPerson2._id);

    let idPersonValid = idPerson2.idPerson2._id;
    console.log("vamos ver, ", idPersonValid)
    // useEffect(() => {
    //     console.log("fefe recebido:", dataFromForm);
    // }, [dataFromForm]);

    const mostrarProdutosAll = async () => {
        try {
            const response = await axios.get('https://apianjobom.victordev.shop/produtos');
            setProdutosParaDoacao(response.data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    useEffect(() => {
        mostrarProdutosAll();
    }, []);


    // Função para retornar a classe CSS com base no nível de prioridade
    const getPriorityClass = (requirement) => {
        switch (requirement) {
            case "ALTO":
                return 'nivel-prioridade-prioridade-alta';
            case "MEDIO":
                return 'nivel-prioridade-prioridade-media';
            case "BAIXO":
                return 'nivel-prioridade-prioridade-baixa';
            default:
                return '';
        }
    };

    // Função para retornar a classe CSS com base no nível de prioridade
    const getPriorityClassBorder = (requirement) => {
        switch (requirement) {
            case "ALTO":
                return 'borda-alta';
            case "MEDIO":
                return 'borda-media';
            case "BAIXO":
                return 'borda-baixa';
            default:
                return '';
        }
    };

    // Função para retornar a classe CSS com base no nível de prioridade
    const getPriorityClassIcon = (requirement) => {
        switch (requirement) {
            case "ALTO":
                return 'color-icon-star-alta';
            case "MEDIO":
                return 'color-icon-star-media';
            case "BAIXO":
                return 'color-icon-star-baixa';
            default:
                return '';
        }
    };


    const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {

        // Atualiza o estado de "isMobile" com base no tamanho da janela
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Verifica a rolagem para exibir o carrinho
        const handleScroll = () => {
            if (window.scrollY > 300 && isMobile) {
                setMostrarCarrinho(true);
            } else if (!isMobile) {
                setMostrarCarrinho(true); // Sempre visível no desktop
            } else {
                setMostrarCarrinho(false); // Oculto no mobile antes de atingir a rolagem
            }
        };

        // Configurações iniciais
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile); // Escuta redimensionamento da tela
        window.addEventListener('scroll', handleScroll); // Escuta a rolagem da página

        return () => {
            window.removeEventListener('resize', checkIfMobile);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile]);

    const [quantidadeAlimento, setQuantidadeAlimento] = useState(0);
    const [quantidadeBebida, setQuantidadeBebida] = useState(0);
    const [quantidadeBrinquedo, setQuantidadeBrinquedo] = useState(0);
    const [quantidadeRoupas, setQuantidadeRoupas] = useState(0);
    const [quantidadeMedicamento, setQuantidadeMedicamento] = useState(0);
    const [quantidadeHigienicos, setQuantidadeHigienicos] = useState(0);
    const [itensCarrinho, setItensCarrinho] = useState([]);
    const [carrinhoVisivel, setCarrinhoVisivel] = useState(false);
    const [status, setStatus] = useState("");

    const temItensNoCarrinho =
        quantidadeAlimento > 0 ||
        quantidadeBebida > 0 ||
        quantidadeBrinquedo > 0 ||
        quantidadeRoupas > 0 ||
        quantidadeMedicamento > 0 ||
        quantidadeHigienicos > 0;

    // Atualiza o carrinho quando as quantidades mudam
    useEffect(() => {
        const itens = [];
        if (quantidadeAlimento > 0) itens.push({ name: "Alimentos", quantity: quantidadeAlimento });
        if (quantidadeBebida > 0) itens.push({ name: "Bebidas", quantity: quantidadeBebida });
        if (quantidadeBrinquedo > 0) itens.push({ name: "Brinquedos", quantity: quantidadeBrinquedo });
        if (quantidadeRoupas > 0) itens.push({ name: "Roupas", quantity: quantidadeRoupas });
        if (quantidadeMedicamento > 0) itens.push({ name: "Medicamentos", quantity: quantidadeMedicamento });
        if (quantidadeHigienicos > 0) itens.push({ name: "Higiênicos", quantity: quantidadeHigienicos });
        setItensCarrinho(itens);
    }, [quantidadeAlimento, quantidadeBebida, quantidadeBrinquedo, quantidadeRoupas, quantidadeMedicamento, quantidadeHigienicos]);

    const toggleCarrinho = () => {
        setCarrinhoVisivel(!carrinhoVisivel);
    };

    const calcularTotalItens = () => {
        return quantidadeAlimento + quantidadeBebida + quantidadeBrinquedo + quantidadeRoupas + quantidadeMedicamento + quantidadeHigienicos;
    };

    // Função para enviar a doação para a API
    const handleDoar = async () => {
        if (!temItensNoCarrinho) {
            alert("Adicione itens ao carrinho antes de doar.");
            return;
        }

        console.log("vamos ver", itensCarrinho);

        const url = `https://apianjobom.victordev.shop/doador/doarProduto/CriarCesta/${idPersonValid}`;
        const requestBody = {
            items: itensCarrinho,
            status: "PENDENTE",
        };

        try {
            const response = await axios.post(url, requestBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Doação realizada com sucesso:", response.data);
            Swal.fire({
                title: 'Sucesso!',
                text: 'Doação realizada com sucesso!',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
            })
            setStatus("Doação realizada com sucesso!");
            // Limpar as quantidades após doar
            setQuantidadeAlimento(0);
            setQuantidadeBebida(0);
            setQuantidadeBrinquedo(0);
            setQuantidadeRoupas(0);
            setQuantidadeMedicamento(0);
            setQuantidadeHigienicos(0);
            setCarrinhoVisivel(false);
        } catch (error) {
            console.error("Erro ao realizar a doação:", error);
            setStatus("Erro ao realizar a doação. Tente novamente.");
        }
    };
    return (
        <>

            <Headerss title1={"Agende sua"} title2={"Doação"} />
            <div className="container-caregoria-doacao">
                <h1 className="title">Categorias</h1>
                {!todosProdutosParaDoacao.length ? <h1 className="title">Vzio</h1> :

                    <Grid container stackable columns={3} doubling>
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

                        <Grid.Column>
                            <Card centered className={getPriorityClassBorder(todosProdutosParaDoacao[2].requirement)}>
                                <Label className={getPriorityClassIcon(todosProdutosParaDoacao[2].requirement)} corner="right">
                                    <Icon name='star' />
                                </Label>
                                <Card.Content textAlign="center">
                                    <Icon name="food" size="huge" color="blue" />
                                    <Card.Header className='cardHeader'>Bebibas</Card.Header>
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
                }
                <Popup trigger={<Button>Show flowing popup</Button>} flowing hoverable>
                    <Grid centered divided columns={3}>
                        <GridColumn textAlign='center'>
                            <Header as='h4'>Basic Plan</Header>
                            <p>
                                <b>2</b> projects, $10 a month
                            </p>
                            <Button>Choose</Button>
                        </GridColumn>
                        <GridColumn textAlign='center'>
                            <Header as='h4'>Business Plan</Header>
                            <p>
                                <b>5</b> projects, $20 a month
                            </p>
                            <Button>Choose</Button>
                        </GridColumn>
                        <GridColumn textAlign='center'>
                            <Header as='h4'>Premium Plan</Header>
                            <p>
                                <b>8</b> projects, $25 a month
                            </p>
                            <Button>Choose</Button>
                        </GridColumn>
                    </Grid>
                </Popup>

                {/* Carrinho fixo no canto inferior direito */}
                <div
                    className={`carrinho-container ${mostrarCarrinho ? 'mostrar' : ''}`}
                    style={{
                        position: 'fixed',
                        bottom: '35px',
                        right: '35px',

                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '-1px',
                            right: '-5px',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            backgroundColor: 'red',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            zIndex: 100,
                        }}
                    >
                        {calcularTotalItens()}
                    </div>
                    <Segment className="cart-icon" onClick={toggleCarrinho}>
                        <Icon name="shopping cart" size="large" />
                    </Segment>

                    {carrinhoVisivel && temItensNoCarrinho && (
                        <Segment className="cart-segment" raised>
                            <h4>Carrinho</h4>
                            {itensCarrinho.map((item, index) => (
                                <p key={index}>
                                    {item.name}: {item.quantity}
                                </p>
                            ))}
                            <div className="btn-doar" onClick={handleDoar}>
                                Doar
                            </div>
                        </Segment>
                    )}
                </div>
            </div>
        </>
    );
};

export default CategoriaDoacaoPosDoacao;