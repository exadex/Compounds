const screeningCompartmentsMap = {
    "Nutrient-sensing": "Metabolic homeostasis",
    "Stem cell capacity": "Stem cell regeneration",
    "Cell-ECM communication": "Collagen synthesis and fibroblasts",
    "Mitochondrial function": "Energy and mitochondria",
    "Chronic inflammation": "Inflammaging",
    "Neural communication": "Neural communication",
    "Vascular/Lymphatic Flow": "Vascular flow and lymphatic drainage"
};

function renderCompound(key) {
    const { datas, label } = compounds[key];

    updateRadarImage(label);        // en esta parte, las funciones que salgan aqui es lo que aparece en la pagina web
    renderAll(datas);

    renderOptimalGraph(datas, label, true); // idem
}

function renderCombination(keyA, keyB) {

    const comboKey = `${keyA}_${keyB}`;
    const comboKeyReverse = `${keyB}_${keyA}`;

    const combo =
        combinationTemplates[comboKey] ||
        combinationTemplates[comboKeyReverse];

    let datas;
    let label;

    if (combo && combo.datas) {
        // ✅ USE PREDEFINED DATA (TU CASO IDEAL)
        datas = combo.datas;
        label = combo.label;

    } else {
        // fallback: computed combination
        const dataA = compounds[keyA].datas;
        const dataB = compounds[keyB].datas;

        datas = {
            heat: combineMaps(dataA.heat || {}, dataB.heat || {}),
            score: combineMaps(dataA.score || {}, dataB.score || {}),
            antiAging: (dataA.antiAging + dataB.antiAging) / 2,
            ageGain: (dataA.ageGain + dataB.ageGain) / 2
        };

        label = `${compounds[keyA].label} + ${compounds[keyB].label}`;
    }

    renderAll(datas);
}

function getSortedCompartments(datas) {
    return compartments
        .map(name => ({
            name,
            value: datas.score?.[name] ?? -Infinity
        }))
        .sort((a, b) => b.value - a.value);
}

function renderScreeningCompartments(datas) {
    const block = document.getElementById('compartments-block');

    const sorted = getSortedCompartments(datas);

    let html = '<div class="table">';

    sorted.forEach(item => {
        const newName = screeningCompartmentsMap[item.name] || item.name;

        html += `
            <div class="row">
                <div class="cell">${newName}</div>
            </div>
        `;
    });

    html += '</div>';
    block.innerHTML = html;
}

function renderScreeningScore(datas) {
    const block = document.getElementById('score-block');

    const sorted = getSortedCompartments(datas);

    let html = '<div class="table">';

    sorted.forEach(item => {
        const value = item.value;

        const color = value !== -Infinity ? scoreColor(value) : '#eee';
        const sign = value >= 0 ? '+' : '';

        const displayValue =
            value !== -Infinity
                ? `${sign}${Math.round(value)}%`
                : '-';

        html += `
            <div class="row">
                <div class="cell" style="background:${color}">
                    ${displayValue}
                </div>
            </div>
        `;
    });

    html += '</div>';
    block.innerHTML = html;
}

function renderAll(datas) {
    renderScreeningCompartments(datas);
    renderScreeningScore(datas);
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
        const label = screeningCompartmentsMap[p.name] || p.name;
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

console.log("screening.js loaded");