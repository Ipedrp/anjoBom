import React from 'react';
import { Grid, GridColumn, Image, Segment, Icon, Container } from 'semantic-ui-react';
import Header from '../../../components/Header';
import maps from "../../../assets/maps.png";
import logo from "../../../assets/logo.png";
import './PontosColeta.css';

const PontosColeta = () => {
    const pontos = [
        {
            name: "Centro de Coleta Anjo Bom",
            address: {
                cep: "44001-123",
                cidade: "Feira de Santana",
                estado: "BA",
                rua: "Rua das Flores",
                bairro: "Centro",
                numero: "123"
            },
            urlMap: "https://www.google.com/maps?q=-12.2578,-38.9645"
        },
        {
            name: "Posto de Doação Maria Clara",
            address: {
                cep: "44002-456",
                cidade: "Feira de Santana",
                estado: "BA",
                rua: "Avenida Brasil",
                bairro: "São João",
                numero: "456"
            },
            urlMap: "https://www.google.com/maps?q=-12.2560,-38.9600"
        },
        {
            name: "Praça Maria Clara Silva",
            address: {
                cep: "44002-456",
                cidade: "Feira de Santana",
                estado: "BA",
                rua: "Avenida Brasil",
                bairro: "São João",
                numero: "456"
            },
            urlMap: "https://www.google.com/maps?q=-12.2560,-38.9600"
        }
    ];

    return (
        <div>
            <div className="pontos-coleta-container">
                <Header title1={"Pontos de"} title2={"Coleta"} />
                {pontos.length === 0 ? (
                    <div className='lista-listaPontoColeta-container'>
                        <div className="array-vazio">
                            <h1>No momento não há pontos de coleta!</h1>
                        </div>
                    </div>
                ) : (
                    <Grid stackable columns={2} className="pontos-grid">
                        {pontos.map((ponto, index) => (
                            <GridColumn key={index} className="pontos-column">
                                <Segment className="pontos-segment">
                                    <Grid className='pontos-grid'>
                                        <GridColumn width={12} mobile={16} computer={12} className="pontos-text">
                                            <h4>{ponto.name}</h4>
                                            <p><strong>Cep: </strong>{ponto.address.cep}</p>
                                            <p><strong>Cidade: </strong>{ponto.address.cidade} - {ponto.address.estado}</p>
                                            <p><strong>Rua:</strong> {ponto.address.rua}</p>
                                            <p><strong>Bairro:</strong> {ponto.address.bairro}</p>
                                            <p><strong>Número:</strong> {ponto.address.numero}</p>
                                        </GridColumn>
                                        <GridColumn width={4} mobile={16} computer={4} className="pontos-image">
                                            <Image centered src={maps} size='tiny' className="pontos-img" />
                                            <p>
                                                <a className='pontos-image-p' href={ponto.urlMap} target="_blank" rel="noopener noreferrer">
                                                    Clique aqui para abrir no Google Maps
                                                </a>
                                            </p>
                                        </GridColumn>
                                    </Grid>
                                </Segment>
                            </GridColumn>
                        ))}
                    </Grid>
                )}
            </div>

            <div className="footer-pontoColeta">
                <Container>
                    <Grid stackable columns={16} verticalAlign="middle">
                        <Grid.Column className="footer-image" width={4}>
                            <Image src={logo} size='small' centered />
                        </Grid.Column>
                        <Grid.Column className="footer-text" width={8}>
                            <p>Rua Juá, n° 264 - Bosque da Saúde - Feira de Santana - Ba - Cep: 04138-020</p>
                            <p>Informações sobre agendamento de doações: 4003 2299</p>
                            <p>Informações sobre demais assuntos: (75) 5591 7074</p>
                            <p>2024 - Assistência e Promoção Social Anjo Bom</p>
                            <p>Política de Cookies | Política de Privacidade</p>
                        </Grid.Column>
                        <Grid.Column className="footer-icons" width={4} textAlign="right">
                            <Icon name="facebook" size="large" />
                            <Icon name="twitter" size="large" />
                            <Icon name="instagram" size="large" />
                        </Grid.Column>
                    </Grid>
                </Container>
            </div>
        </div>
    );
};

export default PontosColeta;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Grid, GridColumn, Image, Segment, Icon, Container } from 'semantic-ui-react';
// import Header from '../../../components/Header';
// import maps from "../../../assets/maps.png";
// import logo from "../../../assets/logo.png"
// import './PontosColeta.css'; // Importa o arquivo CSS externo

// const PontosColeta = () => {
//     useEffect(() => {
//         window.scrollTo(0, 0); // Rola para o topo ao montar o componente
//     }, []);

//     const [pontos, setPontos] = useState([]);

//     useEffect(() => {
//         const fetchPontos = async () => {
//             try {
//                 const response = await axios.get('https://apianjobom.victordev.shop/coletas/buscarPontosDeColeta');
//                 setPontos(response.data);
//                 console.log("pontos aqui embaixo");
//                 console.log(response.data);
//             } catch (error) {
//                 console.error('Erro ao buscar os pontos de coleta:', error);
//             }
//         };

//         fetchPontos();

//         const interval = setInterval(fetchPontos, 5000); // Atualiza a cada 5 segundos

//         return () => clearInterval(interval); // Limpa o intervalo ao desmontar

//     }, []);

//     return (
//         <div>
//             <div className="pontos-coleta-container">
//                 <Header title1={"Pontos de"} title2={"Coleta"} />
//                 {pontos.length === 0 ? (
//                     <div className='lista-listaPontoColeta-container'>
//                         <div className="array-vazio">
//                             <h1>No momento não há pontos de coleta!</h1>
//                         </div>
//                     </div>
//                 ) : (
//                     <Grid stackable columns={2} className="pontos-grid">
//                         {pontos.map((ponto, index) => (
//                             <GridColumn key={index} className="pontos-column">
//                                 <Segment className="pontos-segment">
//                                     <Grid className='pontos-grid'>
//                                         {/* Primeira coluna (Texto e Meta) */}
//                                         <GridColumn width={12} mobile={16} computer={12} className="pontos-text">
//                                             <h4>{ponto.name}</h4>
//                                             <p><strong>Cep: </strong>{ponto.address.cep}</p>
//                                             <p><strong>Cidade: </strong>{ponto.address.cidade} - {ponto.address.estado}</p>
//                                             <p><strong>Rua:</strong> {ponto.address.rua}</p>
//                                             <p><strong>Bairro:</strong> {ponto.address.bairro}</p>
//                                             <p><strong>Número:</strong> {ponto.address.numero}</p>
//                                         </GridColumn>
//                                         {/* Segunda coluna (Imagem e Link) */}
//                                         <GridColumn width={4} mobile={16} computer={4} className="pontos-image">
//                                             <Image centered src={maps} size='tiny' className="pontos-img" />
//                                             <p>
//                                                 <a className='pontos-image-p' href={ponto.urlMap} target="_blank" rel="noopener noreferrer">
//                                                     Clique aqui para abrir no Google Maps
//                                                 </a>
//                                             </p>
//                                         </GridColumn>
//                                     </Grid>
//                                 </Segment>
//                             </GridColumn>
//                         ))}
//                     </Grid>
//                 )}
//             </div>
//             <div className="footer-pontoColeta">
//                 <Container>
//                     <Grid stackable columns={16} verticalAlign="middle">
//                         <Grid.Column className="footer-image" width={4}>
//                             <Image src={logo} size='small' centered />
//                         </Grid.Column>
//                         <Grid.Column className="footer-text" width={8}>
//                             <p>Rua Juá, n° 264 - Bosque da Saúde - Feira de Santana - Ba - Cep: 04138-020</p>
//                             <p>Informações sobre agendamento de doações: 4003 2299</p>
//                             <p>Informações sobre demais assuntos: (75) 5591 7074</p>
//                             <p>2024 - Assistência e Promoção Social Anjo Bom</p>
//                             <p>Política de Cookies | Política de Privacidade</p>
//                         </Grid.Column>
//                         <Grid.Column className="footer-icons" width={4} textAlign="right">
//                             <Icon name="facebook" size="large" />
//                             <Icon name="twitter" size="large" />
//                             <Icon name="instagram" size="large" />
//                         </Grid.Column>
//                     </Grid>
//                 </Container>
//             </div>
//         </div>

//     );
// };

// export default PontosColeta;
