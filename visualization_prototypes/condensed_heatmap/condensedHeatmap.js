class CondensedHeatmap {
    constructor(chart) {
        this._chart = chart;
    }

    render(data) {
        const inputDomain = data.map((d) => { return d.inputIndex; });
        const outputDomain = data.map((d) => { return d.outputIndex; });
        const weightDomain = [0, d3.max(data, (d) => { return d.weight; })];
    
        x = d3.scaleBand().range([0, width]).padding(0).domain(inputDomain);
        y = d3.scaleBand().range([0, height]).padding(0).domain(outputDomain);
        color = d3.scaleQuantize().range(d3.schemeReds[5]).domain(weightDomain);
    
        const rects = this._chart.selectAll('.rect')
            .data(data);
    
        rects.enter().append('rect')
            .attr('class', 'rect')
            .attr('x', (d) => { return x(d.inputIndex); })
            .attr('y', (d) => { return y(d.outputIndex); })
            .attr('width', x.bandwidth())
            .attr('height', (d) => { return y.bandwidth()})
            .attr('fill', (d) => { return color(d.weight); });
    }
}