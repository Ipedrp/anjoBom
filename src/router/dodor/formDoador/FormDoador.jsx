import React, { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import * as EmailValidator from 'email-validator';

import {
    Container,
    BreadcrumbSection,
    BreadcrumbDivider,
    Breadcrumb,
    Label,
    Divider,
    Header,
    Button,
    Checkbox,
    Form,
    FormInput,
    FormGroup,
    FormTextArea,
    Icon
} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import "./FormDoador.css"
import HeaderT from "../../../components/Header";
import { Link } from "react-router-dom";

function FormDoador() {
    const [stepFormContact, setStepFormContact] = useState(true);
    const [stepFormAndress, setStepFormAndress] = useState(false);
    const [stepVerification, setStepVerification] = useState(false);
    const [msgCodigo, setMsgCodigo] = useState(false);
    const [recebidoCodigo, setRecebidoCodigo] = useState('123456'); // Código estático
    const [buttonAtivo, setButtonAtivo] = useState(true);
    const navigate = useNavigate();

    const [erros, setErros] = useState({
        address: {
            cep: "",
        },
    });
    const [errorCep, setErrorCep] = useState("");

    const [formValues, setFormValues] = useState({
        name: '',
        last_name: '',
        email: '',
        phone: '',
        motivation: '',
        address: {
            cep: '',
            estado: '',
            cidade: '',
            bairro: '',
            rua: '',
            numero: ''
        },
    });

    const [codigo, setCodigo] = useState({
        codigoVerificacao: ''
    })

    const formatCEP = (cep) => {
        const cleaned = ('' + cep).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{5})(\d{3})$/);
        if (match) {
            return `${match[1]}-${match[2]}`;
        }
        return cleaned;
    }

    const validateCep = async (value) => {
        if (!value) {
            setErrorCep("CEP é obrigatório");
            return;
        }

        if (value.length > 9) {
            setErrorCep("Máximo 9 caracteres");
            return;
        }

        // Simulação estática de validação de CEP
        if (value.length === 8) {
            setFormValues((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    rua: "Rua Exemplo",
                    bairro: "Bairro Exemplo",
                    cidade: "Cidade Exemplo",
                    estado: "EX",
                },
            }));
            setErrorCep("");
        } else {
            setErrorCep("CEP inválido");
        }
    };

    const formatPhoneForDisplay = (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length <= 2) {
            return cleaned;
        } else if (cleaned.length <= 7) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        } else {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
        }
    };

    const formatPhoneForDatabase = (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `+55${cleaned}`;
        }
        throw new Error('Número de telefone inválido. Deve conter 11 dígitos.');
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.cep')) {
            const field = name.split('.')[1];
            setFormValues((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    [field]: formatCEP(value)
                }
            }));

            if (value.length === 8) {
                validateCep(value);
            }
        } else if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormValues((prevState) => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    [field]: value
                }
            }));
        } else if (name === 'phone') {
            setFormValues({ ...formValues, [name]: formatPhoneForDisplay(value) });
        } else if (name === 'codigoVerificacao') {
            setCodigo({
                [name]: value
            })
        } else {
            setFormValues({
                ...formValues,
                [name]: value
            });
        }

        setErros(prevState => {
            const newErros = { ...prevState };
            switch (name) {
                case "name":
                    if (value.length > 29) {
                        newErros.name = "Máximo 30 caracteres";
                    } else {
                        newErros.name = "";
                    }
                    break;
                case "last_name":
                    if (value.length > 59) {
                        newErros.last_name = "Máximo 60 caracteres";
                    } else {
                        newErros.last_name = "";
                    }
                    break;
                case "phone":
                    if (value.length > 15) {
                        newErros.phone = "Máximo 15 caracteres";
                    } else {
                        newErros.phone = "";
                    }
                    break;
                case "email":
                    if (value.length > 44) {
                        newErros.email = "Máximo 45 caracteres";
                    } else {
                        newErros.email = "";
                    }
                    break;
                case "motivation":
                    if (value.length > 99) {
                        newErros.motivation = "Máximo 100 caracteres";
                    } else {
                        newErros.motivation = "";
                    }
                    break;
                case "address.cep":
                    if (value.length > 9) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.cep = "Máximo 9 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.cep;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                case "address.rua":
                    if (value.length > 99) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.rua = "Máximo 100 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.rua;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                case "address.estado":
                    if (value.length > 2) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.estado = "Máximo 2 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.estado;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                case "address.cidade":
                    if (value.length > 99) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.cidade = "Máximo 100 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.cidade;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                case "address.bairro":
                    if (value.length > 99) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.bairro = "Máximo 100 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.bairro;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                case "address.numero":
                    if (value.length > 6) {
                        if (!newErros.address) newErros.address = {};
                        newErros.address.numero = "Máximo 6 caracteres";
                    } else {
                        if (newErros.address) delete newErros.address.numero;
                        if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
                    }
                    break;
                default:
                    break;
            }

            return newErros;
        });
    };

    function voltarParaContato() {
        setStepFormContact(true);
        setStepFormAndress(false);
    }

    function irParaEndereco() {
        let valid = true;
        let newErros = {};

        if (!formValues.name || formValues.name.trim() === '') {
            newErros.name = "Nome é obrigatório";
            valid = false;
        } else if (formValues.name.length < 10) {
            newErros.name = "Mínimo de 10 caracteres";
            valid = false;
        } else if (formValues.name.length > 29) {
            newErros.name = "Máximo 30 caracteres";
            valid = false;
        }

        if (!formValues.last_name || formValues.last_name.trim() === '') {
            newErros.last_name = "Sobrenome é obrigatório";
            valid = false;
        } else if (formValues.last_name.length < 10) {
            newErros.last_name = "Mínimo de 10 caracteres";
            valid = false;
        } else if (formValues.last_name.length > 59) {
            newErros.last_name = "Máximo 60 caracteres";
            valid = false;
        }

        if (!formValues.phone || formValues.phone.trim() === '') {
            newErros.phone = "Telefone é obrigatório";
            valid = false;
        } else if (formValues.phone.length < 15) {
            newErros.phone = "Mínimo de 15 caracteres";
            valid = false;
        } else if (formValues.phone.length > 15) {
            newErros.phone = "Máximo 15 caracteres";
            valid = false;
        }

        if (!formValues.email || formValues.email.trim() === '') {
            newErros.email = "E-mail é obrigatório";
            valid = false;
        } else if (!EmailValidator.validate(formValues.email)) {
            newErros.email = "Email é inválido";
            valid = false;
        } else if (formValues.email.length > 44) {
            newErros.email = "Máximo 45 caracteres";
            valid = false;
        }

        if (!formValues.motivation || formValues.motivation.trim() === '') {
            newErros.motivation = "Motivação é obrigatória";
            valid = false;
        } else if (formValues.motivation.length < 10) {
            newErros.motivation = "Máximo de 10 caracteres";
            valid = false;
        } else if (formValues.motivation.length > 99) {
            newErros.motivation = "Máximo de 100 caracteres";
            valid = false;
        }

        if (valid) {
            setStepFormAndress(true);
            setStepFormContact(false);
        } else {
            setStepFormContact(true);
        }

        setErros(newErros);
    }

    function voltarParaEndereco() {
        setStepVerification(false);
        setStepFormAndress(true);
    }

    function irParaVerificacao() {
        let valid = true;
        let newErros = {};

        if (!formValues.address.cep || formValues.address.cep.trim() === '') {
            newErros.address = { cep: "CEP é obrigatório" };
            valid = false;
        } else if (formValues.address.cep.length !== 9) {
            newErros.address = { cep: "CEP deve ter exatamente 9 caracteres" };
            valid = false;
        } else if (errorCep) {
            newErros.address = { cep: "CEP inválido" };
            valid = false;
        }

        if (!formValues.address.estado || formValues.address.estado.trim() === '') {
            newErros.address = { ...newErros.address, estado: "Estado é obrigatório" };
            valid = false;
        } else if (formValues.address.estado.length !== 2) {
            newErros.address = { ...newErros.address, estado: "Deve ter exatamente 2 caracteres" };
            valid = false;
        }

        if (!formValues.address.cidade || formValues.address.cidade.trim() === '') {
            newErros.address = { ...newErros.address, cidade: "Cidade é obrigatória" };
            valid = false;
        } else if (formValues.address.cidade.length < 3) {
            newErros.address = { ...newErros.address, cidade: "Mínimo 3 caracteres" };
            valid = false;
        } else if (formValues.address.cidade.length > 99) {
            newErros.address = { ...newErros.address, cidade: "Máximo 100 caracteres" };
            valid = false;
        }

        if (!formValues.address.bairro || formValues.address.bairro.trim() === '') {
            newErros.address = { ...newErros.address, bairro: "Bairro é obrigatório" };
            valid = false;
        } else if (formValues.address.bairro.length < 3) {
            newErros.address = { ...newErros.address, bairro: "Mínimo 3 caracteres" };
            valid = false;
        } else if (formValues.address.bairro.length > 99) {
            newErros.address = { ...newErros.address, bairro: "Máximo 100 caracteres" };
            valid = false;
        }

        if (!formValues.address.rua || formValues.address.rua.trim() === '') {
            newErros.address = { ...newErros.address, rua: "Rua é obrigatória" };
            valid = false;
        } else if (formValues.address.rua.length < 3) {
            newErros.address = { ...newErros.address, rua: "Mínimo 3 caracteres" };
            valid = false;
        } else if (formValues.address.rua.length > 99) {
            newErros.address = { ...newErros.address, rua: "Máximo 100 caracteres" };
            valid = false;
        }

        if (!formValues.address.numero || formValues.address.numero.trim() === '') {
            newErros.address = { ...newErros.address, numero: "Número é obrigatório" };
            valid = false;
        } else if (formValues.address.numero.length > 6) {
            newErros.address = { ...newErros.address, numero: "Máximo 6 caracteres" };
            valid = false;
        }

        if (valid) {
            setStepFormAndress(false);
            setStepVerification(true);
        } else {
            setStepFormAndress(true);
        }

        setErros(newErros);
    }

    async function enviarCodigo() {
        setMsgCodigo(true);
        setButtonAtivo(false);
        // Simulação estática - define um código fixo
        setRecebidoCodigo('123456');
    }

    async function enviarFormulario() {
        let newErros = {};
        let valid = true;

        if (codigo.codigoVerificacao === '') {
            newErros = { codigoVerificacao: "Código é obrigatório" };
            valid = false;
        } else if (recebidoCodigo !== codigo.codigoVerificacao) {
            newErros = { codigoVerificacao: "Código não é compatível!" };
            valid = false;
        } else {
            valid = true;
        }

        if (valid) {
            try {
                const formattedPhone = formatPhoneForDatabase(formValues.phone);
                const dataToSend = { ...formValues, phone: formattedPhone };

                Swal.fire({
                    title: "Parabéns!",
                    text: "Você agora é um doador!",
                    icon: "success",
                    customClass: {
                        confirmButton: 'swal2-confirm-custom'
                    }
                });

                setFormValues({
                    name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    motivation: '',
                    address: {
                        cep: '',
                        estado: '',
                        cidade: '',
                        bairro: '',
                        rua: '',
                        numero: ''
                    }
                });
                setCodigo({
                    codigoVerificacao: ''
                });
                
                // Redireciona com dados estáticos
                navigate("/categoriaDoacao", { state: { idPerson2: "123" } });
            } catch (error) {
                Swal.fire({
                    title: "Erro",
                    text: "Ocorreu um erro ao processar seu cadastro.",
                    icon: "error",
                    customClass: {
                        confirmButton: 'swal2-confirm-custom'
                    }
                });
            }
        }

        setErros(newErros);
    }

    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <>
            <HeaderT title1={"Torne-se"} title2={"Doador"} />

            <div className="container-formulario">
                {stepFormContact ?
                    <div className="wizard-form">
                        <header className="wizard-header">
                            {isMobile ?
                                <div>
                                    <Container textAlign="center">
                                        <Breadcrumb>
                                            <Label circular className="color-label-circle-active">1</Label>
                                            <BreadcrumbDivider icon='right chevron' />
                                            <Label circular className="color-label-circle">2</Label>
                                            <BreadcrumbDivider icon='right chevron' />
                                            <Label circular className="color-label-circle">3</Label>
                                        </Breadcrumb>
                                    </Container>
                                    <Divider horizontal>
                                        <Header as='h4' className="header-form">
                                            Contato
                                        </Header>
                                    </Divider>
                                </div>
                                : <div>
                                    <Container textAlign="center">
                                        <Breadcrumb>
                                            <Label circular className="color-label-circle-active">1</Label>
                                            <BreadcrumbSection>Contato</BreadcrumbSection>
                                            <BreadcrumbDivider icon='right chevron' />
                                            <Label circular className="color-label-circle">2</Label>
                                            <BreadcrumbSection >Endereço</BreadcrumbSection>
                                            <BreadcrumbDivider icon='right chevron' />
                                            <Label circular className="color-label-circle">3</Label>
                                            <BreadcrumbSection >Verificação</BreadcrumbSection>
                                        </Breadcrumb>
                                    </Container>
                                    <Divider inverted />
                                </div>
                            }
                        </header>

                        <main className="wizard-main">
                            <Form>
                                <div className="form-inputs">
                                    <FormGroup widths={"equal"}>
                                        <FormInput
                                            fluid
                                            error={!!erros.name && { content: erros.name }}
                                            label={<label className="blue-label">Nome</label>}
                                            placeholder="Digite seu nome"
                                            name="name"
                                            type="text"
                                            maxLength={30}
                                            minLength={10}
                                            value={formValues.name}
                                            onChange={handleChange}
                                        />
                                        <FormInput
                                            fluid
                                            error={!!erros.last_name && { content: erros.last_name }}
                                            label={<label className="blue-label">Sobrenome</label>}
                                            placeholder="Digite seu sobrenome"
                                            name="last_name"
                                            type="text"
                                            maxLength={60}
                                            minLength={10}
                                            value={formValues.last_name}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                    <FormGroup widths={"equal"}>
                                        <FormInput
                                            icon='phone'
                                            iconPosition='left'
                                            fluid
                                            error={!!erros.phone && { content: erros.phone }}
                                            label={<label className="blue-label">Telefone</label>}
                                            placeholder="Digite seu telefone"
                                            name="phone"
                                            maxLength={15}
                                            minLength={14}
                                            value={formValues.phone}
                                            onChange={handleChange}
                                        />
                                        <FormInput
                                            icon='mail'
                                            iconPosition='left'
                                            fluid
                                            error={!!erros.email && { content: erros.email }}
                                            label={<label className="blue-label">E-mail</label>}
                                            placeholder="Digite seu e-mail"
                                            name="email"
                                            maxLength={45}
                                            value={formValues.email}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                    <FormTextArea
                                        fluid
                                        error={!!erros.motivation && { content: erros.motivation }}
                                        label={<label className="blue-label">Motivação</label>}
                                        placeholder="Descreva sua motivação"
                                        name="motivation"
                                        maxLength={100}
                                        minLength={10}
                                        value={formValues.motivation}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Form>
                        </main>

                        <footer className="wizard-footer">
                            <Button type='submit' className="btn-internal-forms-back">
                                <Link to='/agendaDoacao'>
                                    voltar
                                </Link>
                            </Button>
                            <Button type='submit' className="btn-internal-forms-continous" onClick={irParaEndereco}>Continuar</Button>
                        </footer>
                    </div>
                    : null
                }
                {stepFormAndress ?
                    <div className="wizard-form">
                        <header className="wizard-header">
                            {isMobile ?
                                <div>
                                    <Container textAlign="center">
                                        <Breadcrumb>
                                            <Icon name="check circle" size="large" className="color-label-circle-sucess" />
                                            <BreadcrumbDivider icon='right chevron' />
                                            <Label circular className="color-label-circle-active">2</Label>
                                            <BreadcrumbDivider icon='right chevron' />
                                            <Label circular className="color-label-circle">3</Label>
                                        </Breadcrumb>
                                    </Container>
                                    <Divider horizontal>
                                        <Header as='h4' className="header-form">
                                            Endereço
                                        </Header>
                                    </Divider>
                                </div>
                                : <div>
                                    <Container textAlign="center">
                                        <Breadcrumb>
                                            <Icon name="check circle" size="large" className="color-label-circle-sucess" />
                                            <BreadcrumbSection>Contato</BreadcrumbSection>
                                            <BreadcrumbDivider icon='right chevron' />
                                            <Label circular className="color-label-circle-active">2</Label>
                                            <BreadcrumbSection >Endereço</BreadcrumbSection>
                                            <BreadcrumbDivider icon='right chevron' />
                                            <Label circular className="color-label-circle">3</Label>
                                            <BreadcrumbSection >Verificação</BreadcrumbSection>
                                        </Breadcrumb>
                                    </Container>
                                    <Divider inverted />
                                </div>
                            }
                        </header>
                        <main className="wizard-main">
                            <Form>
                                <div className="form-inputs">
                                    <FormInput
                                        fluid
                                        error={!!errorCep || (erros.address && erros.address.cep) ? { content: errorCep || erros.address.cep } : null}
                                        label={<label className="blue-label">CEP</label>}
                                        placeholder="Digite seu CEP"
                                        name="address.cep"
                                        type="text"
                                        maxLength={9}
                                        minLength={9}
                                        value={formValues.address.cep}
                                        onChange={handleChange}
                                    />
                                    <FormGroup widths="equal">
                                        <FormInput
                                            fluid
                                            error={!!(erros.address && erros.address.estado) && { content: erros.address.estado }}
                                            label={<label className="blue-label">Estado</label>}
                                            placeholder="Digite seu estado"
                                            name="address.estado"
                                            type="text"
                                            maxLength={2}
                                            minLength={2}
                                            value={formValues.address.estado}
                                            onChange={handleChange}
                                        />
                                        <FormInput
                                            fluid
                                            error={!!(erros.address && erros.address.cidade) && { content: erros.address.cidade }}
                                            label={<label className="blue-label">Cidade</label>}
                                            placeholder="Digite sua cidade"
                                            name="address.cidade"
                                            type="text"
                                            maxLength={100}
                                            minLength={3}
                                            value={formValues.address.cidade}
                                            onChange={handleChange}
                                        />
                                        <FormInput
                                            fluid
                                            error={!!(erros.address && erros.address.bairro) && { content: erros.address.bairro }}
                                            label={<label className="blue-label">Bairro</label>}
                                            placeholder="Digite seu bairro"
                                            name="address.bairro"
                                            type="text"
                                            maxLength={100}
                                            minLength={3}
                                            value={formValues.address.bairro}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                    <FormGroup widths="equal">
                                        <FormInput
                                            fluid
                                            error={!!(erros.address && erros.address.rua) && { content: erros.address.rua }}
                                            label={<label className="blue-label">Rua</label>}
                                            placeholder="Digite sua rua"
                                            name="address.rua"
                                            type="text"
                                            maxLength={100}
                                            minLength={3}
                                            value={formValues.address.rua}
                                            onChange={handleChange}
                                        />
                                        <FormInput
                                            fluid
                                            error={!!(erros.address && erros.address.numero) && { content: erros.address.numero }}
                                            label={<label className="blue-label">Número</label>}
                                            placeholder="Digite o número de sua residência"
                                            name="address.numero"
                                            type="text"
                                            maxLength={6}
                                            minLength={1}
                                            value={formValues.address.numero}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </div>
                            </Form>
                        </main>

                        <footer className="wizard-footer">
                            <Button type='submit' className="btn-internal-forms-back" onClick={voltarParaContato}>Voltar</Button>
                            <Button type='submit' className="btn-internal-forms-continous" onClick={irParaVerificacao}>Continuar</Button>
                        </footer>
                    </div>
                    : null
                }
                {stepVerification ?
                    <div className="wizard-form">
                        <header className="wizard-header">
                            {isMobile ?
                                <div>
                                    <Container textAlign="center">
                                        <Breadcrumb>
                                            <Icon name="check circle" size="large" className="color-label-circle-sucess" />
                                            <BreadcrumbDivider icon='right chevron' />
                                            <Icon name="check circle" size="large" className="color-label-circle-sucess" />
                                            <BreadcrumbDivider icon='right chevron' />
                                            <Label circular className="color-label-circle-active">3</Label>
                                        </Breadcrumb>
                                    </Container>
                                    <Divider horizontal>
                                        <Header as='h4' className="header-form">
                                            Verificação
                                        </Header>
                                    </Divider>
                                </div>
                                : <div>
                                    <Container textAlign="center">
                                        <Breadcrumb>
                                            <Icon name="check circle" size="large" className="color-label-circle-sucess" />
                                            <BreadcrumbSection>Contato</BreadcrumbSection>
                                            <BreadcrumbDivider icon='right chevron' />
                                            <Icon name="check circle" size="large" className="color-label-circle-sucess" />
                                            <BreadcrumbSection >Endereço</BreadcrumbSection>
                                            <BreadcrumbDivider icon='right chevron' />
                                            <Label circular className="color-label-circle-active">3</Label>
                                            <BreadcrumbSection >Verificação</BreadcrumbSection>
                                        </Breadcrumb>
                                    </Container>
                                    <Divider inverted />
                                </div>
                            }
                        </header>
                        <main className="wizard-main">
                            <Form>
                                <div className="form-inputs">
                                    <FormInput
                                        fluid
                                        error={!!erros.codigoVerificacao && { content: erros.codigoVerificacao }}
                                        label={<label className="blue-label">Código de verificação</label>}
                                        placeholder="Digite o código de verificação"
                                        name="codigoVerificacao"
                                        type="text"
                                        maxLength={20}
                                        value={codigo.codigoVerificacao}
                                        onChange={handleChange}
                                    />
                                    {msgCodigo ?
                                        <p className="msg-codigo-verificacao">
                                            Um código foi enviado para o número <b>{formValues.phone}</b>.
                                        </p>
                                        :
                                        null}
                                    {
                                        buttonAtivo ?
                                            <button type="submit" className="btn-enviar-codigo" onClick={enviarCodigo}>
                                                Enviar código
                                            </button> :
                                            <button type="submit" className="btn-enviar-codigo-inativo">
                                                Enviar código
                                            </button>
                                    }
                                    <div className="div-nao-recebeu-codigo">
                                        <p>Não recebeu o código?</p>
                                        <p className="reenviar-codigo" onClick={enviarCodigo}>Clique aqui para reenviar</p>
                                    </div>
                                    <Checkbox
                                        label={
                                            <label>Ao aceitar, você concorda com os Termos de Uso e
                                                Política de Privacidade do site
                                            </label>
                                        }
                                        defaultChecked
                                    />
                                </div>
                            </Form>
                        </main>
                        <footer className="wizard-footer">
                            <Button type='submit' className="btn-internal-forms-back" onClick={voltarParaEndereco}>Voltar</Button>
                            <Button type='submit' className="btn-internal-forms-continous" onClick={enviarFormulario}>Enviar</Button>
                        </footer>
                    </div>
                    : null
                }
            </div>
        </>
    )
}

export default FormDoador;



// import React, { useState, useEffect } from "react";
// import { useMediaQuery } from 'react-responsive';
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from 'sweetalert2'
// import * as EmailValidator from 'email-validator';


// import {
//     Container,
//     BreadcrumbSection,
//     BreadcrumbDivider,
//     Breadcrumb,
//     Label,
//     Divider,
//     Header,
//     Button,
//     Checkbox,
//     Form,
//     FormInput,
//     FormGroup,
//     FormTextArea,
//     Icon


// } from "semantic-ui-react";
// import 'semantic-ui-css/semantic.min.css'
// import "./FormDoador.css"
// import HeaderT from "../../../components/Header";
// import { Link } from "react-router-dom";


// function FormDoador() {


//     const [stepFormContact, setStepFormContact] = useState(true);
//     const [stepFormAndress, setStepFormAndress] = useState(false);
//     const [stepVerification, setStepVerification] = useState(false);
//     const [msgCodigo, setMsgCodigo] = useState(false);
//     const [recebidoCodigo, setRecebidoCodigo] = useState('');
//     const [buttonAtivo, setButtonAtivo] = useState(true);
//     const navigate = useNavigate();



//     const [erros, setErros] = useState({
//         address: {
//             cep: "",
//             // outros campos de erro do endereço, se necessário
//         },
//     });
//     const [errorCep, setErrorCep] = useState(""); // Para o erro de CEP


//     // Estado para armazenar os valores dos inputs
//     const [formValues, setFormValues] = useState({
//         name: '',
//         last_name: '',
//         email: '',
//         phone: '',
//         motivation: '',
//         address: {
//             cep: '',
//             estado: '',
//             cidade: '',
//             bairro: '',
//             rua: '',
//             numero: ''
//         },

//     });

//     const [codigo, setCodigo] = useState({
//         codigoVerificacao: ''
//     })

//     const formatCEP = (cep) => {
//         const cleaned = ('' + cep).replace(/\D/g, ''); // Remove qualquer caractere não numérico

//         // Aplica a máscara para CEP no formato "99999-999"
//         const match = cleaned.match(/^(\d{5})(\d{3})$/);
//         if (match) {
//             return `${match[1]}-${match[2]}`;
//         }
//         return cleaned;
//     }
//     const validateCep = async (value) => {
//         if (!value) {
//             setErrorCep("CEP é obrigatório");
//             return;
//         }

//         if (value.length > 9) {
//             setErrorCep("Máximo 9 caracteres");
//             return;
//         }

//         try {
//             const response = await axios.get(`https://viacep.com.br/ws/${value}/json/`);
//             if (response.data && !response.data.erro) {
//                 // Se o CEP for válido
//                 setFormValues((prevState) => ({
//                     ...prevState,
//                     address: {
//                         ...prevState.address,
//                         rua: response.data.logradouro,
//                         bairro: response.data.bairro,
//                         cidade: response.data.localidade,
//                         estado: response.data.uf,
//                     },
//                 }));
//                 setErrorCep(""); // Limpa o erro se for válido
//             } else {
//                 setErrorCep("CEP inválido"); // Atualiza o erro se o CEP for inválido
//             }
//         } catch (error) {
//             console.error("Erro ao buscar o CEP:", error);
//             // setErrorCep("Erro ao buscar o CEP"); // Atualiza com mensagem de erro
//         }
//     };
//     const formatPhoneForDisplay = (phone) => {
//         const cleaned = phone.replace(/\D/g, ''); // Remove caracteres não numéricos

//         if (cleaned.length <= 2) {
//             return cleaned; // Apenas os primeiros dois dígitos (DDD)
//         } else if (cleaned.length <= 7) {
//             return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`; // Formato parcial com DDD
//         } else {
//             return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`; // Formato completo
//         }
//     };

//     const formatPhoneForDatabase = (phone) => {
//         const cleaned = phone.replace(/\D/g, ''); // Remove caracteres não numéricos
//         if (cleaned.length === 11) {
//             return `+55${cleaned}`; // Adiciona o código do país
//         }
//         throw new Error('Número de telefone inválido. Deve conter 11 dígitos.');
//     };

//     // Função para atualizar os valores conforme o usuário digita
//     const handleChange = async (e) => {
//         const { name, value } = e.target;
//         // Verifica se o campo que está sendo alterado é o CEP
//         if (name.startsWith('address.cep')) {
//             const field = name.split('.')[1];
//             setFormValues((prevState) => ({
//                 ...prevState,
//                 address: {
//                     ...prevState.address,
//                     [field]: formatCEP(value) // Aplica a formatação ao CEP
//                 }
//             }));

//             // Se o CEP tiver o tamanho certo (geralmente 8 caracteres), faz a requisição para a API
//             if (value.length === 8) {
//                 validateCep(value); // Chame a função de validação do CEP

//             }

//         } else if (name.startsWith('address.')) {
//             const field = name.split('.')[1];
//             setFormValues((prevState) => ({
//                 ...prevState,
//                 address: {
//                     ...prevState.address,
//                     [field]: value
//                 }
//             }));
//         } else if (name === 'phone') {
//             setFormValues({ ...formValues, [name]: formatPhoneForDisplay(value) }); // Formata para exibição
//         } else if (name === 'codigoVerificacao') {
//             setCodigo({
//                 [name]: value
//             })
//         } else {
//             setFormValues({
//                 ...formValues,
//                 [name]: value
//             });

//         }


//         setErros(prevState => {
//             const newErros = { ...prevState };
//             switch (name) {
//                 case "name":
//                     if (value.length > 29) {
//                         newErros.name = "Máximo 30 caracteres";
//                     } else {
//                         newErros.name = "";
//                     }
//                     break;
//                 case "last_name":
//                     if (value.length > 59) {
//                         newErros.last_name = "Máximo 60 caracteres";
//                     } else {
//                         newErros.last_name = "";
//                     }
//                     break;
//                 case "phone":
//                     if (value.length > 15) {
//                         newErros.phone = "Máximo 15 caracteres";
//                     } else {
//                         newErros.phone = "";
//                     }
//                     break;
//                 case "email":
//                     if (value.length > 44) {
//                         newErros.email = "Máximo 45 caracteres";
//                     } else {
//                         newErros.email = "";
//                     }
//                     break;
//                 case "motivation":
//                     if (value.length > 99) {
//                         newErros.motivation = "Máximo 100 caracteres";
//                     } else {
//                         newErros.motivation = "";
//                     }
//                     break;
//                 case "address.cep":
//                     if (value.length > 9) {
//                         if (!newErros.address) newErros.address = {};
//                         newErros.address.cep = "Máximo 9 caracteres";
//                     } else {
//                         if (newErros.address) delete newErros.address.cep;
//                         if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
//                     }
//                     break;
//                 case "address.rua":
//                     if (value.length > 99) {
//                         if (!newErros.address) newErros.address = {};
//                         newErros.address.rua = "Máximo 100 caracteres";
//                     } else {
//                         if (newErros.address) delete newErros.address.rua;
//                         if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
//                     }
//                     break;
//                 case "address.estado":
//                     if (value.length > 2) {
//                         if (!newErros.address) newErros.address = {};
//                         newErros.address.estado = "Máximo 2 caracteres";
//                     } else {
//                         if (newErros.address) delete newErros.address.estado;
//                         if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
//                     }
//                     break;
//                 case "address.cidade":
//                     if (value.length > 99) {
//                         if (!newErros.address) newErros.address = {};
//                         newErros.address.cidade = "Máximo 100 caracteres";
//                     } else {
//                         if (newErros.address) delete newErros.address.cidade;
//                         if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
//                     }
//                     break;
//                 case "address.bairro":
//                     if (value.length > 99) {
//                         if (!newErros.address) newErros.address = {};
//                         newErros.address.bairro = "Máximo 100 caracteres";
//                     } else {
//                         if (newErros.address) delete newErros.address.bairro;
//                         if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
//                     }
//                     break;
//                 case "address.numero":
//                     if (value.length > 6) {
//                         if (!newErros.address) newErros.address = {};
//                         newErros.address.numero = "Máximo 6 caracteres";
//                     } else {
//                         if (newErros.address) delete newErros.address.numero;
//                         if (Object.keys(newErros.address || {}).length === 0) delete newErros.address;
//                     }
//                     break;
//                 default:
//                     break;
//             }

//             return newErros;
//         });
//     };

//     function voltarParaContato() {
//         setStepFormContact(true);
//         setStepFormAndress(false);
//     }

//     function irParaEndereco() {
//         let valid = true; // Inicializamos como verdadeiro e vamos alterar caso haja erros
//         let newErros = {};

//         // Validação de campos obrigatórios
//         if (!formValues.name || formValues.name.trim() === '') {
//             newErros.name = "Nome é obrigatório";
//             valid = false;
//         } else if (formValues.name.length < 10) {
//             newErros.name = "Mínimo de 10 caracteres";
//             valid = false;
//         } else if (formValues.name.length > 29) {
//             newErros.name = "Máximo 30 caracteres";
//             valid = false;
//         }

//         if (!formValues.last_name || formValues.last_name.trim() === '') {
//             newErros.last_name = "Sobrenome é obrigatório";
//             valid = false;
//         } else if (formValues.last_name.length < 10) {
//             newErros.last_name = "Mínimo de 10 caracteres";
//             valid = false;
//         } else if (formValues.last_name.length > 59) {
//             newErros.last_name = "Máximo 60 caracteres";
//             valid = false;
//         }

//         if (!formValues.phone || formValues.phone.trim() === '') {
//             newErros.phone = "Telefone é obrigatório";
//             valid = false;
//         } else if (formValues.phone.length < 15) {
//             newErros.phone = "Mínimo de 15 caracteres";
//             valid = false;
//         } else if (formValues.phone.length > 15) {
//             newErros.phone = "Máximo 15 caracteres";
//             valid = false;
//         }

//         if (!formValues.email || formValues.email.trim() === '') {
//             newErros.email = "E-mail é obrigatório";
//             valid = false;
//         } else if (!EmailValidator.validate(formValues.email)) {
//             newErros.email = "Email é inválido";
//             valid = false;
//         } else if (formValues.email.length > 44) {
//             newErros.email = "Máximo 45 caracteres";
//             valid = false;
//         }

//         if (!formValues.motivation || formValues.motivation.trim() === '') {
//             newErros.motivation = "Motivação é obrigatória";
//             valid = false;
//         } else if (formValues.motivation.length < 10) {
//             newErros.motivation = "Máximo de 10 caracteres";
//             valid = false;
//         } else if (formValues.motivation.length > 99) {
//             newErros.motivation = "Máximo de 100 caracteres";
//             valid = false;
//         }

//         // Se válido, vai para o endereço
//         if (valid) {
//             setStepFormAndress(true);
//             setStepFormContact(false);
//         } else {
//             setStepFormContact(true); // Mantém na etapa de contato
//         }

//         // Atualiza os erros
//         setErros(newErros);
//     }



//     function voltarParaEndereco() {
//         setStepVerification(false);
//         setStepFormAndress(true);
//     }

//     function irParaVerificacao() {
//         let valid = true;
//         let newErros = {};

//         // Validação dos campos dentro de `address`
//         if (!formValues.address.cep || formValues.address.cep.trim() === '') {
//             newErros.address = { cep: "CEP é obrigatório" };
//             valid = false;
//         } else if (formValues.address.cep.length !== 9) {
//             newErros.address = { cep: "CEP deve ter exatamente 9 caracteres" };
//             valid = false;
//         }else if (errorCep) {
//             newErros.address = { cep: "CEP inválido" };
//             valid = false;

//         }

//         if (!formValues.address.estado || formValues.address.estado.trim() === '') {
//             newErros.address = { ...newErros.address, estado: "Estado é obrigatório" };
//             valid = false;
//         } else if (formValues.address.estado.length !== 2) {
//             newErros.address = { ...newErros.address, estado: "Deve ter exatamente 2 caracteres" };
//             valid = false;
//         }

//         if (!formValues.address.cidade || formValues.address.cidade.trim() === '') {
//             newErros.address = { ...newErros.address, cidade: "Cidade é obrigatória" };
//             valid = false;
//         } else if (formValues.address.cidade.length < 3) {
//             newErros.address = { ...newErros.address, cidade: "Mínimo 3 caracteres" };
//             valid = false;
//         } else if (formValues.address.cidade.length > 99) {
//             newErros.address = { ...newErros.address, cidade: "Máximo 100 caracteres" };
//             valid = false;
//         }

//         if (!formValues.address.bairro || formValues.address.bairro.trim() === '') {
//             newErros.address = { ...newErros.address, bairro: "Bairro é obrigatório" };
//             valid = false;
//         } else if (formValues.address.bairro.length < 3) {
//             newErros.address = { ...newErros.address, bairro: "Mínimo 3 caracteres" };
//             valid = false;
//         } else if (formValues.address.bairro.length > 99) {
//             newErros.address = { ...newErros.address, bairro: "Máximo 100 caracteres" };
//             valid = false;
//         }

//         if (!formValues.address.rua || formValues.address.rua.trim() === '') {
//             newErros.address = { ...newErros.address, rua: "Rua é obrigatória" };
//             valid = false;
//         } else if (formValues.address.rua.length < 3) {
//             newErros.address = { ...newErros.address, rua: "Mínimo 3 caracteres" };
//             valid = false;
//         } else if (formValues.address.rua.length > 99) {
//             newErros.address = { ...newErros.address, rua: "Máximo 100 caracteres" };
//             valid = false;
//         }

//         if (!formValues.address.numero || formValues.address.numero.trim() === '') {
//             newErros.address = { ...newErros.address, numero: "Número é obrigatório" };
//             valid = false;
//         } else if (formValues.address.numero.length > 6) {
//             newErros.address = { ...newErros.address, numero: "Máximo 6 caracteres" };
//             valid = false;
//         }

//         // Se válido, vai para a verificação
//         if (valid) {
//             setStepFormAndress(false);
//             setStepVerification(true);
//         } else {
//             setStepFormAndress(true); // Mantém na etapa de endereço
//         }

//         // Atualiza os erros
//         setErros(newErros);
//     }


//     async function enviarCodigo() {

//         setMsgCodigo(true);
//         setButtonAtivo(false);
//         try {
//             const response = await axios.get(`https://apianjobom.victordev.shop/doador/code/+5575992477349 `)
//             console.log("Codigo que foi enviado ", response.data.codigo);
//             setRecebidoCodigo(response.data.codigo);

//             console.log("Codigo digitado pelo usuario ", recebidoCodigo);


//         } catch (error) {

//         }

//     }

//     async function enviarFormulario() {

//         console.log("como sera enviado antes: ", formValues)

//         // console.log("Dados do formulário:", formValues);
//         let newErros = {};
//         let valid = true;

//         // Verifica se o campo de código está vazio
//         if (codigo.codigoVerificacao === '') {
//             newErros = { codigoVerificacao: "Código é obrigatório" };
//             valid = false;
//         }
//         // Verifica se o código inserido é igual ao código esperado
//         else if (recebidoCodigo !== codigo.codigoVerificacao) {
//             newErros = { codigoVerificacao: "Código não é compatível!" };
//             valid = false;
//         }
//         // Se o código estiver correto
//         else {
//             valid = true;
//         }



//         if (valid) {

//             // Formata o telefone antes de enviar para o backend
//             const formattedPhone = formatPhoneForDatabase(formValues.phone);
//             const dataToSend = { ...formValues, phone: formattedPhone };


//             console.log("como sera enviado: ", dataToSend)
//             try {
//                 // Envia os dados para o backend via POST usando Axios
//                 const response = await axios.post('https://apianjobom.victordev.shop/doador/', dataToSend, {
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 // Exibe o SweetAlert para sucesso
//                 Swal.fire({
//                     title: "Parabéns!",
//                     text: "Você agora é um doador!",
//                     icon: "success",
//                     customClass: {
//                         confirmButton: 'swal2-confirm-custom'
//                     }

//                 });
//                 console.log('Resposta do servidor:', response.data);

//                 // Limpa o formulário após o envio
//                 setFormValues({
//                     name: '',
//                     last_name: '',
//                     email: '',
//                     phone: '',
//                     motivation: '',
//                     address: {
//                         cep: '',
//                         estado: '',
//                         cidade: '',
//                         bairro: '',
//                         rua: '',
//                         numero: ''
//                     }
//                 });
//                 setCodigo({
//                     codigoVerificacao: ''
//                 })
//                 const idPerson2 = response.data
//                 // Redireciona com os dados do formulário
//                 navigate("/categoriaDoacaoPosCriar", { state: { idPerson2} });
//             } catch (error) {
//                 if (error.response && error.response.status === 409) {
//                     Swal.fire({
//                         title: "Temos um pequeno problema!",
//                         text: "O email ou telefone já está cadastrado.",
//                         icon: "error",
//                         customClass: {
//                             confirmButton: 'swal2-confirm-custom'
//                         }

//                     });
//                 } else {
//                     Swal.fire({
//                         title: "Erro",
//                         text: "Erro ao enviar dados para o servidor.",
//                         icon: "error",
//                         customClass: {
//                             confirmButton: 'swal2-confirm-custom'
//                         }

//                     });
//                 }
//                 console.error('Erro ao enviar os dados:', error);
//             }
//         }



//         // Atualiza os erros
//         setErros(newErros);


//     }


//     const isMobile = useMediaQuery({ maxWidth: 767 });

//     return (
//         <>

//             <HeaderT title1={"Torne-se"} title2={"Doador"} />

//             <div className="container-formulario">

//                 {/* Step formulario Contato*/}


//                 {stepFormContact ?
//                     <div className="wizard-form">
//                         <header className="wizard-header">
//                             {isMobile ?
//                                 /*Modo mobile para Step Contato */
//                                 <div>
//                                     <Container textAlign="center">
//                                         <Breadcrumb>
//                                             <Label circular className="color-label-circle-active">1</Label>
//                                             <BreadcrumbDivider icon='right chevron' />
//                                             <Label circular className="color-label-circle">2</Label>
//                                             <BreadcrumbDivider icon='right chevron' />
//                                             <Label circular className="color-label-circle">3</Label>
//                                         </Breadcrumb>
//                                     </Container>
//                                     <Divider horizontal>
//                                         <Header as='h4' className="header-form">
//                                             Contato
//                                         </Header>
//                                     </Divider>
//                                 </div>

//                                 /*Modo computador para Step Contato */

//                                 : <div>

//                                     <Container textAlign="center">
//                                         <Breadcrumb>
//                                             <Label circular className="color-label-circle-active">1</Label>
//                                             <BreadcrumbSection>Contato</BreadcrumbSection>
//                                             <BreadcrumbDivider icon='right chevron' />
//                                             <Label circular className="color-label-circle">2</Label>
//                                             <BreadcrumbSection >Endereço</BreadcrumbSection>
//                                             <BreadcrumbDivider icon='right chevron' />
//                                             <Label circular className="color-label-circle">3</Label>
//                                             <BreadcrumbSection >Verificação</BreadcrumbSection>
//                                         </Breadcrumb>
//                                     </Container>
//                                     <Divider inverted />
//                                 </div>
//                             }
//                         </header>

//                         <main className="wizard-main">
//                             <Form>
//                                 <div className="form-inputs">
//                                     {/* Inputs dinâmicos de cada etapa */}
//                                     <FormGroup widths={"equal"}>
//                                         <FormInput
//                                             fluid
//                                             error={!!erros.name && { content: erros.name }}
//                                             label={<label className="blue-label">Nome</label>}
//                                             placeholder="Digite seu nome"
//                                             name="name"
//                                             type="text"
//                                             maxLength={30}
//                                             minLength={10}
//                                             value={formValues.name}
//                                             onChange={handleChange}
//                                         />
//                                         <FormInput
//                                             fluid
//                                             error={!!erros.last_name && { content: erros.last_name }}
//                                             label={<label className="blue-label">Sobrenome</label>}
//                                             placeholder="Digite seu sobrenome"
//                                             name="last_name"
//                                             type="text"
//                                             maxLength={60}
//                                             minLength={10}
//                                             value={formValues.last_name}
//                                             onChange={handleChange}
//                                         />
//                                     </FormGroup>
//                                     <FormGroup widths={"equal"}>
//                                         <FormInput
//                                             icon='phone'
//                                             iconPosition='left'
//                                             fluid
//                                             error={!!erros.phone && { content: erros.phone }}
//                                             label={<label className="blue-label">Telefone</label>}
//                                             placeholder="Digite seu telefone"
//                                             name="phone"
//                                             maxLength={15}
//                                             minLength={14}
//                                             value={formValues.phone}
//                                             onChange={handleChange}
//                                         />
//                                         <FormInput
//                                             icon='mail'
//                                             iconPosition='left'
//                                             fluid
//                                             error={!!erros.email && { content: erros.email }}
//                                             label={<label className="blue-label">E-mail</label>}
//                                             placeholder="Digite seu e-mail"
//                                             name="email"
//                                             maxLength={45}
//                                             value={formValues.email}
//                                             onChange={handleChange}
//                                         />
//                                     </FormGroup>
//                                     <FormTextArea

//                                         fluid
//                                         error={!!erros.motivation && { content: erros.motivation }}
//                                         label={<label className="blue-label">Motivação</label>}
//                                         placeholder="Descreva sua motivação"
//                                         name="motivation"
//                                         maxLength={100}
//                                         minLength={10}
//                                         value={formValues.motivation}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                             </Form>
//                         </main>

//                         <footer className="wizard-footer">
//                             <Button type='submit' className="btn-internal-forms-back">
//                                 <Link to='/agendaDoacao'>
//                                     voltar
//                                 </Link>
//                             </Button>
//                             <Button type='submit' className="btn-internal-forms-continous" onClick={irParaEndereco}>Continuar</Button>
//                         </footer>
//                     </div>
//                     : null
//                 }
//                 {/* Step formulario endereço*/}
//                 {stepFormAndress ?
//                     <div className="wizard-form">
//                         <header className="wizard-header">
//                             {isMobile ?
//                                 /*Modo mobile para Step Endereço */
//                                 <div>
//                                     <Container textAlign="center">
//                                         <Breadcrumb>
//                                             <Icon name="check circle" size="large" className="color-label-circle-sucess" />
//                                             <BreadcrumbDivider icon='right chevron' />
//                                             <Label circular className="color-label-circle-active">2</Label>
//                                             <BreadcrumbDivider icon='right chevron' />
//                                             <Label circular className="color-label-circle">3</Label>
//                                         </Breadcrumb>
//                                     </Container>
//                                     <Divider horizontal>
//                                         <Header as='h4' className="header-form">
//                                             Endereço
//                                         </Header>
//                                     </Divider>
//                                 </div>
//                                 /*Modo computador para Step Endereço */
//                                 : <div>
//                                     <Container textAlign="center">
//                                         <Breadcrumb>
//                                             <Icon name="check circle" size="large" className="color-label-circle-sucess" />
//                                             <BreadcrumbSection>Contato</BreadcrumbSection>
//                                             <BreadcrumbDivider icon='right chevron' />
//                                             <Label circular className="color-label-circle-active">2</Label>
//                                             <BreadcrumbSection >Endereço</BreadcrumbSection>
//                                             <BreadcrumbDivider icon='right chevron' />
//                                             <Label circular className="color-label-circle">3</Label>
//                                             <BreadcrumbSection >Verificação</BreadcrumbSection>
//                                         </Breadcrumb>
//                                     </Container>
//                                     <Divider inverted />
//                                 </div>
//                             }
//                         </header>
//                         <main className="wizard-main">
//                             <Form>
//                                 <div className="form-inputs">
//                                     {/* Inputs dinâmicos de cada etapa */}
//                                     <FormInput
//                                         fluid
//                                         error={!!errorCep || (erros.address && erros.address.cep) ? { content: errorCep || erros.address.cep } : null}
//                                         // error={!!(erros.address && erros.address.cep) && { content: erros.address.cep }}
//                                         label={<label className="blue-label">CEP</label>}
//                                         placeholder="Digite seu CEP"
//                                         name="address.cep"
//                                         type="text"
//                                         maxLength={9}
//                                         minLength={9}
//                                         value={formValues.address.cep}
//                                         onChange={handleChange}
//                                     />
//                                     <FormGroup widths="equal">
//                                         <FormInput
//                                             fluid
//                                             error={!!(erros.address && erros.address.estado) && { content: erros.address.estado }}
//                                             label={<label className="blue-label">Estado</label>}
//                                             placeholder="Digite seu estado"
//                                             name="address.estado"
//                                             type="text"
//                                             maxLength={2}
//                                             minLength={2}
//                                             value={formValues.address.estado}
//                                             onChange={handleChange}
//                                         />
//                                         <FormInput
//                                             fluid
//                                             error={!!(erros.address && erros.address.cidade) && { content: erros.address.cidade }}
//                                             label={<label className="blue-label">Cidade</label>}
//                                             placeholder="Digite sua cidade"
//                                             name="address.cidade"
//                                             type="text"
//                                             maxLength={100}
//                                             minLength={3}
//                                             value={formValues.address.cidade}
//                                             onChange={handleChange}
//                                         />
//                                         <FormInput
//                                             fluid
//                                             error={!!(erros.address && erros.address.bairro) && { content: erros.address.bairro }}
//                                             label={<label className="blue-label">Bairro</label>}
//                                             placeholder="Digite seu bairro"
//                                             name="address.bairro"
//                                             type="text"
//                                             maxLength={100}
//                                             minLength={3}
//                                             value={formValues.address.bairro}
//                                             onChange={handleChange}
//                                         />
//                                     </FormGroup>
//                                     <FormGroup widths="equal">
//                                         <FormInput
//                                             fluid
//                                             error={!!(erros.address && erros.address.rua) && { content: erros.address.rua }}
//                                             label={<label className="blue-label">Rua</label>}
//                                             placeholder="Digite sua rua"
//                                             name="address.rua"
//                                             type="text"
//                                             maxLength={100}
//                                             minLength={3}
//                                             value={formValues.address.rua}
//                                             onChange={handleChange}
//                                         />
//                                         <FormInput
//                                             fluid
//                                             error={!!(erros.address && erros.address.numero) && { content: erros.address.numero }}
//                                             label={<label className="blue-label">Número</label>}
//                                             placeholder="Digite o número de sua residência"
//                                             name="address.numero"
//                                             type="text"
//                                             maxLength={6}
//                                             minLength={1}
//                                             value={formValues.address.numero}
//                                             onChange={handleChange}
//                                         />
//                                     </FormGroup>
//                                 </div>
//                             </Form>
//                         </main>

//                         <footer className="wizard-footer">
//                             <Button type='submit' className="btn-internal-forms-back" onClick={voltarParaContato}>Voltar</Button>
//                             <Button type='submit' className="btn-internal-forms-continous" onClick={irParaVerificacao}>Continuar</Button>
//                         </footer>
//                     </div>

//                     : null
//                 }
//                 {/* Step formulario Verificação*/}
//                 {stepVerification ?
//                     <div className="wizard-form">
//                         <header className="wizard-header">
//                             {isMobile ?
//                                 /*Modo mobile para Step Verificação */
//                                 <div>
//                                     <Container textAlign="center">
//                                         <Breadcrumb>
//                                             <Icon name="check circle" size="large" className="color-label-circle-sucess" />
//                                             <BreadcrumbDivider icon='right chevron' />
//                                             <Icon name="check circle" size="large" className="color-label-circle-sucess" />
//                                             <BreadcrumbDivider icon='right chevron' />
//                                             <Label circular className="color-label-circle-active">3</Label>
//                                         </Breadcrumb>
//                                     </Container>
//                                     <Divider horizontal>
//                                         <Header as='h4' className="header-form">
//                                             Verificação
//                                         </Header>
//                                     </Divider>
//                                 </div>
//                                 /*Modo computador para Step Verificação */
//                                 : <div>
//                                     <Container textAlign="center">
//                                         <Breadcrumb>
//                                             <Icon name="check circle" size="large" className="color-label-circle-sucess" />
//                                             <BreadcrumbSection>Contato</BreadcrumbSection>
//                                             <BreadcrumbDivider icon='right chevron' />
//                                             <Icon name="check circle" size="large" className="color-label-circle-sucess" />
//                                             <BreadcrumbSection >Endereço</BreadcrumbSection>
//                                             <BreadcrumbDivider icon='right chevron' />
//                                             <Label circular className="color-label-circle-active">3</Label>
//                                             <BreadcrumbSection >Verificação</BreadcrumbSection>
//                                         </Breadcrumb>
//                                     </Container>
//                                     <Divider inverted />
//                                 </div>
//                             }
//                         </header>
//                         <main className="wizard-main">
//                             <Form>
//                                 <div className="form-inputs">
//                                     {/* Inputs dinâmicos de cada etapa */}
//                                     <FormInput
//                                         fluid
//                                         error={!!erros.codigoVerificacao && { content: erros.codigoVerificacao }}
//                                         label={<label className="blue-label">Código de verificação</label>}
//                                         placeholder="Digite o código de verificação"
//                                         name="codigoVerificacao"
//                                         type="text"
//                                         maxLength={20}
//                                         value={codigo.codigoVerificacao}
//                                         onChange={handleChange}
//                                     />
//                                     {msgCodigo ?
//                                         <p className="msg-codigo-verificacao">
//                                             Um código foi enviado para o número <b>{formValues.phone}</b>.
//                                         </p>
//                                         :
//                                         null}
//                                     {
//                                         buttonAtivo ?
//                                             <button type="submit" className="btn-enviar-codigo" onClick={enviarCodigo}>
//                                                 Enviar código
//                                             </button> :
//                                             <button type="submit" className="btn-enviar-codigo-inativo">
//                                                 Enviar código
//                                             </button>
//                                     }
//                                     <div className="div-nao-recebeu-codigo">
//                                         <p>Não recebeu o código?</p>
//                                         <p className="reenviar-codigo" onClick={enviarCodigo}>Clique aqui para reenviar</p>
//                                     </div>
//                                     <Checkbox
//                                         label={
//                                             <label>Ao aceitar, você concorda com os Termos de Uso e
//                                                 Política de Privacidade do site
//                                             </label>
//                                         }
//                                         defaultChecked
//                                     />
//                                 </div>
//                             </Form>
//                         </main>
//                         <footer className="wizard-footer">
//                             <Button type='submit' className="btn-internal-forms-back" onClick={voltarParaEndereco}>Voltar</Button>
//                             <Button type='submit' className="btn-internal-forms-continous" onClick={enviarFormulario}>Enviar</Button>
//                         </footer>
//                     </div>
//                     : null
//                 }
//             </div>
//         </>
//     )
// }

// export default FormDoador;