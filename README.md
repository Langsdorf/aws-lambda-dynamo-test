# AWS LAMBDA + DYNAMODB

## Tópicos
  - ### [Uso](#uso)
  - ### [Testes](#testes)
  - ### [Limpeza](#limpeza)
  - ### [Estrutura de arquivos](#estrutura-de-arquivos)


## Uso

### Deploy

Instale as dependências:

```
npm install
```

Depois, rode o comando:

```
npm run deploy
```

Será gerado o arquivo JavaScript e iniciará o deploy para AWS com o Serverless Framework.

> Talvez seja necessário realizar o login no console da AWS
> 
> A as configurações do DynamoDB e outras estão no arquivo `serverless.yml`

Após o deploy, será mostrado a URL pública da aplicação que está liberada para todos por padrão (sem auth)

> _A região padrão é us-east-1_

### Chamar API

Após o deploy, os seguintes endpoints estarão disponíveis:

__Substitua o xxxxxx pelo nome gerado no deploy (será mostrado no console após a realização dos passos acima)__

#### Criar funcionário

`POST https://xxxxxx.execute-api.us-east-1.amazonaws.com/employees`

```bash
curl -X POST "https://xxxxxx.execute-api.us-east-1.amazonaws.com/employees" -H "Content-Type: application/json" --data-raw '{"id": 1, "name": "Nome", "age": 0, "role": "admin"}'
```

#### Listar todos os funcionários

`GET https://xxxxxx.execute-api.us-east-1.amazonaws.com/employees`

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/employees
```

#### Pegar informações de um funcionário

`GET https://xxxxxx.execute-api.us-east-1.amazonaws.com/employees/:uuid`

```bash
export UUID=uuid && curl "https://xxxxxxx.execute-api.us-east-1.amazonaws.com/employees/$UUID" && unset UUID
```

#### Deletar um funcionário

`DELETE https://xxxxxx.execute-api.us-east-1.amazonaws.com/employees/:uuid`

```bash
export UUID=uuid && curl -X DELETE "https://xxxxxxx.execute-api.us-east-1.amazonaws.com/employees/$UUID" && unset UUID
```

#### Atualizar um funcionário

`PUT https://xxxxxx.execute-api.us-east-1.amazonaws.com/employees/:uuid`

```bash
export UUID=uuid && curl -X PUT "https://xxxxxx.execute-api.us-east-1.amazonaws.com/employees/$UUID" -H 'Content-Type: application/json' --data-raw '{"id": 2, "name": "Nome2", "age": 1, "role": "admin2"}' && unset UUID
```

## Testes

> **Antes de rodar os testes, altere a URL em `tests/tests.ts` para a URL pública da sua aplicação.**

Rode os testes usando:

```bash
npm run test
```

## Limpeza

Para remover o que foi criado na AWS, execute o comando:

```bash
npm run clear
```

> Será deletada a pilha criada pelo Serverless, juntamente com a tabela do DynamoDB.


## Estrutura de arquivos:

```
|-- src\
|---- main.ts           # arquivo principal, aqui está todas as funções
|-- tests\
|---- tests.ts          # Arquivo de testes unitários
|-- serverless.yml      # arquivo de configuração do Serverless Framework
```

_Saiba mais sobre o Serverless Framework [aqui](https://www.serverless.com/framework/docs/getting-started)_
