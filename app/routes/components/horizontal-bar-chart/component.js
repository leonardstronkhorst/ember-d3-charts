import Component from '@ember/component';
import { select, event as currentEvent } from 'd3-selection';
import { transition } from 'd3-transition';
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'
import { format } from 'd3-format'
import $ from 'jquery';

export default Component.extend({
    data: {
        "values": [
          1,
          0,
          4,
          11,
          11
        ],
        "labels": [
          "Not good",
          "Could be better",
          "Okay",
          "Pretty good",
          "Fantastic"
        ],
        "text": null,
        "numberOfUniqueAnswers": 27,
        "maxFrequency": 11
      },

    didInsertElement() {
      this.set('transition', transition().duration(1500));
      this.set('xScale', scaleLinear());
      this.set('yScale', scaleBand().padding(0.1));
      this.set('yAxis', axisLeft());
      this.set('xAxis', axisBottom());

      this.renderChart();
    },
    getTicksCount(maxValue) {
      return Math.min(maxValue,5);
    },
    renderChart() {
      // set up SVG
      // TODO: make chart responsive
      const element = select($("#horizontal-chart")[0]);
      const svg = select($("#horizontal-bar-chart")[0]);
      const domRect = svg.node().getBoundingClientRect();
      const margin = { top: 20, right: 20, bottom: 30, left: 80 };
      const width = domRect.width;
      const height = domRect.height;

      const g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // set up animation transition
      const transition = this.get('transition');

      /*******************************************
       * Get data
       *******************************************/
      let data = this.get('data');

      /*******************************************
       * Scales
       *******************************************/
      let xScale = this.get('xScale')
      .domain([0, data.numberOfUniqueAnswers])
      .range([0, width - margin.left - margin.right]);

      let yScale = this.get('yScale')
      .domain(data.labels)
      .range([height - margin.top - margin.bottom, 0])
      

      /*******************************************
       * Axis
       *******************************************/
      let yAxis = this.get('yAxis').scale(yScale);
      g.append("g")
      .attr("transform", `translate(0,0)`)
      .classed("y-axis", true)
      .call(yAxis);

      let xAxis = this.get('xAxis')
      .ticks(this.getTicksCount(data.numberOfUniqueAnswers))
      .tickSizeInner([-(height - margin.top - margin.bottom)])
      .scale(xScale);

      g.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .classed("x-axis", true)
      .call(xAxis);

      /*******************************************
       * Draw chart
       *******************************************/
      const rect = g
      .append("g")
      .attr("class", "bars")
      .selectAll(".bar")
      .data(data.values)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", "#02a79c")
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .attr("y", (d, i) => yScale(data.labels[i]))
      .attr("width", 0);

      svg.selectAll(".bar")
      .transition(transition)
      .attr("width", d => xScale(d));

      /*******************************************
       * Draw hover boxes
       *******************************************/
      // Read
      // https://github.com/d3/d3-selection#event
      rect
      .on("mousemove", (d, i) => {
          const percentace = (d * 100) / data.numberOfUniqueAnswers;
          // TODO: let ember handle the state
          let hover = select($('#hover')[0]);
          hover
          .style("left", `${currentEvent.pageX - 50}px`)
          .style("top", `${currentEvent.pageY - 30}px`)
          .style("display", "inline-block")
          .html(`${format(".1f")(percentace)}% ${data.labels[i]}`);
      })
      .on("mouseout", () => 
      {
        // TODO better way to handle
        select($('#hover')[0]).style("display", "none");
      });

      /*******************************************
       * Text
       *******************************************/
      element.select(".bars")
      .selectAll("text")
      .data(data.values)
      .enter()
      .append("text")
      .style("fill", d => (d > 0 ? "#fff" : "#02a79c"))
      .style("font-size", "14px")
      .attr("x", d => xScale(d) / 2 + 2)
      .attr("y", (d, i) => yScale(data.labels[i]) + margin.bottom + margin.top - 5)
      .text(d => d);
    
    }

  });
