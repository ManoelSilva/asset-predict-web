[Read in English](README.md)

# Asset Predict Web

Asset Predict Web é uma aplicação frontend Angular que fornece uma interface de usuário para o sistema Asset Predict. Permite que os usuários pesquisem ativos do mercado de ações brasileiro e obtenham predições de preços baseadas em IA.

## Funcionalidades

- **Busca de Ativos**: Pesquisar e selecionar ativos do mercado de ações brasileiro com autocompletar
- **Predições de Preços**: Obter predições de direção de preços baseadas em IA para ativos selecionados
- **Dados em Tempo Real**: Conectar a dados ao vivo do serviço asset-data-lake
- **Design Responsivo**: Interface Material Design moderna que funciona em desktop e mobile
- **Histórico de Predições**: Visualizar predições anteriores com timestamps

## Arquitetura

A aplicação é construída com:
- **Angular 20.3**: Framework Angular moderno com componentes standalone
- **Angular Material**: Componentes Material Design para interface consistente
- **TypeScript**: Desenvolvimento type-safe
- **RxJS**: Programação reativa para manipulação de dados

## Integração da API

O frontend integra com dois serviços backend:

### API Asset Data Lake (Porta 5002)
- **URL Base**: `http://localhost:5002` (desenvolvimento)
- **Endpoints**:
  - `GET /assets` - Pesquisar e listar ativos disponíveis
  - `GET /asset/<ticker>` - Obter informações de ativo específico

### API de Predição do Modelo (Porta 5001)
- **URL Base**: `http://localhost:5001/api/b3` (desenvolvimento)
- **Endpoints**:
  - `POST /predict` - Obter predições de preços para um ticker

## Estrutura do Projeto

```
src/
├── app/
│   ├── app.ts              # Componente principal da aplicação
│   ├── app.html            # Template principal
│   ├── app.scss            # Estilos principais
│   ├── app.config.ts       # Configuração da aplicação
│   └── app.spec.ts         # Testes unitários
├── environments/
│   ├── environment.ts      # Configuração do ambiente de desenvolvimento
│   └── environment.prod.ts # Configuração do ambiente de produção
├── index.html              # Arquivo HTML principal
├── main.ts                 # Bootstrap da aplicação
└── styles.scss             # Estilos globais
```

## Configuração de Ambiente

### Ambiente de Desenvolvimento
```typescript
export const environment = {
  production: false,
  predictionUrl: 'http://localhost:5001/api/b3',
  assetsUrl: 'http://localhost:5002'
};
```

### Ambiente de Produção
Atualize `environment.prod.ts` com suas URLs de API de produção:
```typescript
export const environment = {
  production: true,
  predictionUrl: 'http://seu-ip-ec2:5001/api/b3',
  assetsUrl: 'http://seu-ip-ec2:5002'
};
```

Este projeto foi gerado usando o [Angular CLI](https://github.com/angular/angular-cli) versão 20.3.1.

## Servidor de desenvolvimento

Para iniciar um servidor de desenvolvimento local, execute:

```bash
ng serve
```

Após o servidor iniciar, abra seu navegador e acesse `http://localhost:4200/`. A aplicação será recarregada automaticamente sempre que você modificar qualquer arquivo fonte.

## Geração de código (Scaffolding)

O Angular CLI inclui ferramentas poderosas de geração de código. Para gerar um novo componente, execute:

```bash
ng generate component nome-do-componente
```

Para uma lista completa de esquemas disponíveis (como `components`, `directives` ou `pipes`), execute:

```bash
ng generate --help
```

## Build

Para compilar o projeto, execute:

```bash
ng build
```

Isso irá compilar seu projeto e armazenar os artefatos de build no diretório `dist/`. Por padrão, o build de produção otimiza sua aplicação para performance e velocidade.

## Executando testes unitários

Para executar testes unitários com o [Karma](https://karma-runner.github.io), utilize o comando:

```bash
ng test
```

## Executando testes end-to-end

Para testes end-to-end (e2e), execute:

```bash
ng e2e
```

O Angular CLI não inclui um framework de testes end-to-end por padrão. Você pode escolher o que melhor se adequa às suas necessidades.

## Deploy

### Build de Produção

```bash
ng build --configuration production
```

Os artefatos de build serão armazenados no diretório `dist/`.

### Deploy AWS EC2

A aplicação é deployada no AWS EC2 usando nginx:

1. **Build da aplicação**
   ```bash
   ng build --configuration production
   ```

2. **Deploy usando o script fornecido**
   ```bash
   sudo bash deploy_asset_predict_web.sh
   ```

3. **Acessar a aplicação**
   - URL: `http://seu-ip-ec2/`
   - Servida via nginx na porta 80

### Configuração Nginx

O script de deploy usa uma configuração nginx customizada:
- **Arquivo**: `asset-predict-web-nginx.conf`
- **Localização**: `/etc/nginx/conf.d/asset-predict-web.conf`
- **Recursos**: Roteamento SPA, servir arquivos estáticos, compressão gzip

## Fluxo de Desenvolvimento

### Pré-requisitos
- Node.js 18+ e npm
- Angular CLI: `npm install -g @angular/cli`

### Desenvolvimento Local
1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desenvolvimento**
   ```bash
   ng serve
   ```

3. **Acessar aplicação**
   - URL: `http://localhost:4200/`
   - Hot reload habilitado para desenvolvimento

### Testes
```bash
# Testes unitários
ng test

# Testes end-to-end (se configurado)
ng e2e
```

## Configuração da API

### Atualizando Endpoints da API

Para alterar endpoints da API, atualize os arquivos de ambiente:

**Desenvolvimento** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  predictionUrl: 'http://localhost:5001/api/b3',
  assetsUrl: 'http://localhost:5002'
};
```

**Produção** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  predictionUrl: 'http://sua-api-producao:5001/api/b3',
  assetsUrl: 'http://sua-api-producao:5002'
};
```

## Solução de Problemas

### Problemas Comuns

1. **Erros de Conexão da API**
   - Verificar se os serviços backend estão rodando
   - Verificar URLs da API nos arquivos de ambiente
   - Verificar configuração CORS no backend

2. **Erros de Build**
   ```bash
   # Limpar node_modules e reinstalar
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Problemas de Deploy**
   - Verificar se nginx está rodando: `sudo systemctl status nginx`
   - Verificar logs do nginx: `sudo tail -f /var/log/nginx/error.log`
   - Verificar permissões de arquivo: `sudo chown -R nginx:nginx /usr/share/nginx/html`

## Recursos adicionais

Para mais informações sobre o Angular CLI, incluindo referências detalhadas de comandos, visite a página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
