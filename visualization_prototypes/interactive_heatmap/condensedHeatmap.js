class CondensedHeatmap {
    constructor(chart) {
        this._chart = chart;
    }

    render(data) {
        const inputDomain = data.map((d) => { return d.inputIndex; });
        const outputDomain = data.map((d) => { return d.outputIndex; });
        const weightDomain = [0, d3.max(data, (d) => { return d.weight; })];
    
        this._x = d3.scaleBand().range([0, width]).padding(0).domain(inputDomain);
        this._y = d3.scaleBand().range([0, height]).padding(0).domain(outputDomain);
        this._color = d3.scaleQuantize().range(d3.schemeReds[5]).domain(weightDomain);
        this._grey = d3.scaleQuantize().range(d3.schemeGreys[5]).domain(weightDomain);
    
        const rects = this._chart.selectAll('.rect')
            .data(data);
    
        rects.enter().append('rect')
            .attr('class', 'rect')
            .attr('x', (d) => { return this._x(d.inputIndex); })
            .attr('y', (d) => { return this._y(d.outputIndex); })
            .attr('width', this._x.bandwidth())
            .attr('height', (d) => { return this._y.bandwidth()})
            .attr('fill', (d) => { return this._color(d.weight); });
    }

    highlightRow(outputIndex) {
        const rects = this._chart.selectAll('.rect');

        rects.attr('fill', (d) => {
            if (d.outputIndex === outputIndex) {
                return this._color(d.weight);
            } else {
                return this._grey(d.weight * 0.5);
            }
        });
    }
}