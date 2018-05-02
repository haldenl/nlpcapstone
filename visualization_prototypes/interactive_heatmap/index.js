const svg = d3.select('#vis');
const margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};
const width = svg.attr('width') - margin.left - margin.right;
const height = svg.attr('height') - margin.top - margin.bottom;

let x;
let y;
let color;

let exampleNum = 0;

function main() {
    d3.json('../../data/data_0.json').then((data) => {
        render(data);
        setupButtons();
        hideLoading();
    })
}

function setupButtons() {
    const dec = document.querySelector('#prev-example');
    const inc = document.querySelector('#next-example');

    dec.addEventListener('click', () => { updateData(-1) });
    inc.addEventListener('click', () => { updateData(1) });
}

function updateData(n) {
    showLoading();
    d3.json(`../../data/data_${exampleNum + n}.json`).then((data) => {
        exampleNum += n;
        document.querySelector('#example-num').textContent = exampleNum;        
        render(data);
        hideLoading();
    }, (reason) => { });
    hideLoading();
}

function render(data) {
    const chart = svg.append('g')
        .attr('id', 'chart')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // const vis = new CondensedHeatmap(chart);
    // vis.render(data);

    // produce the text
    const inputContainer = document.querySelector('#input-text');
    const outputContainer = document.querySelector('#output-text');
    
    // clear the text
    inputContainer.innerHTML = '<b>Input Text: </b>';
    outputContainer.innerHTML = '<b>Output Text: </b>';

    const textHighlighter = new TextHighlighter(inputContainer, outputContainer);
    // textHighlighter.setOutputMouseover((i) => { vis.highlightRow(i); });

    textHighlighter.render(data);
}

function showLoading() {
    document.querySelector('#content').style.visibility = 'hidden';
    document.querySelector('#loading').style.visibility = 'visible';
}

function hideLoading() {
    document.querySelector('#content').style.visibility = 'visible';
    document.querySelector('#loading').style.visibility = 'hidden';
}

main();