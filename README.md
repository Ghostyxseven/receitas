# Receitas — Sistema de Gerenciamento de Receitas e Categorias

Aplicação em camadas (SRP) construída com Node.js, TypeScript e Express, com contêiner simples de injeção de dependências. Inclui serviços de negócio, repositórios em memória e API HTTP.

## Sumário
- Visão Geral
- Arquitetura
- Pré-requisitos
- Instalação
- Execução
- Endpoints
- Exemplos rápidos (Windows)
- Estrutura do projeto

## Visão Geral
- CRUD de Categorias, Ingredientes e Receitas.
- Busca e filtragem de receitas por `categoryId` e por texto (`search`).
- Regras de negócio:
  - Unicidade de nome para Categoria e Ingrediente.
  - Receita deve referenciar uma Categoria existente.
  - Bloqueio de exclusão de Categoria quando houver Receitas relacionadas.

## Arquitetura Simplificada (2 Camadas)
- `core`: Contém toda a lógica de negócio, modelos de dados, interfaces e acesso aos dados (armazenamento em memória).
- `presentation`: API HTTP (Express), rotas e configuração do servidor.

O projeto aplica o princípio da **Inversão de Dependência (DIP)**:
- A camada `presentation` depende de **interfaces** definidas no `core` (`ICategoryService`, etc.), e não das implementações concretas.
- Isso desacopla as camadas e facilita testes e manutenção.

### Estrutura do Código
- Servidor e rotas: `src/presentation/http`.
- Interfaces (Contratos): `src/core/interfaces`.
- Implementação de Serviços: `src/core/*Service.ts`.
- Modelos e DTOs: `src/core/models.ts`.
- Dados em memória: `src/core/store.ts`.

### Documentação Visual
Diagramas UML estão disponíveis na pasta `docs/diagrams`:
- `package-diagram.puml`: Visão geral das camadas e componentes.
- `class-diagram.puml`: Detalhes das classes, interfaces e relacionamentos.
- `use-case-diagram.puml`: Casos de uso e interações do usuário.

### Fluxo de Dados
1. Requisição HTTP chega na `presentation`.
2. Controller/Rota chama o `Service` correspondente no `core`.
3. `Service` valida regras e manipula o `store` (banco de dados em memória).
4. Resposta retorna pela `presentation`.

## Pré-requisitos
- Node.js 18+ (recomendado 20+)
- npm 9+

## Instalação
1. Baixar o repositório:
   ```bash
   git clone https://github.com/mayllonveras/receitas/
   cd receitas
   ```
2. Instalar dependências:
   ```bash
   npm install
   ```

## Execução
- Desenvolvimento:
  ```bash
  npm run dev
  ```
- Produção local:
  ```bash
  npm run build
  npm start
  ```
- Porta: `PORT` (opcional). Padrão `3000`.

## Endpoints
Categorias
- `GET /categories` — lista todas
- `GET /categories/:id` — detalhe
- `POST /categories` — cria `{ name }`
- `PUT /categories/:id` — atualiza `{ name? }`
- `DELETE /categories/:id` — remove (bloqueado se houver receitas)

Ingredientes
- `GET /ingredients` — lista todos
- `GET /ingredients/:id` — detalhe
- `POST /ingredients` — cria `{ name }`
- `PUT /ingredients/:id` — atualiza `{ name? }`
- `DELETE /ingredients/:id` — remove

Receitas
- `GET /recipes?categoryId=&search=` — lista com filtros (apenas publicadas)
- `GET /recipes/:id` — detalhe
- `POST /recipes` — cria `{ title, description?, ingredients: [{ ingredientId, quantity, unit }], steps[], categoryId, portions, status? }`
- `PUT /recipes/:id` — atualiza parcial dos mesmos campos (bloqueado se arquivada)
- `DELETE /recipes/:id` — remove (bloqueado se publicada)
- `POST /recipes/:id/publish` — publica receita (draft → published)
- `POST /recipes/:id/archive` — arquiva receita (→ archived)
- `POST /recipes/:id/scale` — escala porções `{ portions: number }` (não persiste)
- `POST /recipes/shopping-list` — gera lista de compras `{ recipeIds: string[] }` (não persiste)

Códigos de erro: as validações retornam `400` com `{ error: "mensagem" }` (middleware em `src/presentation/http/middlewares/errorHandler.ts`).

## Clientes HTTP (Insomnia/Postman)
- A pasta `requests` contém coleções de requisições prontas:
  - `Insomnia_recipes_requests.yaml`: Coleção completa para importação direta no **Insomnia**.
  - `recipes_requests.yaml`: Especificação OpenAPI/Swagger (se aplicável) ou coleção genérica.
- Base URL: `http://localhost:3000` (ajuste `PORT` se necessário).
- Headers: `Content-Type: application/json` para requisições com corpo.
- Fluxo sugerido:
  - Criar Categoria
    - Método: `POST`
    - URL: `/categories`
    - Body (raw JSON): `{ "name": "Sobremesa" }`
  - Criar Ingrediente
    - Método: `POST`
    - URL: `/ingredients`
    - Body: `{ "name": "Leite" }`
  - Criar Receita
    - Método: `POST`
    - URL: `/recipes`
    - Body:
      ```json
      {
        "title": "Pavê de chocolate",
        "description": "Camadas de biscoito e creme",
        "ingredients": [
          { "name": "biscoito", "quantity": 200, "unit": "g" },
          { "name": "creme", "quantity": 300, "unit": "ml" },
          { "name": "chocolate", "quantity": 100, "unit": "g" }
        ],
        "steps": ["misturar", "montar", "gelar"],
        "servings": 8,
        "categoryId": "<ID_DA_CATEGORIA>"
      }
      ```
- Listagens e filtros:
  - `GET /categories`, `GET /ingredients`, `GET /recipes`
  - `GET /recipes?categoryId=<ID>` para filtrar por categoria
  - `GET /recipes?search=<texto>` para buscar por título/descrição/ingredientes
- Dicas de uso:
  - Crie um ambiente com variável `base_url` e use `{{ base_url }}` nas requisições.
  - Salve exemplos de corpo usando os arquivos em `requests/`.

## Exemplos rápidos (Windows PowerShell)
- Criar categoria usando arquivo:
  ```powershell
  curl.exe -s -X POST http://localhost:3000/categories -H "Content-Type: application/json" --data @requests/category.json
  ```
- Criar ingrediente usando arquivo:
  ```powershell
  curl.exe -s -X POST http://localhost:3000/ingredients -H "Content-Type: application/json" --data @requests/ingredient.json
  ```
- Criar receita (ajuste `categoryId`):
  ```powershell
  curl.exe -s -X POST http://localhost:3000/recipes -H "Content-Type: application/json" --data @requests/recipe.json
  ```
- Listar categorias:
  ```powershell
  curl.exe -s http://localhost:3000/categories
  ```
- Listar ingredientes:
  ```powershell
  curl.exe -s http://localhost:3000/ingredients
  ```
- Filtrar receitas por texto:
  ```powershell
  curl.exe -s "http://localhost:3000/recipes?search=chocolate"
  ```

## Estrutura do projeto
```
receitas/
├─ src/
│  ├─ core/
│  │  ├─ CategoryService.ts
│  │  ├─ IngredientService.ts
│  │  ├─ RecipeService.ts
│  │  ├─ models.ts
│  │  └─ store.ts
│  └─ presentation/
│     └─ http/
│        ├─ middlewares/errorHandler.ts
│        ├─ routes/categories.ts
│        ├─ routes/ingredients.ts
│        ├─ routes/recipes.ts
│        └─ server.ts
├─ requests/
│  ├─ category.json
│  ├─ ingredient.json
│  ├─ ingredient-update.json
│  ├─ recipe.json
│  ├─ Insomnia_recipes_requests.yaml
│  └─ recipes_requests.yaml
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Composição do servidor
- O servidor instancia diretamente os repositórios em memória e os serviços.

### Observação sobre DTOs de criação
- Os repositórios recebem entidades já criadas com `id` e `createdAt` (gerados pela fábrica/serviço).
- As requisições HTTP enviam apenas os campos de entrada (ex.: `{ name }` para categoria/ingrediente; `{ title, description?, ingredients[], steps[], categoryId }` para receita).

## Scripts
- `npm run dev` — inicia em modo desenvolvimento (ts-node)
- `npm run build` — compila TypeScript
- `npm start` — executa o build compilado

## Plano de Trabalho em Equipe

Este documento descreve o plano dividido por pessoa com passos claros de execução, testes e critérios de aceite.

### Fluxo de Trabalho em Git e Integração

**Base**: fazer fork do repositório oficial e clonar localmente.

**Branch de integração**: trabalhar sempre a partir de `dev`. Nunca codar direto na `main`.

**Pull Requests**: cada pessoa abre PR da sua branch para `dev`. Depois, você integra `dev` → `main`.

#### Comandos Essenciais de Git

- Criar branch:
  ```bash
  git checkout dev && git pull && git checkout -b feature/nome-da-feature
  ```

- Commit e push:
  ```bash
  git add . && git commit -m "feat: descrição" && git push -u origin feature/nome-da-feature
  ```

- Abrir PR: pelo GitHub, de `feature/nome-da-feature` para `dev`

---

### Ingrediente (Nilson)

**Branch**: `feature/ingrediente-nilson`

**Objetivo**: Criar e validar CRUD de ingrediente sem mexer em regras de negócio.

#### Passos

1. Criar 1 ingrediente: usar endpoint `POST /ingredients` com body mínimo válido.
2. Listar ingredientes: `GET /ingredients` e confirmar o criado aparece.
3. Consultar por id: `GET /ingredients/:id`.
4. Atualizar: `PUT /ingredients/:id` com um campo simples (ex.: nome).
5. Excluir: `DELETE /ingredients/:id` e confirmar remoção na listagem.

#### Testes (Insomnia/Postman)

- Criar: `POST /ingredients` com `{ "name": "Farinha", "unit": "g" }`.
- Listar: `GET /ingredients` deve retornar um array com "Farinha".
- **Aceite**: respostas 2xx para operações válidas, 404 para buscar id inexistente.

---

### Categoria (Ana Rosa)

**Branch**: `feature/categoria-ana-rosa`

**Objetivo**: CRUD de categoria e ver se aparece na receita quando vinculada.

#### Passos

1. Criar 1 categoria: `POST /categories` com `{ "name": "Sobremesa" }`.
2. Listar categorias: `GET /categories`.
3. Vincular na receita: ao criar uma receita (Pessoa 3), usar `categoryId` dessa categoria.
4. Ver na receita: `GET /recipes/:id` deve mostrar `categoryId` e/ou nome da categoria conforme o modelo.

#### Testes

- Criar: `POST /categories` com nome único.
- Listar: `GET /categories` retorna array contendo a categoria.
- **Aceite**: receita criada pela Pessoa 3 deve referenciar essa categoria corretamente.

---

### Receita (Gisele)

**Branch**: `feature/receita-gisele`

**Objetivo**: Criar 1 receita, adicionar ingredientes, testar criação e listagem.

#### Passos

1. **Pré-requisitos**: usar categoria criada pela Pessoa 2 e ingredientes da Pessoa 1.
2. Criar receita: `POST /recipes`
   - Body contendo: `title`, `description`, `steps`, `categoryId`, `portions`, `ingredients` (com `ingredientId`, `quantity`, `unit`).
3. Listar receitas: `GET /recipes` e verificar a presença da receita.
4. Consultar por id: `GET /recipes/:id`.

#### Testes

- Criar: `POST /recipes` com um exemplo completo.
- Listar: `GET /recipes` deve incluir sua receita.
- **Aceite**: receita retorna com todos campos, ingredientes referenciam ids válidos.

---

Regra de Porções (Escalonamento) (Wesley)

**Branch**: `feature/regra-porcoes-wesley`

**Objetivo**: Implementar escalonamento de porções com endpoint específico, sem persistir.

#### Passos

1. Criar método no serviço: `scaleRecipe(recipeId, portions)` que:
   - Valida `portions > 0`.
   - Busca receita; erro se não existir.
   - Calcula fator `portions / receita.portions`.
   - Retorna a receita ajustada com ingredientes escalados e `portions` atualizado.
   - **Não chama** `create/update` no repositório.
2. Criar endpoint: `POST /recipes/:id/scale` com body `{ "portions": 8 }` ou `GET /recipes/:id/scale?portions=8`.
3. Erros: 400 para `portions <= 0`, 404 para receita inexistente.

#### Testes

- Válido: escalar receita da Pessoa 3 de 4 para 8 porções; quantidades dobram.
- Inválido: `portions = 0` retorna erro; id inexistente retorna erro.
- **Aceite**: resposta de escalonamento não altera a receita original em listagens.

---

 Lista de Compras (Marcos)

**Branch**: `feature/lista-compras-marcos`

**Objetivo**: Implementar lista de compras consolidada por várias receitas, sem persistência.

#### Passos

1. Criar método no serviço: `consolidateShoppingList(recipeIds: string[])` que:
   - Valida array não vazio.
   - Busca cada receita; erro se algum id inválido.
   - Consolida ingredientes por par `(ingredientId, unit)`.
   - Soma `quantity` e retorna lista com `{ ingredientId, ingredientName, unit, totalQuantity }`.
2. Criar endpoint: `POST /recipes/shopping-list` com body `{ "recipeIds": ["id1", "id2"] }`.
3. Regra: unidades diferentes não se misturam; aparecem em linhas separadas.

#### Testes

- Duas receitas com mesmo ingrediente e mesma unidade: somar quantidades.
- Mesmo ingrediente com unidade diferente: linhas separadas.
- **Aceite**: resposta retorna somente a lista consolidada; nenhum recurso é criado.

---

Estados da Receita (Josiane)

**Branch**: `feature/estado-receita-josiane`

**Objetivo**: Implementar estados `draft`, `published`, `archived` e aplicar regras:
- Não apagar publicada (apenas arquivar).
- Não editar arquivada.
- Apenas publicadas aparecem em listagem pública.

#### Passos

1. **Modelo**: adicionar `status: 'draft' | 'published' | 'archived'` com default `'draft'`.
2. **Serviço**: regras em `update`, `delete`, `list`:
   - `update`: bloquear se `status === 'archived'`.
   - `delete`: bloquear se `status === 'published'`, mensagem clara sugerindo arquivar.
   - `list` pública: retornar somente `status === 'published'`.
3. **Endpoints de estado**:
   - `POST /recipes/:id/publish` → muda `draft` → `published` (bloquear se `archived`).
   - `POST /recipes/:id/archive` → muda para `archived`.

#### Testes

- Publicar: criar receita (Pessoa 3), `POST /recipes/:id/publish`, depois listar pública.
- Arquivar: `POST /recipes/:id/archive`, tentar `PUT` e receber erro.
- Excluir publicada: tentar `DELETE` e receber erro; após arquivar, pode excluir.
- **Aceite**: regras respeitadas em todas operações.


Integração e Revisão (Micael)

**Branch**: `dev` (e merge final em `main`)

**Objetivo**: Ajudar os outros 6, resolver conflitos, revisar PRs, atualizar README, garantir integração.

#### Passos

1. **Revisão técnica**: checar arquitetura (`presentation` usa somente serviços do `core`), mensagens de erro consistentes, nada acessa o `store` direto da `presentation`.
2. **Testes integrados**: executar fluxo completo:

### Observações sobre Funcionalidades Novas

#### Escalonamento de Porções

#### Lista de Compras

#### Estados da Receita