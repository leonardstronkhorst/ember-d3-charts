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

      // set up SVG
      // TODO make chart responsive
      const width = 960;
      const height = 500;
      const margin = { top: 20, right: 20, bottom: 30, left: 80 };
      const element = select($("#horizontal-chart")[0]);
      const svg = element
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");

      const g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // set up animation transition
      const t = transition().duration(1500);

      /*******************************************
       * Get data
       *******************************************/
      let data = this.get('data');

      const getTicksCount = maxValue => {
      return Math.min(maxValue,5);
      };

      /*******************************************
       * Scales
       *******************************************/
      const xScale = scaleLinear()
      .domain([0, data.numberOfUniqueAnswers])
      .range([0, width - margin.left - margin.right]);

      const yScale = scaleBand()
      .domain(data.labels)
      .range([height - margin.top - margin.bottom, 0])
      .padding(0.1);

      /*******************************************
       * Axis
       *******************************************/
      const yAxis = axisLeft().scale(yScale);
      g.append("g")
      .attr("transform", `translate(0,0)`)
      .classed("y-axis", true)
      .call(yAxis);

      const xAxis = axisBottom()
      .ticks(getTicksCount(data.numberOfUniqueAnswers))
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
      .transition(t)
      .attr("width", d => xScale(d));

      /*******************************************
       * Draw hover boxes
       *******************************************/
      // Read
      // https://github.com/d3/d3-selection#event
      rect
      .on("mousemove", (d, i) => {
          const percentace = (d * 100) / data.numberOfUniqueAnswers;
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
