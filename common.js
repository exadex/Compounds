let selectedCompounds = [];
let activeSelection = 'combo'; // 'a', 'combo', 'b'

function normalizeKey(k) {
    return (k || '').trim().toLowerCase().replace(/\s+/g, '_');
}

function comboKey(a, b) {
    return [a, b]
        .map(normalizeKey)
        .sort()
        .join('_');
}

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

    isOptimalMode = false;

    updateActiveButtons();
    renderSelected();
}

function updateActiveButtons() {
    document.querySelectorAll('.compound-btn').forEach(btn => {
        const key = Object.keys(compounds).find(k =>
            normalizeKey(compounds[k].label) === normalizeKey(btn.textContent)
        );
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
        "Testing this compound based on 24 endpoints of ageing",
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

function combineMaps(mapA = {}, mapB = {}) {
    const result = {};
    const keys = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);

    for (const key of keys) {
        const a = mapA[key] ?? 0;
        const b = mapB[key] ?? 0;
        result[key] = (a + b) / 2;
    }

    return result;
}

function renderCombination(keyA, keyB) {
    const comboKey = `${keyA}_${keyB}`;
    const comboKeyReverse = `${keyB}_${keyA}`;
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

            score: combineMaps(dataA.score || {}, dataB.score || {}),

            antiAging: (dataA.antiAging + dataB.antiAging) / 2,
            ageGain: (dataA.ageGain + dataB.ageGain) / 2,

            radar: combineMaps(dataA.radar || {}, dataB.radar || {}),
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
        renderAll(datas);
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
            const comboKey = `${keyA}_${keyB}`;
            const comboKeyReverse = `${keyB}_${keyA}`;
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
        renderAll(datas);
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

    if (selectedCompounds.length === 1) {
    renderOptimalGraph(datas, label, true);
    } else {
        // 🔴 IMPORTANTE: ocultar y limpiar sección 4
        const graphBlock = document.getElementById('optimal-graph-block');
        const buttonContainer = document.getElementById('optimal-button-container');
        const labelContainer = document.getElementById('optimal-graph-label');

        if (graphBlock) graphBlock.innerHTML = '';
        if (buttonContainer) buttonContainer.innerHTML = '';
        if (labelContainer) labelContainer.textContent = '';
    }
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

        const label = ag >= 0 ? 'years younger' : 'years older';
        const absValue = Math.abs(ag);

        ageEl.textContent = `${absValue.toFixed(1)} ${label}`;

        ageEl.style.color = ag >= 0 ? '#4CB292' : '#993C1E';
    }

    // Only render heatmap and radar if this is the active selection
    if (suffix === '' || suffix === activeSelection) {
        updateRadarImage(label);
        renderAll(datas);
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

function renderCompartmentTable(data, mode, targetId) {
    const block = document.getElementById(targetId);

    let html = '<div class="heatmap-table">';

    compartments.forEach(name => {
        const value = data[name];

        if (value === null || value === undefined) {
            html += `
                <div class="heatmap-row">
                    <div class="heatmap-label">${name}</div>
                    <div class="heatmap-bar" style="background:#eee; color:#333;">
                        -
                    </div>
                </div>
            `;
            return;
        }

        const isScore = mode === 'score';
        const color = isScore ? scoreColor(value) : heatmapColor(value);
        const textColor = getTextColor(color);

        const sign = value >= 0 ? '+' : '';
        const suffix = isScore ? '%' : '';

        html += `
            <div class="heatmap-row">
                <div class="heatmap-label">${name}</div>
                <div class="heatmap-bar" style="background:${color}; color:${textColor};">
                    ${sign}${value}${suffix}
                </div>
            </div>
        `;
    });

    html += '</div>';
    block.innerHTML = html;
}

function renderCompartments() {
    const block = document.getElementById('compartments-block');

    let html = '<div class="table">';

    compartments.forEach(name => {
        html += `
            <div class="row">
                <div class="cell">${name}</div>
            </div>
        `;
    });

    html += '</div>';
    block.innerHTML = html;
}

function renderHeatmap(datas) {
    const block = document.getElementById('heatmap-block');

    let html = '<div class="table">';

    compartments.forEach(name => {
        const value = datas.heat?.[name];

        const color = value != null ? heatmapColor(value) : '#eee';
        const text = value != null ? `${value.toFixed(2)}` : '-';

        html += `
            <div class="row">
                <div class="cell" style="background:${color}">
                    ${text}
                </div>
            </div>
        `;
    });

    html += '</div>';
    block.innerHTML = html;
}

function renderScore(datas) {
    const block = document.getElementById('score-block');

    let html = '<div class="table">';

    compartments.forEach(name => {
        const value = datas.score?.[name];
        const color = value != null ? scoreColor(value) : '#eee';
        const sign = value >= 0 ? '+' : '';

        html += `
            <div class="row">
                <div class="cell" style="background:${color}">
                    ${sign}${Math.round(value) ?? '-'}%
                </div>
            </div>
        `;
    });

    html += '</div>';
    block.innerHTML = html;
}

function getMechanismText(value, compartment) {

    if (value >= 75) return `Strong beneficial effect on ${compartment}`;
    if (value >= 50) return `Good positive modulation of ${compartment}`;
    if (value >= 25) return `Moderate improvement in ${compartment}`;
    if (value > 0)   return `Mild positive effect on ${compartment}`;

    if (value === 0) return `No detectable effect on ${compartment}`;

    if (value > -25) return `Mild negative modulation of ${compartment}`;
    if (value > -50) return `Moderate suppression of ${compartment}`;
    if (value > -75) return `Strong inhibitory effect on ${compartment}`;

    return `Severe suppression of ${compartment}`;
}

function renderMechanism(datas) {
    const block = document.getElementById('mechanism-block');

    let html = '<div class="table">';

    compartments.forEach(name => {
        const value = datas.score?.[name];

        let text = 'No data available';

        if (value !== null && value !== undefined) {
            text = getMechanismText(value, name);
        }

        html += `
            <div class="row">
                <div class="cell">
                    ${text}
                </div>
            </div>
        `;
    });

    html += '</div>';
    block.innerHTML = html;
}

function renderAll(datas) {
    renderCompartments();
    renderHeatmap(datas);
    renderScore(datas);
    renderMechanism(datas);
}

function updateRadarImage(compoundName) {
    const img = document.getElementById("radarImage");

    const radarImages = {
        Caffeine: "radar/radar_caf.png",
        'Anti-oxydant': "radar/radar_nac.png",
        'Anti-inflammatory': "radar/radar_dex.png",
        Soothing: "radar/radar_enox.png",
        'GLP-1 agonist': "radar/radar_lira.png",
        'Botulinum toxin': "radar/radar_botox.png",
        'Caffeine + Anti-oxydant': "radar/radar_caf_nac.png",
        'Caffeine + Anti-inflammatory': "radar/radar_caf_dex.png",
        'Caffeine + Soothing': "radar/radar_caf_enox.png",
        'Caffeine + GLP-1 agonist': "radar/radar_caf_lira.png",
        'Caffeine + Botulinum toxin': "radar/radar_caf_botox.png",
        'Anti-oxydant + Anti-inflammatory': "radar/radar_nac_dex.png",
        'Anti-oxydant + Soothing': "radar/radar_nac_enox.png",
        'Anti-oxydant + GLP-1 agonist': "radar/radar_nac_lira.png",
        'Anti-oxydant + Botulinum toxin': "radar/radar_nac_botox.png",
        'Anti-inflammatory + Soothing': "radar/radar_dex_enox.png",
        'Anti-inflammatory + GLP-1 agonist': "radar/radar_dex_lira.png",
        'Anti-inflammatory + Botulinum toxin': "radar/radar_dex_botox.png",
        'Soothing + GLP-1 agonist': "radar/radar_enox_lira.png",
        'Soothing + Botulinum toxin': "radar/radar_enox_botox.png",
        'GLP-1 agonist + Botulinum toxin': "radar/radar_lira_botox.png"
    };

    img.src = radarImages[compoundName] || "radar/radar_background.png";
}

// optimal graph functions
function getStatus(value) {
    if (value > 75) return 'optimal';
    if (value > 50) return 'borderline';
    if (value > 25) return 'caution';
    if (value >= 0) return 'critical';
    return 'empty';
}

// Mapa de colores
const colorMap = {
    optimal: '#4CAF50', // verde
    borderline: '#FFEB3B', // amarillo
    caution: '#FF9800', // naranja
    critical: '#F44336', // rojo
    empty: '#E0E0E0' // gris claro
};

let isOptimalMode = false; // fuera de cualquier función, al inicio de tu script

function getBestCombination(selectedCompound) {
    // asegurarnos de que es un string
    if (Array.isArray(selectedCompound)) selectedCompound = selectedCompound[0];
    
    let bestCombo = null;
    let maxOptimalCount = -1; // número de valores >= 75%

    // recorremos todas las combinaciones
    for (const comboKey in combinationTemplates) {
        const comboParts = comboKey.split('_').map(normalizeKey);
        const selected = normalizeKey(selectedCompound);

        // ahora sí consistente
        if (!comboParts.includes(selected)) continue;

        const combo = combinationTemplates[comboKey];
        const score = combo.datas.score;
        if (!score) continue;

        // contar cuántos valores >= 75%
        const optimalCount = Object.values(score)
            .filter(v => v !== null && v !== undefined && Math.abs(v) >= 75)
            .length;

        if (optimalCount > maxOptimalCount) {
            maxOptimalCount = optimalCount;
            bestCombo = combo;
        }
    }

    // si no encontró ninguna combinación, devolver solo el compuesto
    if (!bestCombo) {
        return { datas: { score: compounds[selectedCompound] || {} }, label: selectedCompound };
    }

    return bestCombo;
}

function renderOptimalGraph(datas, label, isSolo) {
    const graphBlock = document.getElementById('optimal-graph-block');
    if (!graphBlock) return;

    // 🔴 BLOQUEO GLOBAL: si hay más de 1 compuesto, no mostrar nunca
    if (selectedCompounds.length !== 1) {
        graphBlock.innerHTML = '';
        const buttonContainer = document.getElementById('optimal-button-container');
        const labelContainer = document.getElementById('optimal-graph-label');

        if (buttonContainer) buttonContainer.innerHTML = '';
        if (labelContainer) labelContainer.textContent = '';

        return;
    }

    if (!isSolo) {
        graphBlock.innerHTML = `
            <div class="optimal-graph-empty">
                <p>Optimal graph is available for a single compound selection only.</p>
            </div>
        `;
        return;
    }

    const score = datas.score || datas.heat || null;
    if (!score) {
        graphBlock.innerHTML = `
            <div class="optimal-graph-empty">
                <p>No score data available yet for ${label}.</p>
            </div>
        `;
        return;
    }

    const points = Object.keys(score).map(name => {
        const raw = score[name];
        const status = raw === null || raw === undefined ? 'empty' : getStatus(raw);
        const pct = raw === null || raw === undefined ? 0 : Math.max(0, Math.min(100, raw));
        return {
            name,
            raw,
            status,
            pct,
            color: colorMap[status]
        };
    });

    const order = { empty: 0, critical: 1, caution: 2, borderline: 3, optimal: 4 };
    points.sort((a, b) => {
        if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
        return b.pct - a.pct;
    });

    const svgWidth = 800;
    const svgHeight = 600;
    const padding = 48;
    const bottomMargin = 180;
    const pointMargin = 20;
    const usableWidth = svgWidth - padding * 2 - pointMargin * 2;
    const usableHeight = svgHeight - padding - bottomMargin;
    const step = points.length > 1 ? usableWidth / (points.length - 1) : usableWidth;
    const pointCoordinates = points.map((p, i) => {
        const x = padding + pointMargin + step * i;
        const y = padding + usableHeight - (p.pct / 100) * usableHeight;
        return { ...p, x, y };
    });
    const svgPoints = pointCoordinates.map(p => `${p.x},${p.y}`).join(' ');

    const optimalBand = { from: 75, to: 100, fill: 'rgba(126, 187, 72, 0.32)' };
    const greenBand = `<rect x="${padding}" y="${padding + usableHeight - (optimalBand.to / 100) * usableHeight}" width="${usableWidth + pointMargin * 2}" height="${Math.max(0, (optimalBand.to - optimalBand.from) / 100 * usableHeight)}" fill="${optimalBand.fill}" rx="18" />`;

    const axisSegments = [
        { from: 0, to: 25, color: '#F44336' },
        { from: 25, to: 50, color: '#FF9800' },
        { from: 50, to: 75, color: '#FFEB3B' },
        { from: 75, to: 100, color: '#4CAF50' }
    ];

    const axisLines = axisSegments.map(segment => {
        const y1 = padding + usableHeight - (segment.to / 100) * usableHeight;
        const y2 = padding + usableHeight - (segment.from / 100) * usableHeight;
        return `<line x1="${padding - 12}" y1="${y1}" x2="${padding - 12}" y2="${y2}" stroke="${segment.color}" stroke-width="10" stroke-linecap="round" />`;
    }).join('');

    const segmentDefs = pointCoordinates.slice(0, -1).map((p, i) => {
        const next = pointCoordinates[i + 1];
        return `
            <linearGradient id="lineGrad${i}" gradientUnits="userSpaceOnUse" x1="${p.x}" y1="${p.y}" x2="${next.x}" y2="${next.y}">
                <stop offset="0%" stop-color="${p.color}" />
                <stop offset="100%" stop-color="${next.color}" />
            </linearGradient>
        `;
    }).join('');

    const segmentLines = pointCoordinates.slice(0, -1).map((p, i) => {
        const next = pointCoordinates[i + 1];
        return `<line x1="${p.x}" y1="${p.y}" x2="${next.x}" y2="${next.y}" stroke="url(#lineGrad${i})" stroke-width="4" stroke-linecap="round" />`;
    }).join('');

    const dots = pointCoordinates.map(p => {
        const label = p.raw === null || p.raw === undefined ? '-' : `${p.raw}%`;
        return `
            <circle cx="${p.x}" cy="${p.y}" r="7" fill="${p.color}" stroke="#fff" stroke-width="2"></circle>
            <text x="${p.x}" y="${p.y - 14}" class="optimal-graph-point-label">${label}</text>
        `;
    }).join('');

    const xLabels = pointCoordinates.map(p => {
        const label = p.name.replace(/-/g, ' ');
        const labelY = padding + usableHeight + 30;     // cambiar este valor para ajustar la posición vertical de las etiquetas x

        return `
            <text 
                x="${p.x}" 
                y="${labelY}" 
                text-anchor="end"
                transform="rotate(-45 ${p.x} ${labelY})"
                class="optimal-graph-xlabel">
                ${label}
            </text>
        `;
    }).join('');

    graphBlock.innerHTML = `
        <div class="optimal-graph-card">
            <div class="optimal-graph-chart">
                <svg viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet" class="optimal-graph-svg">
                    <defs>
                        ${segmentDefs}
                    </defs>
                    ${greenBand}
                    ${axisLines}
                    ${[100, 75, 50, 25, 0].map(value => {
                        const y = padding + usableHeight - (value / 100) * usableHeight;
                        return `
                            <line x1="${padding}" y1="${y}" x2="${svgWidth - padding}" y2="${y}" class="optimal-graph-grid-line" />
                            <text x="${padding - 28}" y="${y + 4}" class="optimal-graph-axis-label">${value}%</text>
                        `;
                    }).join('')}
                    ${segmentLines}
                    ${dots}
                    ${xLabels}
                </svg>
            </div>
        </div>
    `;

    const buttonContainer = document.getElementById('optimal-button-container');
    const labelContainer = document.getElementById('optimal-graph-label');

    if (isSolo && selectedCompounds.length === 1) {
        buttonContainer.innerHTML = `
            <button class="optimal-btn">OPTIMAL</button>
        `;
        const btn = buttonContainer.querySelector('.optimal-btn');

        btn.textContent = isOptimalMode ? "NORMAL" : "OPTIMAL";
        btn.classList.remove('optimal-active');
        btn.classList.toggle('optimal-active', isOptimalMode);

            btn.onclick = () => {
                isOptimalMode = !isOptimalMode; // alterna el modo

                const compoundKey = selectedCompounds[0];
                const bestCombo = getBestCombination(compoundKey);

                 if (isOptimalMode) {
                    // Modo OPTIMAL: calcula la mejor combinación
                    
                    if (!bestCombo) {
                        alert("No optimal combination found");
                        return;
                    }
                    renderOptimalGraph(bestCombo.datas, bestCombo.label, true);
                    labelContainer.textContent = `Optimal Combination: ${bestCombo.label}`;
                } else {
                    // Modo NORMAL: solo el compuesto original
                    renderOptimalGraph(compounds[compoundKey].datas, compoundKey, true);
                    labelContainer.textContent = `Compound: ${compounds[compoundKey].label}`;
                }

                // Cambiar color del botón
                btn.classList.toggle('optimal-active', isOptimalMode);
                if (isOptimalMode) {
                    labelContainer.textContent = `Optimal Combination: ${bestCombo.label}`;
                } else {
                    const compoundKey = selectedCompounds[0];
                    labelContainer.textContent = `Compound: ${compounds[compoundKey].label}`;
                }
            };

    } else {
        buttonContainer.innerHTML = '';
    }
}

buildButtons();

console.log("common.js loaded");