import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import {
    Button,
    FormInput,
    Icon,
    Form
} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import '../etapaConfirmacaoDoador/EtapaConfirmacao.css';
import HeaderT from "../../../components/Header";

function EtapaConfirmacao() {
    const [codigoEtapaVerificacao, setCodigoEtapaVerificacao] = useState('');
    const [reenv, setReenv] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const phone = location.state?.phone || "11999999999"; // número simulado

    const handleChange = (e) => {
        setCodigoEtapaVerificacao(e.target.value);
        setError('');
    };

    const enviarCodigo = () => {
        if (!codigoEtapaVerificacao.trim()) {
            setError('O código não pode estar vazio.');
            return;
        }

        if (codigoEtapaVerificacao === "123456") {
            Swal.fire({
                title: 'Sucesso!',
                text: 'Código verificado com sucesso!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                // Simula navegação para próxima tela
                navigate('/formEnderecoDoador', { state: { enderecoEnvi: { rua: "Rua Simulada", numero: "123" } } });
            });
        } else {
            setError('O código está incorreto. Tente novamente.');
        }
    };

    const reenviarCodigo = () => {
        setReenv(true);
        Swal.fire({
            title: 'Código reenviado!',
            text: 'Verifique seu SMS para o código "123456".',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false,
        });
    };

    return (
        <>
            <HeaderT title1={"Agende sua"} title2={"Doação"} />

            <div className="container-etapaConfirmacao">
                <div className="icon-background-etapaConfirmacao">
                    <Icon name="lock" size="big" className="custom-lock-icon" />
                </div>
                <div className="container-etapaConfirmacao-internal">
                    <h3>Etapa de confirmação</h3>
                    <p className="p-info-envio-sms">
                        {reenv ? "Reenviamos um código por SMS" : "Enviamos um código por SMS"}
                    </p>

                    <Form>
                        <FormInput
                            className="custom-input-verification-code"
                            name="codigoEtapaVerificacao"
                            value={codigoEtapaVerificacao}
                            onChange={handleChange}
                            placeholder="Digite o código"
                            error={error ? { content: error } : null}
                        />
                    </Form>

                    <Button
                        className="btn-verificar-etapaConfirmacao"
                        onClick={enviarCodigo}
                    >
                        Verificar
                    </Button>

                    <p><Link to="/agendaDoacao">voltar</Link></p>

                    <p onClick={reenviarCodigo} style={{ cursor: "pointer" }}>
                        Não recebeu o código? <span>Reenviar código</span>
                    </p>
                </div>
            </div>
        </>
    );
}

export default EtapaConfirmacao;



// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom"; // Importa o hook de navegação
// import axios from "axios";
// import Swal from 'sweetalert2';
// import {
//     Button,
//     FormInput,
//     Icon,
//     Input,
//     Form
// } from "semantic-ui-react";
// import 'semantic-ui-css/semantic.min.css';
// import '../etapaConfirmacaoDoador/EtapaConfirmacao.css';
// import HeaderT from "../../../components/Header";
// import { Link } from "react-router-dom";
// import { use } from "react";

// function EtapaConfirmacao() {
//     const [codigoEtapaVerificacao, setCodigoEtapaVerificacao] = useState('');
//     const [reenv, setReenv] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate(); // Instância do hook de navegação
//     const location = useLocation(); // Hook para acessar o estado passado pela navegação

//     const handleChange = (e) => {
//         setCodigoEtapaVerificacao(e.target.value);
//         setError(''); // Limpa o erro ao digitar

//     };

//     const enviarCodigo = async () => {

//         if (!codigoEtapaVerificacao.trim()) {
//             setError('O código não pode estar vazio.');
//             return;
//         }

//         try {
//             console.log("Código de verificação:", codigoEtapaVerificacao);


//             const phone = location.state?.phone; // Recupera o número do estado passado

//             if (!phone) {
//                 Swal.fire({
//                     title: 'Erro!',
//                     text: 'Número de telefone não encontrado. Por favor, tente novamente.',
//                     icon: 'error',
//                     confirmButtonText: 'OK'
//                 });
//                 return;
//             }

//             // Envia a requisição para a rota com o número na URL e o código no corpo
//             const response = await axios.post(
//                 `https://apianjobom.victordev.shop/doador/sucesso/${phone}`,
//                 {
//                     codigo: codigoEtapaVerificacao // Corpo da requisição com o código
//                 }
//             );

//             if (response.status === 200) {
//                 Swal.fire({
//                     title: 'Sucesso!',
//                     text: 'Código verificado com sucesso!',
//                     icon: 'success',
//                     timer: 2000,
//                     showConfirmButton: false,
//                 })
//                     .then(() => {
//                         navigate('/formEnderecoDoador', { state: { enderecoEnvi: response.data } });
//                     });
//             }
//             console.log(response)
//             console.log("Deu bom demais...")
//         } catch (error) {
//             console.error("Erro ao enviar o código de verificação:", error);
//             setError('O código está incorreto. Tente novamente.');

//             // Swal.fire({
//             //     title: 'Erro!',
//             //     text: 'Ocorreu um erro ao verificar o código. Tente novamente.',
//             //     icon: 'error',
//             //     confirmButtonText: 'OK'
//             // });
//         }
//     };

//     const reenviarCodigo = async () => {
//         const phone = location.state?.phone; // Recupera o número do estado passado


//         const url = `https://apianjobom.victordev.shop/doador/verificaNumero/${phone}`;

//         try {
//             // Fazer a requisição com axios
//             const response = await axios.get(url);

//             // Sucesso
//             console.log('Sucesso', 'Número verificado com sucesso! 2', 'success');
//             setReenv(true)

//         } catch (error) {
//             // Error
//             console.log('Erro', error, 'error');
//         }
//     }

//     return (
//         <>
//             <HeaderT title1={"Agende sua"} title2={"Doação"} />

//             <div className="container-etapaConfirmacao">
//                 <div className="icon-background-etapaConfirmacao">
//                     <Icon name="lock" size="big" className="custom-lock-icon" />
//                 </div>
//                 <div className="container-etapaConfirmacao-internal">
//                     <h3>Etapa de confirmação</h3>
//                     {!reenv ?

//                         <p className="p-info-envio-sms">Enviamos um código por SMS </p>
//                         :
//                         <p className="p-info-envio-sms">Reenviamos um código por SMS </p>
//                     }
//                     <Form>
//                         <FormInput
//                             className="custom-input-verification-code"
//                             name="codigoEtapaVerificacao"
//                             value={codigoEtapaVerificacao}
//                             onChange={handleChange}
//                             placeholder="Digite o código"
//                             error={error ? { content: error } : null}

//                         />
//                     </Form>
//                     <Button
//                         type="submit"
//                         className="btn-verificar-etapaConfirmacao"
//                         onClick={enviarCodigo}
//                     >
//                         Verificar
//                     </Button>
//                     <p><Link to="/agendaDoacao">voltar</Link></p>
//                     <p onClick={reenviarCodigo}>Não recebeu o código?
//                         <span> Reenviar código</span>
//                     </p>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default EtapaConfirmacao;