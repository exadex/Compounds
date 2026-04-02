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