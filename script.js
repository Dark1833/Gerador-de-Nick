document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const gerarBtn = document.getElementById('gerarBtn');
    const verificarBtn = document.getElementById('verificarBtn');
    const nickInput = document.getElementById('nickInput');
    const resultadoDiv = document.getElementById('resultado');

    // --- Listas de palavras para o gerador ---
    const prefixos = ['Super', 'Mega', 'Hyper', 'Dark', 'Light', 'Fire', 'Ice', 'Shadow', 'Dragon', 'Ghost'];
    const substantivos = ['Gamer', 'Hunter', 'Knight', 'Warrior', 'Ninja', 'Wizard', 'King', 'Lord', 'Phantom', 'Wolf'];
    const sufixos = ['BR', 'PT', 'Pro', 'HD', 'Extreme', 'Legend', 'Plays', 'G4mes'];

    // --- Funções ---

    /**
     * Gera um nick aleatório combinando partes e o coloca no input.
     */
    function gerarNick() {
        const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
        const substantivo = substantivos[Math.floor(Math.random() * substantivos.length)];
        const sufixo = sufixos[Math.floor(Math.random() * sufixos.length)];
        const numero = Math.floor(Math.random() * 100);

        const nickGerado = `${prefixo}${substantivo}${numero}`;
        nickInput.value = nickGerado;
        verificarDisponibilidade(nickGerado); // Verifica automaticamente o nick gerado
    }

    /**
     * Valida o nick de acordo com as regras do Minecraft.
     * @param {string} nick - O nick a ser validado.
     * @returns {boolean} - True se for válido, false caso contrário.
     */
    function validarNick(nick) {
        // Regras do Minecraft: 3 a 16 caracteres, sem caracteres especiais (apenas letras, números e underscore).
        const regex = /^[a-zA-Z0-9_]{3,16}$/;
        return regex.test(nick);
    }

    /**
     * Exibe o resultado da verificação na tela.
     * @param {string} mensagem - A mensagem a ser exibida.
     * @param {string} status - 'disponivel', 'indisponivel', 'invalido', 'carregando'.
     */
    function exibirResultado(mensagem, status) {
        resultadoDiv.style.display = 'block';
        resultadoDiv.textContent = mensagem;
        // Remove classes antigas e adiciona a nova
        resultadoDiv.className = 'resultado-container';
        resultadoDiv.classList.add(`status-${status}`);
    }

    /**
     * Verifica a disponibilidade do nick usando a API da Mojang.
     * @param {string} nick - O nick a ser verificado.
     */
    async function verificarDisponibilidade(nick) {
        if (!nick) {
            exibirResultado('Por favor, digite um nick.', 'invalido');
            return;
        }

        if (!validarNick(nick)) {
            exibirResultado('Nick inválido! Use 3-16 caracteres (letras, números e _).', 'invalido');
            return;
        }

        exibirResultado(`Verificando "${nick}"...`, 'carregando');

        try {
            // A API da Mojang precisa ser chamada através de um proxy para evitar problemas de CORS em alguns ambientes.
            // Usaremos um proxy simples e gratuito para este exemplo.
            const url = `https://api.mojang.com/users/profiles/minecraft/${nick}`;
            
            const response = await fetch(url);

            if (response.status === 200) {
                // Encontrou o usuário, então o nick está EM USO
                exibirResultado(`O nick "${nick}" já está em uso! 😞`, 'indisponivel');
            } else if (response.status === 204) {
                // Não encontrou o usuário, então o nick está DISPONÍVEL
                exibirResultado(`Boas notícias! O nick "${nick}" está disponível! ✅`, 'disponivel');
            } else {
                // Outros erros da API
                exibirResultado('Ocorreu um erro ao verificar. Tente novamente.', 'invalido');
            }

        } catch (error) {
            console.error('Erro na verificação:', error);
            exibirResultado('Não foi possível conectar ao servidor de verificação.', 'invalido');
        }
    }

    // --- Event Listeners ---
    gerarBtn.addEventListener('click', gerarNick);
    verificarBtn.addEventListener('click', () => verificarDisponibilidade(nickInput.value.trim()));
    // Permite verificar pressionando Enter no campo de texto
    nickInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            verificarDisponibilidade(nickInput.value.trim());
        }
    });
});
