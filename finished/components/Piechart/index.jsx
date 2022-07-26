import React, { Component } from 'react';
import d3                   from 'd3';
import { LabeledArc }       from './Arc';

class Piechart extends Component {
    constructor(props) {
        super(props);
        this.pie = d3.pie().value((d) => d.value);
    }

    arcGenerator(d, i) {
        return (
            <LabeledArc key={`arc-${i}`}
                        data={d}
                        innerRadius={this.props.innerRadius}
                        outerRadius={this.props.outerRadius}
                        i={i} />
        );
    }

    render() {
        let pie = this.pie(this.props.data),
            translate = `translate(${this.props.x}, ${this.props.y})`;

        return (
           <g transform={translate}>
               {pie.map((d, i) => this.arcGenerator(d, i))}
           </g>
        )
    }
}

export default Piechart;
