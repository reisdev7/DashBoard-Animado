document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.dashboard-section');
    const currentSectionTitle = document.getElementById('current-section-title');
    const liveProfitValue = document.getElementById('live-profit-value');
    const profitIndicator = document.querySelector('.profit-indicator');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizeValueDisplay = document.getElementById('font-size-value');
    const themeSelect = document.getElementById('theme-select');
    const mainContent = document.querySelector('.main-content');

    // Função para formatar o dinheiro para o padrão brasileiro
    const formatCurrency = (value) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    };

    // --- Simulação de Lucro Líquido Atual ---
    let currentProfit = 12345.67; // Valor inicial do lucro

    const updateLiveProfit = () => {
        const change = (Math.random() - 0.5) * 100; // Variação entre -50 e +50
        const percentageChange = (change / currentProfit) * 100;

        currentProfit = currentProfit + change;

        // Limita o lucro para não ir muito baixo ou muito alto em uma simulação
        if (currentProfit < 10000) currentProfit = 10000;
        if (currentProfit > 20000) currentProfit = 20000;

        liveProfitValue.textContent = formatCurrency(currentProfit);

        // Atualiza o indicador de lucro
        if (profitIndicator) {
            profitIndicator.innerHTML = ''; // Clear existing content
            const iconClass = percentageChange >= 0 ? 'fas fa-caret-up' : 'fas fa-caret-down';
            const colorClass = percentageChange >= 0 ? 'positive' : 'negative';

            const icon = document.createElement('i');
            icon.className = iconClass;
            const text = document.createTextNode(` ${percentageChange.toFixed(2)}% (simulado)`);

            profitIndicator.appendChild(icon);
            profitIndicator.appendChild(text);
            profitIndicator.className = `profit-indicator ${colorClass}`;
        }

        // Adiciona uma animação de "flash" no valor do lucro
        liveProfitValue.classList.add('profit-flash');
        setTimeout(() => {
            liveProfitValue.classList.remove('profit-flash');
        }, 600); // Dura o tempo da animação CSS
    };

    // Atualiza o lucro a cada 3 segundos
    if (liveProfitValue) {
        updateLiveProfit(); // Chama uma vez na carga inicial
        setInterval(updateLiveProfit, 3000);
    }


    // --- Navegação entre Seções e Animações ---
    const triggerSectionAnimations = (section) => {
        // Rola para o topo da área de conteúdo principal
        mainContent.scrollTop = 0;

        // Reseta e dispara animações para elementos comuns em todas as seções
        section.querySelectorAll('.card, .chart-card, .recent-activity, .settings-card').forEach(item => {
            // Remove animações existentes para re-disparar
            item.style.animation = 'none';
            // Força um reflow para reiniciar a animação
            void item.offsetWidth;
            // Re-aplica a animação com base no tipo de elemento
            if (item.classList.contains('card') || item.classList.contains('settings-card')) {
                item.style.animation = `fadeInScale 0.8s ease-out forwards var(--animation-delay, 0s)`;
            } else {
                item.style.animation = `fadeIn 0.8s ease-out forwards var(--animation-delay, 0s)`;
            }
        });

        // Animações específicas para a barra de progresso
        const progressBar = section.querySelector('.progress-bar');
        if (progressBar) {
            const initialWidth = progressBar.style.getPropertyValue('--progress-width');
            progressBar.style.width = '0%'; // Reseta largura para animar de novo
            progressBar.style.animation = 'none';
            void progressBar.offsetWidth;
            progressBar.style.animation = `fillProgressBar 2s ease-out forwards`;
            progressBar.style.setProperty('--progress-width', initialWidth);
        }

        // Animações específicas para o gráfico de barras
        section.querySelectorAll('.bar-chart-bar').forEach(bar => {
            const barHeight = bar.dataset.height; // Pega a altura do data-attribute
            bar.style.height = '0%'; // Reseta altura
            bar.style.animation = 'none';
            void bar.offsetWidth;
            bar.style.animation = `growUp 1s ease-out forwards var(--bar-delay)`;
            bar.style.height = `${barHeight}%`; // Define a altura final
        });

        // Animações específicas para o gráfico de pizza
        const pieChartGraphic = section.querySelector('.pie-chart-graphic');
        if (pieChartGraphic) {
            pieChartGraphic.style.animation = 'none';
            void pieChartGraphic.offsetWidth;
            pieChartGraphic.style.animation = `drawPie 1.5s ease-out forwards`;
        }
    };

    // Adiciona event listeners para os links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = e.currentTarget.dataset.target;
            const targetSection = document.getElementById(targetId);

            // Desativa o link e a seção atualmente ativos
            document.querySelector('.nav-link.active').classList.remove('active');
            document.querySelector('.dashboard-section.active').classList.remove('active');
            document.querySelector('.dashboard-section:not(.hidden)').classList.add('hidden');

            // Ativa o novo link e a nova seção
            e.currentTarget.classList.add('active');
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');

            // Atualiza o título no cabeçalho principal
            currentSectionTitle.textContent = e.currentTarget.textContent.trim();

            // Dispara as animações para a nova seção ativa
            triggerSectionAnimations(targetSection);
        });
    });

    // Dispara as animações para a seção de visão geral na carga inicial da página
    const initialSection = document.querySelector('.dashboard-section.active');
    if (initialSection) {
        triggerSectionAnimations(initialSection);
    }

    // --- Funcionalidade de Configurações (Tema e Fonte) ---

    // Tema
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            const selectedTheme = e.target.value;
            switch (selectedTheme) {
                case 'dark':
                    document.documentElement.style.setProperty('--dark-gray-bg', '#222831');
                    document.documentElement.style.setProperty('--medium-gray-bg', '#393e46');
                    document.documentElement.style.setProperty('--light-gray-text', '#eeeeee');
                    document.documentElement.style.setProperty('--accent-yellow', '#ffd369');
                    document.documentElement.style.setProperty('--darker-yellow', '#f7af09');
                    document.documentElement.style.setProperty('--positive-color', '#4CAF50');
                    document.documentElement.style.setProperty('--negative-color', '#ff6b6b');
                    document.documentElement.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.08)');
                    document.documentElement.style.setProperty('--secondary-text', '#cccccc');
                    break;
                case 'light':
                    document.documentElement.style.setProperty('--dark-gray-bg', '#f0f2f5');
                    document.documentElement.style.setProperty('--medium-gray-bg', '#ffffff');
                    document.documentElement.style.setProperty('--light-gray-text', '#333333');
                    document.documentElement.style.setProperty('--accent-yellow', '#4285F4'); /* Azul claro */
                    document.documentElement.style.setProperty('--darker-yellow', '#3367D6');
                    document.documentElement.style.setProperty('--positive-color', '#28A745');
                    document.documentElement.style.setProperty('--negative-color', '#DC3545');
                    document.documentElement.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
                    document.documentElement.style.setProperty('--secondary-text', '#666666');
                    break;
                case 'blue-dark':
                    document.documentElement.style.setProperty('--dark-gray-bg', '#1a202c');
                    document.documentElement.style.setProperty('--medium-gray-bg', '#2d3748');
                    document.documentElement.style.setProperty('--light-gray-text', '#e2e8f0');
                    document.documentElement.style.setProperty('--accent-yellow', '#63b3ed'); /* Azul suave */
                    document.documentElement.style.setProperty('--darker-yellow', '#4299e1');
                    document.documentElement.style.setProperty('--positive-color', '#48BB78');
                    document.documentElement.style.setProperty('--negative-color', '#FC8181');
                    document.documentElement.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.15)');
                    document.documentElement.style.setProperty('--secondary-text', '#a0aec0');
                    break;
            }
        });
    }

    // Tamanho da Fonte
    if (fontSizeSlider && fontSizeValueDisplay) {
        // Inicializa o display do valor
        fontSizeValueDisplay.textContent = `${fontSizeSlider.value}px`;

        fontSizeSlider.addEventListener('input', (e) => {
            const newFontSize = e.target.value;
            document.documentElement.style.setProperty('--base-font-size', `${newFontSize}px`);
            fontSizeValueDisplay.textContent = `${newFontSize}px`;
        });
    }

    // Simular ação dos botões de salvar nas configurações
    document.querySelectorAll('.settings-save-btn').forEach(button => {
        button.addEventListener('click', () => {
            alert('Configurações salvas! (Esta é uma simulação)');
            // Aqui você faria a lógica para salvar as configurações em um backend ou localStorage
        });
    });

    // Simular ação dos botões de adicionar/editar/excluir
    document.querySelectorAll('.btn-add-item').forEach(button => {
        button.addEventListener('click', () => {
            alert('Funcionalidade de adicionar item ativada! (Simulação)');
        });
    });

    document.querySelectorAll('.action-btn.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            alert('Funcionalidade de editar item ativada! (Simulação)');
        });
    });

    document.querySelectorAll('.action-btn.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir este item? (Simulação)')) {
                alert('Item excluído! (Simulação)');
                // Em um projeto real, aqui você removeria a linha da tabela
            }
        });
    });

    // Ação do botão "Atualizar Dados"
    document.querySelector('.btn-action:not(.btn-add-item)').addEventListener('click', () => {
        alert('Dados atualizados! (Simulação)');
        // Poderia chamar funções para re-popular dados dinâmicos aqui
    });
});
