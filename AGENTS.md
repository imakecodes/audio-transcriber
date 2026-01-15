# Contexto do Projeto: Audio Transcript AI

Este documento serve como um guia de contexto para Agentes de IA e Desenvolvedores que venham a trabalhar neste repositório.

## Visão Geral
Este é um aplicativo web para **transcrição e formatação de áudio** desenvolvido com Next.js, focado em alta qualidade visual e experiência do usuário (UX). O projeto foi totalmente traduzido para **Português do Brasil (PT-BR)**.

## Stack Tecnológica
- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4 + Framer Motion (Animações)
- **Database**: SQLite (local) via Prisma ORM
- **AI Integration**: OpenAI API (`gpt-4-turbo` e `whisper-1`)

## Estrutura de Pastas Importante
- `src/app/api/transcribe`: Endpoint principal. Recebe áudio, transcreve com Whisper, e usa GPT-4 para:
  1. Formatar o texto (Markdown).
  2. Gerar Título e Descrição (se ausentes).
  3. Garantir codificação UTF-8 correta.
- `src/app/api/history`: CRUD de histórico (GET com busca/paginação, DELETE).
- `src/components`: Componentes UI reutilizáveis.
  - `HistoryList.tsx`: Lista expansível com player de áudio e toggle Original/Formatado.
  - `ConfirmationModal.tsx`: Modal genérico para ações destrutivas.

## Funcionalidades Chave Implementadas
1.  **Transcrição Dual**: Exibe texto bruto e formatado via Markdown.
2.  **Persistência**: Histórico salvo localmente com SQLite.
3.  **Auto-Metadata**: Geração automática de títulos e resumos.
4.  **Interface Premium**: Design 'Dark Mode' com efeitos de vidro (Glassmorphism).
5.  **Internacionalização**: Sistema 100% em PT-BR, com tratamento especial para encoding.

## Comandos Úteis
- `pnpm dev`: Inicia servidor local.
- `pnpm exec prisma db push`: Sincroniza esquema do banco.
- `pnpm exec prisma studio`: Interface visual para o banco de dados.

## Notas para Manutenção
- **Encoding**: Ao modificar prompts da IA, sempre reforce instruções sobre UTF-8 para evitar *mojibake* (ex: `tÃ¡` -> `tá`).
- **Uploads**: Arquivos de áudio são salvos em `public/uploads`. Em produção real, considerar S3/R2.
