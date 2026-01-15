# Audio Transcript AI 🎙️

![Screenshot](screenshot.png)

Uma aplicação moderna e elegante para transcrição de áudio alimentada por Inteligência Artificial. Transforme gravações em texto formatado, gerencie seu histórico e aproveite uma interface premium.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan) ![OpenAI](https://img.shields.io/badge/AI-Powered-green)

## ✨ Funcionalidades

- **Transcrição de Alta Precisão**: Utiliza o modelo OpenAI Whisper para transcrever áudios com fidelidade.
- **Formatação Inteligente**: O GPT-4 formata automaticamente o texto em Markdown, criando parágrafos e pontuação correta.
- **Geração de Metadados**: Cria títulos e resumos automaticamente se você não fornecer.
- **Histórico Completo**:
  - Salva todas as suas transcrições.
  - **Player de Áudio**: Ouça a gravação original diretamente no histórico.
  - **Busca Avançada**: Encontre transcrições por título ou conteúdo.
  - **Visualização Dupla**: Alterne entre o texto *Original* e *Formatado*.
- **Design Premium**: Interface escura com efeitos de vidro (Glassmorphism), animações suaves e totalmente responsiva.
- **Totalmente em Português**: Interface e prompts otimizados para PT-BR.

## 🛠️ Tecnologias

- **Frontend**: Next.js 16 (App Router), React, TypeScript.
- **Estilo**: Tailwind CSS v4, Framer Motion, Lucide Icons.
- **Backend**: Next.js API Routes.
- **Banco de Dados**: SQLite com Prisma ORM.
- **AI**: OpenAI API.

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado.
- Gerenciador de pacotes `pnpm` (recomendado), `npm` ou `yarn`.
- Uma chave da API da OpenAI (`OPENAI_API_KEY`).

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/audio-transcript.git
   cd audio-transcript
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto e adicione sua chave:
   ```env
   OPENAI_API_KEY=sk-sua-chave-aqui...
   ```

4. **Prepare o Banco de Dados:**
   ```bash
   pnpm exec prisma db push
   ```

5. **Inicie o Servidor de Desenvolvimento:**
   ```bash
   pnpm dev
   ```

6. **Acesse:**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📂 Estrutura do Projeto

- `/src/app`: Páginas e rotas da API.
- `/src/components`: Componentes da interface (Upload, Histórico, Resultados).
- `/prisma`: Esquema do banco de dados SQLite.
- `/public/uploads`: Local onde os áudios são salvos temporariamente.

## 📝 Licença

Este projeto é de uso livre para fins educacionais e de demonstração.
