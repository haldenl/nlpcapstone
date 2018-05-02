class TextHighlighter {
    constructor(inputContainer, outputContainer) {
        this._inputContainer = inputContainer;
        this._outputContainer = outputContainer;
        this._colorScheme = ['#e8f0ff','#cfdeff','#b7ccff','#9abbff','#7caaff']      
    }

    render(data) {
        this._data = data;

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
            span.setAttribute('id', `input-${i}`);
            span.classList.add('token');
            span.style.backgroundColor = color(aggregateData[i].weight);
            span.innerHTML = inputToken + ' ';

            this._inputContainer.appendChild(span);
        }
        
        for (let i = 0; i < outputTokens.length; i++) {
            const outputToken = outputTokens[i];

            const span = document.createElement('span');
            span.classList.add('token');
            span.innerHTML = outputToken + ' ';

            span.addEventListener('mouseenter', () => {
                this.focusOutputToken(i);
                this._outputMouseover(i);
            });
            this._outputContainer.appendChild(span);
        }
    }

    focusOutputToken(outputIndex) {
        const dataToShow = this._data.filter((d) => { return d.outputIndex === outputIndex; });
        this.updateInputText(dataToShow);
    }

    updateInputText(data) {
        const inputTokens = [];
    
        const inputDomain = data.map((d) => { return d.inputIndex; });
    
        for(let i = 0; i <= inputDomain[inputDomain.length - 1]; i++) {
            inputTokens.push(data[i].inputToken);
        }

        const weightDomain = [0, d3.max(data, (d) => { return d.weight; })];
        color = d3.scaleQuantize().range(this._colorScheme).domain(weightDomain);

        for (let i = 0; i < inputTokens.length; i++) {
            const span = document.querySelector(`#input-${i}`);
            span.style.backgroundColor = color(data[i].weight);

        }
    }

    setOutputMouseover(callback) {
        this._outputMouseover = callback;
    }
}