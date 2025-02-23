## Descrição
Sistema Fullstack para gerenciamento de pedidos de clientes, utilizando FastAPI no backend, Next.js no frontend e banco de dados PostgreSQL.
O sistema permite o cadastro, edição, listagem e remoção de pedidos, além de exibir um indicador de quantidade média de pedidos por cliente.

Tecnologias Utilizadas
Frontend: Next.js (100% client-side)
Backend: FastAPI (Python)
Banco de Dados: PostgreSQL
ORM: SQLAlchemy
Migrations: Alembic
Funcionalidades
CRUD de pedidos (Criar, Ler, Atualizar, Deletar)
Indicador de quantidade média de pedidos por cliente
Exportação de pedidos para CSV
Integração entre frontend e backend via API REST
Documentação interativa da API (Swagger)

### Endpoints Principais
POST /api/pedidos/ - Criar um novo pedido
GET /api/pedidos/ - Listar todos os pedidos
GET /api/pedidos/{id} - Obter detalhes de um pedido
PUT /api/pedidos/{id} - Atualizar um pedido
DELETE /api/pedidos/{id} - Deletar um pedido
GET /api/indicador/ - Obter o indicador de quantidade média de pedidos por cliente

### Funcionalidades
CRUD Completo de Pedidos (Criar, Listar, Atualizar, Deletar)
Indicador: Quantidade média de pedidos por cliente
Exportação de Dados: Exportar pedidos em CSV
Integração: Frontend e Backend via API REST

## Configuração do Ambiente
Backend (FastAPI)
## cd backend

## Crie e ative o ambiente virtual:


python -m venv venv
source venv/bin/activate  
venv\Scripts\activate   

## Considerações Finais

Sistema 100% funcional com integração entre frontend e backend.
API documentada utilizando Swagger.
Estrutura modularizada e escalável.
Suporte a exportação de dados em CSV.
Configuração simples e rápida para desenvolvimento local.