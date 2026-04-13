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
    const dataA = compounds[keyA].datas;
    const dataB = compounds[keyB].datas;

    const datas = {
        score: combineMaps(dataA.score || {}, dataB.score || {})
    };

    renderAll(datas);
}

function renderScreeningCompartments() {
    const block = document.getElementById('compartments-block');

    let html = '<div class="table">';

    compartments.forEach(name => {
        const newName = screeningCompartmentsMap[name] || name;

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

    let html = '<div class="table">';

    compartments.forEach(name => {
        const value = datas.score?.[name];

        const color = value != null ? scoreColor(value) : '#eee';
        const sign = value >= 0 ? '+' : '';

        html += `
            <div class="row">
                <div class="cell" style="background:${color}">
                    ${sign}${value?.toFixed(2) ?? '-'}
                </div>
            </div>
        `;
    });

    html += '</div>';
    block.innerHTML = html;
}

function renderAll(datas) {
    renderScreeningCompartments();
    renderScreeningScore(datas);
}

console.log("screening.js loaded");