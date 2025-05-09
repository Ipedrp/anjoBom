import React, { useState } from "react";
import { Button, Icon, FormInput, Form } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import "./AgendaDoacao.css";
import HeaderT from "../../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import InputMask from 'react-input-mask';

function AgendaDoacao() {
    const [verificationNumber, setVerificationNumber] = useState('');
    const [errorVerificationNumber, setErrorVerificationNumber] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setVerificationNumber(e.target.value);
        setErrorVerificationNumber('');
    };

    const enviar = () => {
        const unmaskedNumber = verificationNumber.replace(/\D/g, '');

        if (!unmaskedNumber) {
            setErrorVerificationNumber('Telefone não pode ser vazio');
            return;
        }

        if (unmaskedNumber.length < 11) {
            setErrorVerificationNumber('Número inválido, digite corretamente');
            return;
        }

        // Simulando sucesso
        const formattedNumber = `+55${unmaskedNumber.slice(2)}`;
        console.log("Simulando envio. Número formatado:", formattedNumber);

        // Navegação simulada
        navigate('/etapaConfirmacaoDoador', { state: { phone: formattedNumber } });
    };

    return (
        <>
            <HeaderT title1={"Agende sua"} title2={"Doação"} />

            <div className="container-agendaDoacao">
                <div className="icon-background-agendaDoacao">
                    <Icon name="lock" size="big" className="custom-lock-icon" />
                </div>
                <div className="container-agendaDoacao-internal">
                    <h3>Já possui uma conta?</h3>
                    <Form>
                        <InputMask
                            mask="+55 (99) 99999-9999"
                            value={verificationNumber}
                            onChange={handleChange}
                            maskChar={null}
                        >
                            {(inputProps) => (
                                <FormInput
                                    {...inputProps}
                                    className="custom-input-verification-number"
                                    width={500}
                                    fluid
                                    error={errorVerificationNumber ? { content: errorVerificationNumber } : null}
                                    label={<label className="p-info-number">Informe seu número</label>}
                                    placeholder="(75) 9 9999-9999"
                                    name="verificationNumber"
                                    type="text"
                                    maxLength={25}
                                />
                            )}
                        </InputMask>
                    </Form>

                    <Button
                        type="submit"
                        className="btn-verificar-agendaDoacao"
                        onClick={enviar}
                    >
                        Verificar
                    </Button>
                    <p>Não possui uma conta?
                        <Link to="/formDoador">
                            <span> Criar conta</span>
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default AgendaDoacao;




// import React, { useState } from "react";
// import axios from "axios";
// import Swal from 'sweetalert2';
// import { Button, Icon, FormInput, Form, FormField } from "semantic-ui-react";
// import 'semantic-ui-css/semantic.min.css';
// import "./AgendaDoacao.css";
// import HeaderT from "../../../components/Header";
// import { Link, useNavigate } from "react-router-dom";
// import InputMask from 'react-input-mask'; // Importando o InputMask

// function AgendaDoacao() {
//     const [verificationNumber, setVerificationNumber] = useState('');
//     const [errorVerificationNumber, setErrorVerificationNumber] = useState('');
//     const navigate = useNavigate(); // Hook de navegação

//     const handleChange = (e) => {
//         setVerificationNumber(e.target.value);
//         // Limpar o erro sempre que o valor for alterado
//         setErrorVerificationNumber('');
//     };

//     // const enviar = () => {
//     //     // Remover todos os caracteres não numéricos, mas manter o "+55" no início
//     //     const unmaskedNumber = verificationNumber.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

//     //     // Certificar-se de que o número começa com "+55"
//     //     let formattedNumber = unmaskedNumber;
//     //     if (formattedNumber.length > 0) {
//     //         formattedNumber = `+55${formattedNumber.slice(2)}`; // Preservar o DDD e número sem espaços ou caracteres extras
//     //     }

//     //     console.log("vernumero:", formattedNumber); // Exibe o número sem máscara, com +55

//     //     const url = `https://apianjobom.victordev.shop/doador/verificaNumero/${formattedNumber}`;

//     //     // Realizar a requisição com axios
//     //     axios.get(url)
//     //         .then((response) => {
//     //             // Exemplo de tratamento de sucesso
//     //             console.log('Sucesso', 'Número verificado com sucesso!', 'success');

//     //             // Redireciona para a página "etapaConfirmacaoDoador" após sucesso, passando o número
//     //             navigate('/etapaConfirmacaoDoador', { state: { phone: formattedNumber } });
//     //         })
//     //         .catch((error) => {
//     //             // Exemplo de tratamento de erro
//     //             const errorMessage = error?.response?.data?.message || 'Houve um problema ao verificar o número';
//     //             setErrorVerificationNumber(errorMessage);
//     //             console.log('Erro', errorMessage, 'error');
//     //         });
//     // };

//     const enviar = async () => {
//         // Remover todos os caracteres não numéricos
//         const unmaskedNumber = verificationNumber.replace(/\D/g, '');

//         // Verificar se o número está vazio
//         if (!unmaskedNumber) {
//             setErrorVerificationNumber('Telefone não pode ser vazio');
//             console.log('Erro', 'Telefone não pode ser vazio', 'error');
//             return;
//         }

//         // Certificar-se de que o número começa com "+55"
//         let formattedNumber = `+55${unmaskedNumber.slice(2)}`; // Preserva o DDD e o número sem espaços ou caracteres extras

//         console.log("Número formatado:", formattedNumber);

//         const url = `https://apianjobom.victordev.shop/doador/verificaNumero/${formattedNumber}`;

//         try {
//             // Fazer a requisição com axios
//             const response = await axios.get(url);

//             // Sucesso
//             console.log('Sucesso', 'Número verificado com sucesso!', 'success');

//             // Redireciona para a página "etapaConfirmacaoDoador" após sucesso, passando o número
//             navigate('/etapaConfirmacaoDoador', { state: { phone: formattedNumber } });
//         } catch (error) {
//             // Erro
//             const errorMessage = error?.response?.data?.message || 'Houve um problema ao verificar o número';
//             setErrorVerificationNumber(errorMessage);
//             console.log('Erro', errorMessage, 'error');
//         }
//     };


//     return (
//         <>
//             <HeaderT title1={"Agende sua"} title2={"Doação"} />

//             <div className="container-agendaDoacao">
//                 <div className="icon-background-agendaDoacao">
//                     <Icon name="lock" size="big" className="custom-lock-icon" />
//                 </div>
//                 <div className="container-agendaDoacao-internal">
//                     <h3>Já possui uma conta?</h3>
//                     <Form>
//                         {/* Usando o InputMask para a máscara visual */}
//                         <InputMask
//                             mask="+55 (99) 99999-9999"
//                             value={verificationNumber}
//                             onChange={handleChange}
//                             maskChar={null} // Não mostrar o caractere de máscara
//                         >
//                             {(inputProps) => (
//                                 <FormInput
//                                     {...inputProps}
//                                     className="custom-input-verification-number"
//                                     width={500}
//                                     fluid
//                                     error={errorVerificationNumber ? { content: errorVerificationNumber } : null}
//                                     label={<label className="p-info-number">Informe seu número</label>}
//                                     placeholder="(75) 9 9999-9999"
//                                     name="verificationNumber"
//                                     type="text"
//                                     maxLength={25}
//                                 />
//                             )}
//                         </InputMask>
//                     </Form>

//                     <Button
//                         type="submit"
//                         className="btn-verificar-agendaDoacao"
//                         onClick={enviar}
//                     >
//                         Verificar
//                     </Button>
//                     <p>Não possui uma conta?
//                         <Link to="/formDoador">
//                             <span> Criar conta</span>
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default AgendaDoacao;
