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

        html += `
            <div class="row">
                <div class="cell" style="background:${color}">
                    ${value !== -Infinity ? sign + value.toFixed(2) : '-'}
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

console.log("screening.js loaded");