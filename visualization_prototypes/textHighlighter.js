class TextHighlighter {
    constructor(inputContainer, outputContainer) {
        this._inputContainer = inputContainer;
        this._outputContainer = outputContainer;
        this._colorScheme = ['#e8f0ff','#cfdeff','#b7ccff','#9abbff','#7caaff'];

        this._start = -1;
        this._end = -1;
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
            
        const weightDomain = [0, d3.max(aggregateData, (d) => { return d.weight * 2; })];
        color = d3.scaleSequential(d3.interpolateBlues).domain(weightDomain);

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
            span.setAttribute('id', `output-${i}`);
            span.classList.add('token');
            span.innerHTML = outputToken + ' ';

            span.addEventListener('mouseenter', () => {
                if (this._start === -1 && this._end === -1) {
                    this.focusOutputToken(i);
                } else if (this._start !== -1) {
                    this._end = i;
                    this.focusOutputSequence(this._start, this._end);
                }

                if (this._outputMouseover) {
                    this._outputMouseover(i);
                }
            });

            span.addEventListener('mouseout', () => {
                if (this._end === -1) {
                    document.querySelector(`#output-${i}`).style.backgroundColor = null;
                    this.updateInputText(this._data);
                }
            })

            span.addEventListener('mousedown', () => {
                this._start = i;
            });

            span.addEventListener('mouseup', () => {
                this._start = -1;
            })

            this._outputContainer.appendChild(span);
        }

        window.addEventListener('mousedown', () => {
            if (this._start === -1 && this._end !== -1) {
                this._start = -1;
                this._end = -1;
                this.updateInputText(this._data);
            }
        });
    }

    focusOutputSequence(start, end) {
        const dataToShow = this._data.filter((d) => {
            return d.outputIndex >= start && d.outputIndex <= end;
        });
        this.updateInputText(dataToShow);
    }

    focusOutputToken(outputIndex) {
        const span = document.querySelector(`#output-${outputIndex}`);
        span.style.backgroundColor = '#ff8c8c';

        const dataToShow = this._data.filter((d) => { return d.outputIndex === outputIndex; });
        this.updateInputText(dataToShow);
    }

    updateInputText(data) {
        const aggregateData = d3.nest()
            .key((d) => { return d.inputIndex; })
            .rollup((g) => { return d3.max(g, (d) => { return d.weight; }) }) 
            .entries(data)
            .map((d) => { return { inputIndex: +d.key, weight: d.value }; });

        const inputTokens = [];
    
        const inputDomain = aggregateData.map((d) => { return d.inputIndex; });
    
        for(let i = 0; i <= inputDomain[inputDomain.length - 1]; i++) {
            inputTokens.push(data[i].inputToken);
        }

        const weightDomain = [0, d3.max(data, (d) => { return d.weight * 2; })];
        color = d3.scaleSequential(d3.interpolateBlues).domain(weightDomain);

        for (let i = 0; i < inputTokens.length; i++) {
            const span = document.querySelector(`#input-${i}`);
            span.style.backgroundColor = color(aggregateData[i].weight);

        }
    }

    setOutputMouseover(callback) {
        this._outputMouseover = callback;
    }
}