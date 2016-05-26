import './style.less';
import React, { Component } from 'react';
import d3                   from 'd3';
import _                    from 'lodash';
import Piechart             from 'components/Piechart';
import Barchart             from 'components/Barchart';
import Picker               from 'components/Picker';
import BucketedScatterPlot  from 'components/BucketedScatterPlot';
import { TopAxis }          from 'components/Axis';

const parseRow = (d) => {
    return {
        id              : d.NetworkID,
        job_interest    : d.JobRoleInterest,
        already_working : Boolean(Number(d.IsSoftwareDev)),
        expect_earn     : Number(d.ExpectedEarning),
        age             : Number(d.Age),
        hours_learning  : Number(d.HoursLearning),
        income          : Number(d.Income),
        job_preference  : d.JobPref,
        job_where       : d.JobWherePref
    };
};

const fixRow = (d) => {
    if (d.expect_earn < 10000) d.expect_earn *= 12;
    return d;
};

class App extends Component {

    state = {
        data      : [],
        bucketKey : 'job_interest',
        distroKey : 'income'
    };

    qualitative_options = ['job_interest', 'already_working', 'job_preference', 'job_where'];

    quantitative_options = ['expect_earn', 'age', 'hours_learning', 'income'];


    componentWillMount() {
        d3.csv('./2016-FCC-New-Coders-Survey-Data.csv')
            .row((d) => fixRow(parseRow(d)))
            .get((err, data) => {
                this.setState({data: _.uniqBy(data, (d) => d.id)});
            });
    }

    pickQualitative(newKey) {
        console.log("pickQual", Number(new Date()));
        this.setState({bucketKey: newKey});
    }

    pickQuantitative(newKey) {
        console.log("pickQuan", Number(new Date()));
        this.setState({distroKey: newKey});
    }

    render() {
        return (
            <div className="container">
                <h2>FreeCodeCamp Survey correlation explorer</h2>

                <div>
                    Choose qualitative axis
                    <Picker options={this.qualitative_options}
                            onPick={::this.pickQualitative}
                            picked={this.state.bucketKey} />
                </div>

                <div>
                    Choose quantitative axis
                    <Picker options={this.quantitative_options}
                            onPick={::this.pickQuantitative}
                            picked={this.state.distroKey} />
                </div>

                <svg width="900" height="600">
                    <Barchart x="20"
                              y="100"
                              height="500"
                              width="800"
                              data={this.state.data}
                              value={(d) => d[this.state.bucketKey]} />

                    <BucketedScatterPlot x="220"
                                         y="100"
                                         height="480"
                                         width={800-220}
                                         data={this.state.data}
                                         bucket={(d) => d[this.state.bucketKey]}
                                         value={(d) => d[this.state.distroKey]} />

                    <TopAxis data={this.state.data}
                             value={(d) => d[this.state.distroKey]}
                             maxDimension={800-220}
                             x={220}
                             y={95}
                             className="topAxis" />
                </svg>
            </div>
        );
    }
}

export default App;
