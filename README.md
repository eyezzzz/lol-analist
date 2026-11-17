# Rift Coach

Central de trabalho de uma equipe de League of Legends. Primeira versão com drafts, elenco, treinos, análises e objetivos.

## Estrutura

A interface React é compilada em um único Worker. O banco Cloudflare D1 armazena os registros da equipe; os dados não ficam no repositório. O Worker exige `ctx.access` e bloqueia qualquer acesso quando o Cloudflare Access não está configurado. Configure uma política **Worker-level Access** para produção e prévias antes de disponibilizar o endereço. Autorize somente os membros necessários.

A versão atual mantém um único espaço compartilhado. Evite edições simultâneas: a última gravação substitui a anterior. Não há restauração automática a partir do arquivo exportado; guarde backups também pelo D1.

## Desenvolvimento

Requer Node.js 22 ou superior. Instale as dependências com `npm install` e gere o Worker com `npm run build`. O resultado é `dist/worker.js`.

Crie um banco D1, aplique `schema.sql` e configure o binding `DB`. Publique o Worker com data de compatibilidade atual e configure Cloudflare Access para o Worker inteiro. Não disponibilize a aplicação sem testar o bloqueio anônimo e o login autorizado.
