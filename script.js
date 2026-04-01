const compartments = ['Nutrient-sensing', 'Stem cell capacity', 'Cell-ECM communication', 'Mitochondrial function', 'Chronic inflammation', 'Neural communication', 'Vascular/Lymph'];

const compounds = {
    Caffeine: {
        label: 'Caffeine',
        datas: {
            heat: { 
                'Nutrient-sensing': 0.889824269,
                'Stem cell capacity': -0.313295619,
                'Cell-ECM communication': 0.494311192,
                'Mitochondrial function': -0.085210037,
                'Chronic inflammation': 1.024462525,
                'Neural communication': 0.240828991,
                'Vascular/Lymph': -0.678840836
            },
            score: { 
                'Nutrient-sensing': 85,
                'Stem cell capacity': -20,
                'Cell-ECM communication': 41,
                'Mitochondrial function': -6,
                'Chronic inflammation': 103,
                'Neural communication': 18,
                'Vascular/Lymph': -38
            },
            antiAging: 0.359252188, 
            ageGain: 4.9
        }
    },
    'Anti-oxydant': {
        label: 'Anti-oxydant',
        datas: {
            heat: { 
                'Nutrient-sensing': -0.098801912,
                'Stem cell capacity': 0.166624451,
                'Cell-ECM communication': -0.710448894,
                'Mitochondrial function': 0.213619804,
                'Chronic inflammation': -0.237989807,
                'Neural communication': 0.637926737,
                'Vascular/Lymph': 0.524405479
            },
            score: { 
                'Nutrient-sensing': -7,
                'Stem cell capacity': 12,
                'Cell-ECM communication': -39,
                'Mitochondrial function': 16,
                'Chronic inflammation': -15,
                'Neural communication': 56,
                'Vascular/Lymph': 44
            },
            antiAging: -0.13180946, 
            ageGain: -2.0
        }
    },
    'Anti-inflammatory 1': {
        label: 'Anti-inflammatory 1',
        datas: {
            heat: { 
                'Nutrient-sensing': 1.439916494,
                'Stem cell capacity': -1.744054095,
                'Cell-ECM communication': 1.376324726,
                'Mitochondrial function': 0.01276083,
                'Chronic inflammation': 1.330258958,
                'Neural communication': 0.755055507,
                'Vascular/Lymph': -0.5493958
            },
            score: { 
                'Nutrient-sensing': 171,
                'Stem cell capacity': -70,
                'Cell-ECM communication': 160,
                'Mitochondrial function': 1,
                'Chronic inflammation': 151,
                'Neural communication': 69,
                'Vascular/Lymph': -32
            },
            antiAging: 0.64012325, 
            ageGain: 7.4
        }
    },
    'Anti-inflammatory 2': {
        label: 'Anti-inflammatory 2',
        datas: {
            heat: { 
                'Nutrient-sensing': 0.59217289,
                'Stem cell capacity': -0.781312497,
                'Cell-ECM communication': -0.120205679,
                'Mitochondrial function': -0.174555969,
                'Chronic inflammation': 0.416352352,
                'Neural communication': -0.064046621,
                'Vascular/Lymph': -0.584271828
            },
            score: { 
                'Nutrient-sensing': 51,
                'Stem cell capacity': -42,
                'Cell-ECM communication': -8,
                'Mitochondrial function': -11,
                'Chronic inflammation': 33,
                'Neural communication': -4,
                'Vascular/Lymph': -33
            },
            antiAging: 0.11566192, 
            ageGain: 1.7
        }
    },
    'GLP1-agonist': {
        label: 'GLP1-agonist',
        datas: {
            heat: { 
                'Nutrient-sensing': 0.794075859,
                'Stem cell capacity': 0.319309553,
                'Cell-ECM communication': -0.59856128,
                'Mitochondrial function': 0.725785573,
                'Chronic inflammation': 0.429288758,
                'Neural communication': -0.384254667,
                'Vascular/Lymph': null
            },
            score: { 
                'Nutrient-sensing': 73,
                'Stem cell capacity': 25,
                'Cell-ECM communication': -34,
                'Mitochondrial function': 65,
                'Chronic inflammation': 35,
                'Neural communication': -23,
                'Vascular/Lymph': null
            },
            antiAging: 0.26190119, 
            ageGain: 3.7
        }
    },
    'Botox Injected': {
        label: 'Botox Injected',
        datas: {
            heat: { 
                'Nutrient-sensing': -0.227453232,
                'Stem cell capacity': -0.51763418,
                'Cell-ECM communication': 0.019428415,
                'Mitochondrial function': -0.520778338,
                'Chronic inflammation': -0.229850928,
                'Neural communication': -0.853438165,
                'Vascular/Lymph': -0.420184612
            },
            score: { 
                'Nutrient-sensing': -15,
                'Stem cell capacity': -30,
                'Cell-ECM communication': 1,
                'Mitochondrial function': -30,
                'Chronic inflammation': -15,
                'Neural communication': -45,
                'Vascular/Lymph': -25
            },
            antiAging: -0.44653357, 
            ageGain: -5.8
        }
    }
};

const combinationTemplates = {
    'Caffeine + Anti-oxydant': {
        label: 'Caffeine + Anti-oxydant',
        datas: {
            heat: {
                'Nutrient-sensing': 0.593236415,
                'Stem cell capacity': 0.02264843,
                'Cell-ECM communication': 0.132883166,
                'Mitochondrial function': 0.123970852,
                'Chronic inflammation': 0.645726825,
                'Neural communication': 0.518797414,
                'Vascular/Lymph': 0.163431585
            },
            score: {
                'Nutrient-sensing': 51,
                'Stem cell capacity': 2,
                'Cell-ECM communication': 10,
                'Mitochondrial function': 9,
                'Chronic inflammation': 56,
                'Neural communication': 43,
                'Vascular/Lymph': 12
            },
            antiAging: 0.294142315,
            ageGain: 4.1
        }
    },
    'Caffeine + Anti-inflammatory 1': {
        label: 'Caffeine + Anti-inflammatory 1',
        datas: {
            heat: {
                'Nutrient-sensing': 1.274888827,
                'Stem cell capacity': -0.742523162,
                'Cell-ECM communication': 1.111720666,
                'Mitochondrial function': -0.01663043,
                'Chronic inflammation': 1.238520028,
                'Neural communication': 0.600787552,
                'Vascular/Lymph': -0.588229311
            },
            score: {
                'Nutrient-sensing': 142,
                'Stem cell capacity': -40,
                'Cell-ECM communication': 116,
                'Mitochondrial function': -1,
                'Chronic inflammation': 136,
                'Neural communication': 52,
                'Vascular/Lymph': -33
            },
            antiAging: 0.646010876,
            ageGain: 7.5
        }
    },
    'Caffeine + Anti-inflammatory 2': {
        label: 'Caffeine + Anti-inflammatory 2',
        datas: {
            heat: {
                'Nutrient-sensing': 0.800528855,
                'Stem cell capacity': -0.453700682,
                'Cell-ECM communication': 0.30995613,
                'Mitochondrial function': -0.112013817,
                'Chronic inflammation': 0.842029473,
                'Neural communication': 0.149366307,
                'Vascular/Lymph': -0.612642531
            },
            score: {
                'Nutrient-sensing': 74,
                'Stem cell capacity': -27,
                'Cell-ECM communication': 24,
                'Mitochondrial function': -7,
                'Chronic inflammation': 79,
                'Neural communication': 11,
                'Vascular/Lymph': -35
            },
            antiAging: 0.282202719,
            ageGain: 4.0
        }
    },
    'Caffeine + GLP1-agonist': {
        label: 'Caffeine + GLP1-agonist',
        datas: {
            heat: {
                'Nutrient-sensing': 0.861099746,
                'Stem cell capacity': 0.129528001,
                'Cell-ECM communication': 0.16644945,
                'Mitochondrial function': 0.48248689,
                'Chronic inflammation': 0.845910395,
                'Neural communication': 0.053303893,
                'Vascular/Lymph': null
            },
            score: {
                'Nutrient-sensing': 82,
                'Stem cell capacity': 9,
                'Cell-ECM communication': 12,
                'Mitochondrial function': 40,
                'Chronic inflammation': 80,
                'Neural communication': 4,
                'Vascular/Lymph': null
            },
            antiAging: 0.478858626,
            ageGain: 6.2
        }
    },
    'Caffeine + Botox Injected': {
        label: 'Caffeine + Botox Injected',
        datas: {
            heat: {
                'Nutrient-sensing': 0.554641019,
                'Stem cell capacity': -0.374597187,
                'Cell-ECM communication': 0.351846359,
                'Mitochondrial function': -0.215880527,
                'Chronic inflammation': 0.648168489,
                'Neural communication': -0.087451156,
                'Vascular/Lymph': -0.497781479
            },
            score: {
                'Nutrient-sensing': 47,
                'Stem cell capacity': -23,
                'Cell-ECM communication': 28,
                'Mitochondrial function': -14,
                'Chronic inflammation': 57,
                'Neural communication': -6,
                'Vascular/Lymph': -29
            },
            antiAging: 0.12717105,
            ageGain: 1.9
        }
    },
    'Anti-oxydant + Anti-inflammatory 1': {
        label: 'Anti-oxydant + Anti-inflammatory 1',
        datas: {
            heat: {
                'Nutrient-sensing': 0.978300972,
                'Stem cell capacity': -0.406579113,
                'Cell-ECM communication': 0.75029264,
                'Mitochondrial function': 0.153362112,
                'Chronic inflammation': 0.859784328,
                'Neural communication': 0.719916876,
                'Vascular/Lymph': 0.202265096
            },
            score: {
                'Nutrient-sensing': 97,
                'Stem cell capacity': -25,
                'Cell-ECM communication': 68,
                'Mitochondrial function': 11,
                'Chronic inflammation': 81,
                'Neural communication': 65,
                'Vascular/Lymph': 15
            },
            antiAging: 0.550191947,
            ageGain: 6.8
        }
    },
    'Anti-oxydant + Anti-inflammatory 2': {
        label: 'Anti-oxydant + Anti-inflammatory 2',
        datas: {
            heat: {
                'Nutrient-sensing': 0.384880449,
                'Stem cell capacity': -0.117756634,
                'Cell-ECM communication': -0.297278643,
                'Mitochondrial function': 0.097167072,
                'Chronic inflammation': 0.220049704,
                'Neural communication': 0.42733473,
                'Vascular/Lymph': 0.191802287
            },
            score: {
                'Nutrient-sensing': 31,
                'Stem cell capacity': -8,
                'Cell-ECM communication': -19,
                'Mitochondrial function': 7,
                'Chronic inflammation': 16,
                'Neural communication': 34,
                'Vascular/Lymph': 14
            },
            antiAging: 0.125264588,
            ageGain: 1.9
        }
    },
    'Anti-oxydant + GLP1-agonist': {
        label: 'Anti-oxydant + GLP1-agonist',
        datas: {
            heat: {
                'Nutrient-sensing': 0.526212528,
                'Stem cell capacity': 0.273504022,
                'Cell-ECM communication': -0.632127564,
                'Mitochondrial function': 0.572135843,
                'Chronic inflammation': 0.229105189,
                'Neural communication': 0.331272316,
                'Vascular/Lymph': null
            },
            score: {
                'Nutrient-sensing': 44,
                'Stem cell capacity': 21,
                'Cell-ECM communication': -35,
                'Mitochondrial function': 49,
                'Chronic inflammation': 17,
                'Neural communication': 26,
                'Vascular/Lymph': null
            },
            antiAging: 0.204399469,
            ageGain: 3.0
        }
    },
    'Anti-oxydant + Botox Injected': {
        label: 'Anti-oxydant + Botox Injected',
        datas: {
            heat: {
                'Nutrient-sensing': -0.137397308,
                'Stem cell capacity': -0.038653138,
                'Cell-ECM communication': -0.199534777,
                'Mitochondrial function': -0.006699638,
                'Chronic inflammation': -0.232292592,
                'Neural communication': 0.190517267,
                'Vascular/Lymph': null
            },
            score: {
                'Nutrient-sensing': -9,
                'Stem cell capacity': -3,
                'Cell-ECM communication': -13,
                'Mitochondrial function': 0,
                'Chronic inflammation': -15,
                'Neural communication': 14,
                'Vascular/Lymph': null
            },
            antiAging: -0.104612476,
            ageGain: -1.6
        }
    },
    'Anti-inflammatory 1 + Anti-inflammatory 2': {
        label: 'Anti-inflammatory 1 + Anti-inflammatory 2',
        datas: {
            heat: {
                'Nutrient-sensing': 1.185593413,
                'Stem cell capacity': -1.070134977,
                'Cell-ECM communication': 0.927365605,
                'Mitochondrial function': -0.04343421,
                'Chronic inflammation': 1.056086976,
                'Neural communication': 0.509324869,
                'Vascular/Lymph': -0.559858608
            },
            score: {
                'Nutrient-sensing': 127,
                'Stem cell capacity': -52,
                'Cell-ECM communication': 90,
                'Mitochondrial function': -3,
                'Chronic inflammation': 108,
                'Neural communication': 42,
                'Vascular/Lymph': -32
            },
            antiAging: 0.531876352,
            ageGain: 6.6
        }
    },
    'Anti-inflammatory 1 + GLP1-agonist': {
        label: 'Anti-inflammatory 1 + GLP1-agonist',
        datas: {
            heat: {
                'Nutrient-sensing': 1.246164304,
                'Stem cell capacity': -0.299699542,
                'Cell-ECM communication': 0.783858924,
                'Mitochondrial function': 0.51187815,
                'Chronic inflammation': 1.059967898,
                'Neural communication': 0.413262455,
                'Vascular/Lymph': null
            },
            score: {
                'Nutrient-sensing': 137,
                'Stem cell capacity': -19,
                'Cell-ECM communication': 72,
                'Mitochondrial function': 43,
                'Chronic inflammation': 108,
                'Neural communication': 33,
                'Vascular/Lymph': null
            },
            antiAging: 0.707418044,
            ageGain: 7.9
        }
    },
    'Anti-inflammatory 1 + Botox Injected': {
        label: 'Anti-inflammatory 1 + Botox Injected',
        datas: {
            heat: {
                'Nutrient-sensing': 0.939705576,
                'Stem cell capacity': -0.885560154,
                'Cell-ECM communication': 0.969255833,
                'Mitochondrial function': -0.14730092,
                'Chronic inflammation': 0.862225992,
                'Neural communication': 0.272507405,
                'Vascular/Lymph': -0.458947968
            },
            score: {
                'Nutrient-sensing': 92,
                'Stem cell capacity': -46,
                'Cell-ECM communication': 96,
                'Mitochondrial function': -10,
                'Chronic inflammation': 82,
                'Neural communication': 21,
                'Vascular/Lymph': -27
            },
            antiAging: 0.391963924,
            ageGain: 5.3
        }
    },
    'Anti-inflammatory 2 + GLP1-agonist': {
        label: 'Anti-inflammatory 2 + GLP1-agonist',
        datas: {
            heat: {
                'Nutrient-sensing': 0.733504968,
                'Stem cell capacity': -0.010877062,
                'Cell-ECM communication': -0.263712359,
                'Mitochondrial function': 0.455683111,
                'Chronic inflammation': 0.425407836,
                'Neural communication': -0.160109035,
                'Vascular/Lymph': null
            },
            score: {
                'Nutrient-sensing': 66,
                'Stem cell capacity': -1,
                'Cell-ECM communication': -17,
                'Mitochondrial function': 37,
                'Chronic inflammation': 34,
                'Neural communication': -11,
                'Vascular/Lymph': null
            },
            antiAging: 0.305408792,
            ageGain: 4.3
        }
    },
    'Anti-inflammatory 2 + Botox Injected': {
        label: 'Anti-inflammatory 2 + Botox Injected',
        datas: {
            heat: {
                'Nutrient-sensing': 0.346285053,
                'Stem cell capacity': -0.596737675,
                'Cell-ECM communication': -0.022461813,
                'Mitochondrial function': -0.27842268,
                'Chronic inflammation': 0.222491368,
                'Neural communication': -0.300864085,
                'Vascular/Lymph': -0.469410777
            },
            score: {
                'Nutrient-sensing': 27,
                'Stem cell capacity': -34,
                'Cell-ECM communication': -2,
                'Mitochondrial function': -18,
                'Chronic inflammation': 17,
                'Neural communication': -19,
                'Vascular/Lymph': -28
            },
            antiAging: -0.067881327,
            ageGain: -1.0
        }
    },
    'GLP1-agonist + Botox Injected': {
        label: 'GLP1-agonist + Botox Injected',
        datas: {
            heat: {
                'Nutrient-sensing': 0.487617132,
                'Stem cell capacity': 0.068226433,
                'Cell-ECM communication': 0.3518164,
                'Mitochondrial function': 0.3518164,
                'Chronic inflammation': 0.231546852,
                'Neural communication': -0.525009717,
                'Vascular/Lymph': null
            },
            score: {
                'Nutrient-sensing': 40,
                'Stem cell capacity': 5,
                'Cell-ECM communication': 28,
                'Mitochondrial function': 28,
                'Chronic inflammation': 17,
                'Neural communication': -31,
                'Vascular/Lymph': null
            },
            antiAging: -0.09231619,
            ageGain: -1.05
        }
    }
};

let selectedCompounds = [];
let activeSelection = 'combo'; // 'a', 'combo', 'b'

function buildButtons() {
    const list = document.getElementById('compounds-list');
    list.innerHTML = '';
    Object.keys(compounds).forEach(key => {
        const btn = document.createElement('button');
        btn.textContent = compounds[key].label;
        btn.className = 'compound-btn';
        btn.onclick = () => handleCompoundSelection(key, btn);
        list.appendChild(btn);
    });
}

function handleCompoundSelection(key, button) {
    const idx = selectedCompounds.indexOf(key);

    if (idx !== -1) {
        selectedCompounds.splice(idx, 1);
    } else {
        if (selectedCompounds.length === 2) {
            selectedCompounds = [key];
        } else {
            selectedCompounds.push(key);
        }
    }

    updateActiveButtons();
    renderSelected();
}

function updateActiveButtons() {
    document.querySelectorAll('.compound-btn').forEach(btn => {
        const key = Object.keys(compounds).find(k => compounds[k].label === btn.textContent);
        if (key && selectedCompounds.includes(key)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function renderSelected() {
    if (selectedCompounds.length === 0) {
        document.getElementById('select-hint').style.display = 'block';
        document.getElementById('panels').style.display = 'none';
        return;
    }

    // Ocultar hint y video al hacer click
    document.getElementById('select-hint').style.display = 'none';
    
    const videoDiv = document.querySelector('.intro-video');
    const videoEl = videoDiv ? videoDiv.querySelector('video') : null;
    if (videoEl) {
        videoEl.pause();              // Detiene el video
        videoEl.currentTime = 0;      // Opcional: reinicia al principio
        videoDiv.style.display = 'none'; // Oculta el contenedor del video
    }

    // Ocultamos los paneles hasta que termine la animación
    document.getElementById('panels').style.display = 'none';

    if (selectedCompounds.length === 1) {
        activeSelection = 'combo'; // for single, it's the compound
        runTestingAnimation(() => {
            document.getElementById('panels').style.display = 'block';
            renderCompound(selectedCompounds[0]);
        });
        return;
    }

    activeSelection = 'combo'; // default to combination
    runTestingAnimation(() => {
        document.getElementById('panels').style.display = 'block';
        renderCombination(selectedCompounds[0], selectedCompounds[1]);
    });
}

function runTestingAnimation(callback) {
    const animationDiv = document.getElementById('testing-animation');
    if (!animationDiv) return callback();

    const textDiv = animationDiv.querySelector('.testing-text');
    const images = Array.from(animationDiv.querySelectorAll('.testing-image'));
    if (images.length === 0) return callback();

    const image = images[0];

    const testingPhrases = [
        "Testing this compound based on 17 endpoints of ageing",
        "Analyzing effects on metabolism",
        "Examining stem cell activity",
        "Evaluating ECM remodeling",
        "Measuring mitochondrial health",
        "Tracking inflamm-aging markers",
        "Observing neural communication"
    ];

    const firstPhrase = testingPhrases[0];
    const restPhrases = testingPhrases
        .slice(1)
        .sort(() => Math.random() - 0.5)
        .slice(0, 1);
    const allPhrases = [firstPhrase, ...restPhrases];

    const imageFiles = [
        "img/pipette.png",
        "img/brown_models.png",
        "img/exadex_adipose.png",
        "img/exadex_vascularized.png"
    ];

    imageFiles.forEach(src => {
        const imgPreload = new Image();
        imgPreload.src = src;
    });

    const startIndex = Math.floor(Math.random() * imageFiles.length);
    const orderedImages = imageFiles.slice(startIndex).concat(imageFiles.slice(0, startIndex));

    animationDiv.style.display = 'flex';

    let i = 0;
    let imageIndex = 0;

    function showNext() {
        image.style.opacity = 0;
        setTimeout(() => {
            textDiv.textContent = allPhrases[i];
            image.src = orderedImages[imageIndex];
            image.onload = () => { image.style.opacity = 1; };
            i++;
            imageIndex = (imageIndex + 1) % orderedImages.length;
        }, 500);
    }

    textDiv.textContent = allPhrases[i];
    image.src = orderedImages[imageIndex];
    image.onload = () => { image.style.opacity = 1; };
    i++;
    imageIndex = (imageIndex + 1) % orderedImages.length;

    const interval = setInterval(() => {
        if (i >= allPhrases.length) {
            clearInterval(interval);
            setTimeout(() => {
                animationDiv.style.display = 'none';
                callback();
            }, 500);
            return;
        }
        showNext();
    }, 2000);
}

function renderCombination(keyA, keyB) {
    const comboKey = `${keyA} + ${keyB}`;
    const comboKeyReverse = `${keyB} + ${keyA}`;
    const combo = combinationTemplates[comboKey] || combinationTemplates[comboKeyReverse];

    let comboDatas, comboLabel;
    if (combo && combo.datas && combo.datas.antiAging !== null) {
        comboLabel = combo.label;
        comboDatas = combo.datas;
    } else {
        const dataA = compounds[keyA].datas;
        const dataB = compounds[keyB].datas;
        comboLabel = `${compounds[keyA].label} + ${compounds[keyB].label}`;
        comboDatas = {
            heat: combineMaps(dataA.heat, dataB.heat),
            antiAging: (dataA.antiAging + dataB.antiAging) / 2,
            ageGain: (dataA.ageGain + dataB.ageGain) / 2
        };
    }

    // Show all three cards
    document.getElementById('score-card-a').style.display = 'block';
    document.getElementById('score-card-b').style.display = 'block';
    document.getElementById('score-card-combo').style.display = 'block';

    // Render data for each
    renderCompoundFromData(compounds[keyA].label, compounds[keyA].datas, 'a');
    renderCompoundFromData(comboLabel, comboDatas, 'combo');
    renderCompoundFromData(compounds[keyB].label, compounds[keyB].datas, 'b');

    // Set up click handlers
    document.getElementById('score-card-a').onclick = () => setActiveSelection('a');
    document.getElementById('score-card-b').onclick = () => setActiveSelection('b');
    document.getElementById('score-card-combo').onclick = () => setActiveSelection('combo');

    // Update active classes
    updateActiveCardClasses();
}

function setActiveSelection(selection) {
    activeSelection = selection;
    updateActiveCardClasses();
    // Re-render heatmap and radar based on active selection
    if (selectedCompounds.length === 1) {
        const { datas } = compounds[selectedCompounds[0]];
        updateRadarImage(compounds[selectedCompounds[0]].label);
        renderHeatmapOrScore(datas);
    } else if (selectedCompounds.length === 2) {
        const keyA = selectedCompounds[0];
        const keyB = selectedCompounds[1];
        let datas, label;
        if (activeSelection === 'a') {
            datas = compounds[keyA].datas;
            label = compounds[keyA].label;
        } else if (activeSelection === 'b') {
            datas = compounds[keyB].datas;
            label = compounds[keyB].label;
        } else {
            // combo
            const comboKey = `${keyA} + ${keyB}`;
            const comboKeyReverse = `${keyB} + ${keyA}`;
            const combo = combinationTemplates[comboKey] || combinationTemplates[comboKeyReverse];
            if (combo && combo.datas) {
                datas = combo.datas;
                label = combo.label;
            } else {
                const dataA = compounds[keyA].datas;
                const dataB = compounds[keyB].datas;
                datas = {
                    heat: combineMaps(dataA.heat, dataB.heat),
                    radar: combineMaps(dataA.radar, dataB.radar),
                    antiAging: (dataA.antiAging + dataB.antiAging) / 2,
                    ageGain: (dataA.ageGain + dataB.ageGain) / 2
                };
                label = `${compounds[keyA].label} + ${compounds[keyB].label}`;
            }
        }
        updateRadarImage(label);
        renderHeatmapOrScore(datas);
    }
}

function updateActiveCardClasses() {
    const cards = ['a', 'combo', 'b'];
    cards.forEach(card => {
        const el = document.getElementById(`score-card-${card}`);
        if (el) {
            if (card === activeSelection) {
                el.classList.remove('inactive');
                el.classList.add('active');
            } else {
                el.classList.remove('active');
                el.classList.add('inactive');
            }
        }
    });
}

function renderCompound(key) {
    const { datas, label } = compounds[key];
    
    // Hide side cards for single compound
    document.getElementById('score-card-a').style.display = 'none';
    document.getElementById('score-card-b').style.display = 'none';
    document.getElementById('score-card-combo').style.display = 'block';
    document.getElementById('score-card-combo').classList.remove('inactive');
    document.getElementById('score-card-combo').classList.add('active');
    
    renderCompoundFromData(label, datas, 'combo');
}

function renderCompoundFromData(label, datas, suffix = '') {
    const nameEl = document.getElementById(`compound-name${suffix ? '-' + suffix : ''}`);
    const scoreEl = document.getElementById(`score-value${suffix ? '-' + suffix : ''}`);
    const ageEl = document.getElementById(`age-value${suffix ? '-' + suffix : ''}`);

    if (nameEl) nameEl.textContent = label;

    if (scoreEl) {
        const s = datas.antiAging ?? 0;
        const sign = s >= 0 ? '+' : '';
        scoreEl.textContent = `${sign}${s.toFixed(2)}`;
        scoreEl.style.color = getScoreColor(s);
    }

    if (ageEl) {
        const ag = datas.ageGain ?? 0;
        const ageSign = ag >= 0 ? '+' : '';
        ageEl.textContent = `${ageSign}${ag.toFixed(1)} years`;
        ageEl.style.color = ag >= 0 ? '#4CB292' : '#993C1E';
    }

    // Only render heatmap and radar if this is the active selection
    if (suffix === '' || suffix === activeSelection) {
        updateRadarImage(label);
        renderHeatmapOrScore(datas);
    }
}

function getScoreColor(score) {
    if (score > 0.3) return '#4CB292';
    if (score < -0.3) return '#993C1E';
    return '#999999';
}

function heatmapColor(v) {
    if (v >= 2.0) return '#00ad76';
    if (v >= 1.0) return '#52c09d';
    if (v >= 0.3) return '#8edac2';
    if (v > 0)   return '#C7E7DD';

    if (v === 0) return '#FAFDFC';

    if (v > -0.3) return '#F7F1EF';
    if (v > -1.0) return '#dd937c';
    if (v > -2.0) return '#d17759';
    return '#993C1E';
}

function scoreColor(v) {
    if (v >= 75) return '#00ad76';
    if (v >= 50) return '#52c09d';
    if (v >= 25) return '#8edac2';
    if (v > 25)   return '#C7E7DD';

    if (v === 0) return '#FAFDFC';

    if (v > -25) return '#F7F1EF';
    if (v > -50) return '#dd937c';
    if (v > -75) return '#d17759';
    return '#993C1E';
}

function getTextColor(bgColor) {
    let r, g, b;

    if (bgColor.startsWith('#')) {
        const hex = bgColor.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } 
    else {
        const rgb = bgColor.match(/\d+/g);
        if (!rgb) return '#000000';
        r = parseInt(rgb[0]);
        g = parseInt(rgb[1]);
        b = parseInt(rgb[2]);
    }

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 160 ? '#000000' : '#ffffff';
}

function renderHeatmap(heat) {
    const heatmapBlock = document.getElementById('heatmap-block');
    let html = '<div class="heatmap-table">';

    compartments.forEach(name => {
        const value = heat[name];
        if (value === null || value === undefined) {
            // Si no hay valor, mostrar guion y fondo gris claro
            html += `
                <div class="heatmap-row">
                    <div class="heatmap-label">${name}</div>
                    <div class="heatmap-bar" style="background:#eee; color:#333;">
                        -
                    </div>
                </div>
            `;
        } else {
            const color = heatmapColor(value);
            const textColor = getTextColor(color);
            const sign = value >= 0 ? '+' : '';
            html += `
                <div class="heatmap-row">
                    <div class="heatmap-label">${name}</div>
                    <div class="heatmap-bar" style="background:${color}; color:${textColor};">
                        ${sign}${value.toFixed(2)}
                    </div>
                </div>
            `;
        }
    });

    html += '</div>';
    heatmapBlock.innerHTML = html;
}

function renderHeatmapOrScore(datas) {
    if (window.useScoreHeatmap && datas.score) {
        renderScore(datas.score);
    } else {
        renderHeatmap(datas.heat);
    }
}

function renderScore(score) {
    const heatmapBlock = document.getElementById('heatmap-block');
    let html = '<div class="heatmap-table">';

    compartments.forEach(name => {
        const value = score[name];

        if (value === null || value === undefined) {
            html += `
                <div class="heatmap-row">
                    <div class="heatmap-label">${name}</div>
                    <div class="heatmap-bar" style="background:#eee; color:#333;">
                        -
                    </div>
                </div>
            `;
        } else {
            // 👇 de momento usamos mismo color (lo cambiaremos luego)
            const color = scoreColor(value);
            const textColor = getTextColor(color);
            const sign = value >= 0 ? '+' : '';

            html += `
                <div class="heatmap-row">
                    <div class="heatmap-label">${name}</div>
                    <div class="heatmap-bar" style="background:${color}; color:${textColor};">
                        ${sign}${value}%
                    </div>
                </div>
            `;
        }
    });

    html += '</div>';
    heatmapBlock.innerHTML = html;
}

function updateRadarImage(compoundName) {
    const img = document.getElementById("radarImage");

    const radarImages = {
        Caffeine: "radar/radar_caf.png",
        'Anti-oxydant': "radar/radar_nac.png",
        'Anti-inflammatory 1': "radar/radar_dex.png",
        'Anti-inflammatory 2': "radar/radar_enox.png",
        'GLP1-agonist': "radar/radar_lira.png",
        'Botox Injected': "radar/radar_botox.png",
        'Caffeine + Anti-oxydant': "radar/radar_caf_nac.png",
        'Caffeine + Anti-inflammatory 1': "radar/radar_caf_dex.png",
        'Caffeine + Anti-inflammatory 2': "radar/radar_caf_enox.png",
        'Caffeine + GLP1-agonist': "radar/radar_caf_lira.png",
        'Caffeine + Botox Injected': "radar/radar_caf_botox.png",
        'Anti-oxydant + Anti-inflammatory 1': "radar/radar_nac_dex.png",
        'Anti-oxydant + Anti-inflammatory 2': "radar/radar_nac_enox.png",
        'Anti-oxydant + GLP1-agonist': "radar/radar_nac_lira.png",
        'Anti-oxydant + Botox Injected': "radar/radar_nac_botox.png",
        'Anti-inflammatory 1 + Anti-inflammatory 2': "radar/radar_dex_enox.png",
        'Anti-inflammatory 1 + GLP1-agonist': "radar/radar_dex_lira.png",
        'Anti-inflammatory 1 + Botox Injected': "radar/radar_dex_botox.png",
        'Anti-inflammatory 2 + GLP1-agonist': "radar/radar_enox_lira.png",
        'Anti-inflammatory 2 + Botox Injected': "radar/radar_enox_botox.png",
        'GLP1-agonist + Botox Injected': "radar/radar_lira_botox.png"
    };

    img.src = radarImages[compoundName] || "radar/radar_background.png";
}


buildButtons();