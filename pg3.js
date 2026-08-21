// ===================================================
// SISTEMA DE PASSAGEM DOS 8 SLIDES
// ===================================================
let activeSlideIndex = 1;
const totalSlidesCount = 8; 

const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const progressBar = document.getElementById('progressBar');

function syncPresentationState() {
    // Altera a visibilidade forçando o flex (ativo) ou none (escondido)
    for (let i = 1; i <= totalSlidesCount; i++) {
        const targetSlide = document.getElementById(`slide-${i}`);
        if (i === activeSlideIndex) {
            targetSlide.style.setProperty('display', 'flex', 'important');
        } else {
            targetSlide.style.setProperty('display', 'none', 'important');
        }
    }
    
    // Atualiza a barra de progresso com base na fração de 8 slides
    const progressPercentage = (activeSlideIndex / totalSlidesCount) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    // Apaga visualmente o botão Voltar se estiver no slide 1
    btnPrev.style.opacity = activeSlideIndex === 1 ? "0.15" : "1";
    btnPrev.style.pointerEvents = activeSlideIndex === 1 ? "none" : "auto";
    
    btnNext.innerText = activeSlideIndex === totalSlidesCount ? "Pronto!" : "Avançar →";
}

btnNext.addEventListener('click', () => {
    if (activeSlideIndex < totalSlidesCount) {
        activeSlideIndex++;
        syncPresentationState();
    } else {
        alert("Fim dos slides! Agora a palavra está aberta para dúvidas ou comentários.");
    }
});

btnPrev.addEventListener('click', () => {
    if (activeSlideIndex > 1) {
        activeSlideIndex--;
        syncPresentationState();
    }
});
// Ativa os controles também pelas setas esquerda/direita do teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && activeSlideIndex < totalSlidesCount) {
        activeSlideIndex++;
        syncPresentationState();
    } else if (event.key === 'ArrowLeft' && activeSlideIndex > 1) {
        activeSlideIndex--;
        syncPresentationState();
    }
});

// Executa a primeira calibragem ao ligar o sistema
syncPresentationState();


// ===================================================
// MOTOR ANALÍTICO DE EVENTOS EM RUNTIME
// ===================================================
document.getElementById('btnCalcular').addEventListener('click', function() {
    const rawInput = document.getElementById('numbersInput').value;
    
    // Filtra letras e transforma o texto em uma lista limpa de números
    let dataset = rawInput.split(',')
                          .map(val => parseFloat(val.trim()))
                          .filter(val => !isNaN(val));
    
    if (dataset.length === 0) {
        alert('Ops! Digite números válidos separados por vírgula.');
        return;
    }
    
    // 1. Geração do Rol (Ordenação de segurança obrigatória para a Mediana)
    dataset.sort((left, right) => left - right);
    document.getElementById('resRol').innerText = `[${dataset.join(', ')}]`;
    
    // 2. Processamento da Média
    const aggregateSum = dataset.reduce((accumulator, current) => accumulator + current, 0);
    const calculatedMean = aggregateSum / dataset.length;
    document.getElementById('resMedia').innerText = `${calculatedMean.toFixed(2)}`;
    
    // 3. Processamento da Mediana (Tratamento de índice par vs ímpar)
    let calculatedMedian;
    const centralIndex = Math.floor(dataset.length / 2);
    
    if (dataset.length % 2 !== 0) {
        calculatedMedian = dataset[centralIndex];
    } else {
        calculatedMedian = (dataset[centralIndex - 1] + dataset[centralIndex]) / 2;
    }
    document.getElementById('resMediana').innerText = `${calculatedMedian.toFixed(2)}`;
    
    // 4. Processamento da Moda por Dicionário de Frequência
    const frequencyMap = {};
    let highestFrequency = 0;
    let modeCollection = [];
    
    dataset.forEach(value => {
        frequencyMap[value] = (frequencyMap[value] || 0) + 1;
        if (frequencyMap[value] > highestFrequency) {
            highestFrequency = frequencyMap[value];
        }
    });
    
    for (const key in frequencyMap) {
        if (frequencyMap[key] === highestFrequency) {
            modeCollection.push(key);
        }
    }
    
    if (highestFrequency === 1) {
        document.getElementById('resModa').innerText = "Amodal";
    } else {
        document.getElementById('resModa').innerText = `${modeCollection.join(', ')} (${highestFrequency}x)`;
    }
});
