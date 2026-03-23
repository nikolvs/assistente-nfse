# Assistente NFS-e

Extensão de navegador que totaliza os valores das notas fiscais emitidas no <a href="https://www.nfse.gov.br/EmissorNacional/Notas/Emitidas" target="_blank">Portal NFS-e</a>.

## Instalação

> A extensão ainda não está publicada nas lojas oficiais. Siga as instruções abaixo para instalar manualmente.

### 1. Baixar

Acesse a [página de releases](../../releases/latest) e baixe o arquivo `.zip` correspondente ao seu navegador.

### 2. Extrair

Extraia o conteúdo do `.zip` em uma pasta de sua preferência.

### 3. Carregar no navegador

**Chrome / Brave / Edge**

1. Abra a página de extensões:
   - Chrome: `chrome://extensions`
   - Brave: `brave://extensions`
   - Edge: `edge://extensions`
2. Ative o **Modo desenvolvedor** (canto superior direito).
3. Clique em **Carregar sem compactação** e selecione a pasta extraída.

**Firefox**

> Em breve.

---

## Desenvolvimento

### Pré-requisitos

- [Node.js](https://nodejs.org) v22 ou superior
- npm v10 ou superior

### Configuração

```bash
# Clone o repositório
git clone https://github.com/nikolvs/assistente-nfse.git
cd assistente-nfse

# Instale as dependências
npm install
```

### Variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env.local
```

### Comandos

```bash
# Inicia o servidor de desenvolvimento com hot reload
npm run dev

# Gera o build de produção
npm run build

# Gera os arquivos .zip prontos para publicação nas stores
npm run zip
```
