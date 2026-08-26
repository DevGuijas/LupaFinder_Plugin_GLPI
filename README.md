# Lupa_Finder

Busca flutuante para GLPI 11.0.1+.

Autoria: **@DevGuijas - GitHub**

## Experiência

- Oculta visualmente a lupa padrão do GLPI quando o plugin está ativo.
- Adiciona um botão flutuante elegante, disponível em todas as páginas autenticadas.
- Abre automaticamente em cada página; use `Ctrl + K` (ou `⌘ K` no macOS) para ocultar ou exibir.
- Pesquisa diretamente em **Chamados**, **Pessoas** ou na **Busca geral** do GLPI.
- Tecla `Esc` e clique fora do painel fecham a janela.
- Usa as páginas de busca oficiais do GLPI; permissões, entidades e visibilidade continuam sendo aplicadas pelo próprio GLPI.

## Instalação

1. Copie a pasta `lupafinder` para `<raiz-do-glpi>/plugins/`.
2. Em **Configuração > Plugins**, instale e habilite **Lupa_Finder**.
3. Atualize a página do GLPI (limpe o cache do navegador se necessário).

O plugin não modifica o núcleo do GLPI e não cria tabelas. Ao desabilitá-lo, a lupa original volta automaticamente.
