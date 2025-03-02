/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

import contrato from '../contracts/usuarios.contrato.js'

const novoNome = faker.person.fullName();
    const novoEmail = faker.internet.email();

describe('Testes da Funcionalidade Usuários', () => {

  let token
  beforeEach(() => {
    cy.token('fulano@qa.com' , 'teste').then(tkn =>{
      token = tkn
    })
  });

  it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response =>{
            return contrato.validateAsync(response.body)
          })
});

});

  it('Deve listar usuários cadastrados - GET', () => {
     cy.request({
      method: 'GET',
      url: 'usuarios'
         }).should((response) => {
          expect(response.status).equal(200)
          expect(response.body).to.have.property('usuarios')
         })
  });

  it('Deve cadastrar um usuário com sucesso - POST', () => {
    
    cy.request({
      method: 'POST',
      url:  'usuarios',
      body: {
        "nome": (faker.person.fullName()),
        "email": (faker.internet.email()),
        "password": "teste",
        "administrador": "true"   
      }
}).should((response) => {
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido - POST', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": "Fulano da Silva",
        "email": "beltrano@qa.com.br",
        "password": "teste",
        "administrador": "true"
      },
      failOnStatusCode: false
         }).should((response) => {
          expect(response.status).equal(400)
          expect(response.body.message).equal("Este email já está sendo usado")
         })
     
  });

  it('Deve editar um usuário previamente cadastrado - PUT', () => {
  
    cy.request({
      method: 'POST',
      url:  'usuarios',
      body: {
        "nome": (faker.person.fullName()),
        "email": (faker.internet.email()),
        "password": "teste",
        "administrador": "true"   
      }
}).then(response => {
      let id = response.body._id
      cy.request('PUT', `usuarios/${id}`, {
        nome: novoNome,
        email: novoEmail,
        password: 'teste',
        administrador: 'true',
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
      })
    })
       
  it('Deve deletar um usuário previamente cadastrado - DELETE', () => {
      cy.request({
      method: 'POST',
      url:  'usuarios',
      body: {
        "nome": (faker.person.fullName()),
        "email": (faker.internet.email()),
        "password": "teste",
        "administrador": "true"   
      }
}).then((response) => {
  expect(response.status).to.eq(201);
  let id = response.body._id
  cy.request('DELETE', `usuarios/${id}`)
  .then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.message).to.equal('Registro excluído com sucesso')
  });

});
});
    
