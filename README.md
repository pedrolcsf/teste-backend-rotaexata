# Teste Backend RotaExata

## Descrição
Aplicação backend desenvolvida com Node.js, Express e PostgreSQL. Implementa autenticação JWT e um CRUD para gerenciar dados de endereços.

```importe o arquivo: 'insomnia_collection' no insomnia para realizar os testes nas rotas ```

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

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
    ```env
    DB_HOST=localhost
    DB_NAME=rotaexata
    DB_USER=rotaexata
    DB_PASSWORD=rotaexata123
    JWT_SECRET=secret_rotaexata
    JWT_EXPIRES_IN=1d
    SHARED_SECRET_KEY=shared_secret_rotaexata

    NODE_ENV=development
    ```

4. Execute o banco de dados com Docker:
    ```bash
    docker-compose up
    ```

5. Execute as migrations:
    ```bash
    npx sequelize db:migrate
    ```

6. Execute a aplicação
    ```bash
    npm run dev
    ```

## Testes
- `Jest`

### Como executar
5. Execute os testes:
    ```bash
    npm run test
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
