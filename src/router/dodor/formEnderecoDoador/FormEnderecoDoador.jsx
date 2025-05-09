import React, { useState } from "react";
import { Form, FormInput, Button } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import "../formEnderecoDoador/FormEnderecoDoador.css";
import HeaderT from "../../../components/Header";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function FormEnderecoDoador() {
    const [endereco, setEndereco] = useState({
        cep: "44001-123",
        estado: "BA",
        cidade: "Feira de Santana",
        bairro: "Centro",
        rua: "Rua das Flores",
        numero: "123",
    });

    const [nome] = useState("João da Silva");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEndereco((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: "success",
            title: "Endereço salvo com sucesso!",
            text: "Agora você pode selecionar os itens para doação.",
            timer: 3000,
            showConfirmButton: false,
        }).then(() => {
            // Redireciona para a tela de CategoriaDoacao após o alerta
            // Passando um ID fictício como exemplo
            navigate("/categoriaDoacao", { state: { id: 123 } });
        });
    };

    return (
        <>
            <HeaderT title1="Agende sua" title2="Doação" />
            <div className="container-external-enderecoDoador">
                <div className="container-enderecoDoador-internal-title">
                    <h3>Olá, {nome} <br /> Seja bem-vindo!</h3>
                </div>
                <div className="container-enderecoDoador-internal-main">
                    <Form onSubmit={handleSubmit}>
                        <FormInput
                            label="CEP"
                            name="cep"
                            value={endereco.cep}
                            onChange={handleChange}
                            maxLength={9}
                        />
                        <FormInput
                            label="Estado"
                            name="estado"
                            value={endereco.estado}
                            onChange={handleChange}
                            maxLength={2}
                        />
                        <FormInput
                            label="Cidade"
                            name="cidade"
                            value={endereco.cidade}
                            onChange={handleChange}
                            maxLength={100}
                        />
                        <FormInput
                            label="Bairro"
                            name="bairro"
                            value={endereco.bairro}
                            onChange={handleChange}
                            maxLength={100}
                        />
                        <FormInput
                            label="Rua"
                            name="rua"
                            value={endereco.rua}
                            onChange={handleChange}
                            maxLength={100}
                        />
                        <FormInput
                            label="Número"
                            name="numero"
                            value={endereco.numero}
                            onChange={handleChange}
                            maxLength={7}
                        />
                        <Button type="submit" color="blue">
                            Confirmar Endereço
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default FormEnderecoDoador;