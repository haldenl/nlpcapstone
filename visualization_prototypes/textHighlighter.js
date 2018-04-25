class TextHighlighter {
    constructor(inputContainer, outputContainer) {
        this._inputContainer = inputContainer;
        this._outputContainer = outputContainer;
        this._colorScheme = ['#e8f0ff','#cfdeff','#b7ccff','#9abbff','#7caaff']      
    }

    render(data) {
        const inputTokens = [];
        const outputTokens = [];
    
        const inputDomain = data.map((d) => { return d.inputIndex; });
        const outputDomain = data.map((d) => { return d.outputIndex; });
    
        for(let i = 0; i <= inputDomain[inputDomain.length - 1]; i++) {
            inputTokens.push(data[i].inputToken);
        }
        for (let i = 0; i <= outputDomain[outputDomain.length - 1]; i++) {
            outputTokens.push(data[i * (inputDomain[inputDomain.length - 1] + 1)].outputToken);
        }

        const aggregateData = d3.nest()
            .key((d) => { return d.inputIndex; })
            .rollup((g) => { return d3.max(g, (d) => { return d.weight; }) }) 
            .entries(data)
            .map((d) => { return { inputIndex: +d.key, weight: d.value }; });
            
        const weightDomain = [0, d3.max(aggregateData, (d) => { return d.weight; })];
        color = d3.scaleQuantize().range(this._colorScheme).domain(weightDomain);

        for (let i = 0; i < inputTokens.length; i++) {
            const inputToken = inputTokens[i];

            const span = document.createElement('span');
            span.classList.add('token');
            span.style.backgroundColor = color(aggregateData[i].weight);
            span.innerHTML = inputToken + ' ';

            this._inputContainer.appendChild(span);
        }
        // const inputString = '<b>Input Text:</b> ' + inputTokens.join(' ');
        const outputString = '<b>Output Text:</b> ' + outputTokens.join(' ');

        // self._inputContainer.innerHTML = inputString;
        this._outputContainer.innerHTML = outputString;
    }
}