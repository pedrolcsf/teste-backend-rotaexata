# Teste Backend RotaExata

## Descrição
Aplicação backend desenvolvida com Node.js, Express e PostgreSQL. Implementa autenticação JWT e um CRUD para gerenciar dados de endereços.

## Como Executar

### Requisitos
- Node.js
- Docker
- Docker Compose

### Configuração
1. Clone o repositório:
    ```bash
    git clone git@github.com:pedrolcsf/teste-backend-rotaexata.git
    cd teste-backend-rotaexata
    ```

2. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
    ```env
    DB_HOST=db
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=1d
    ```

3. Execute a aplicação com Docker:
    ```bash
    docker-compose up
    ```

### Endpoints

#### Autenticação
- `POST /user`: Registrar um novo usuário.
- `POST /login`: Autenticar um usuário.

#### Endereços
- `POST /addresses`: Criar um novo endereço.
- `GET /addresses`: Listar endereços do usuário autenticado.
- `PUT /addresses/:id`: Atualizar um endereço do usuário autenticado.
- `DELETE /addresses/:id`: Deletar um endereço do usuário autenticado.

#### Compartilhamento
- `POST /addresses/:id/share`: Compartilhar um endereço.
- `GET /shared/:token`: Acessar um endereço compartilhado.