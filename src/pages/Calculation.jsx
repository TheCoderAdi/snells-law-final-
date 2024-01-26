/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */

import { useEffect, useState } from "react";
import "../styles/Calculation.css";
import $ from "jquery";

const Calculation = () => {
    var animatedAngle = 45;
    var rayLength = 0.25;
    var width = 0, height = 0;
    const options = [
        { value: '1', label: 'Vacuum' },
        { value: '1.00027653', label: 'Air (under STP)' },
        { value: '1.3317', label: 'Water' },
        { value: '1.3604', label: 'Ethanol' },
        { value: '1.4707', label: 'Glycerol' },
        { value: '1.4887', label: 'Acrylic Glass' },
        { value: '1.514', label: 'Borosilicate Glass' },
        { value: '1.5875', label: 'Polystyrene' },
        { value: '2.409', label: 'Diamond' },
        { value: '3.8771', label: 'Silicone' }
    ];
    const [n1, setN1] = useState("1");
    const [n2, setN2] = useState("1.00027653");

    const handleSelectChange = (event, setValue) => {
        const selectedValue = event.target.value;
        setValue(selectedValue);
    };
    const updateAngle = (deg) => {
        animatedAngle = deg;
        var totalReflectionAngle = Math.asin(n2 / n1);
        var phi = deg * 2 * Math.PI / 180;

        if (deg > 180 && deg < 270) {
            updateAngle(180);
        } else if (deg >= 270) {
            updateAngle(0);
        } else if (Math.abs((Math.PI - phi) * 180 / (2 * Math.PI)) > totalReflectionAngle * 180 / Math.PI) {

            var angleIndicatorOuter = d3.arc()
                .innerRadius(50)
                .outerRadius(52)
                .startAngle(0)
                .endAngle(-phi / 2 + Math.PI / 2);

            d3.select('#anglePath').attr('d', angleIndicatorOuter);

            var angleIndicatorInner = d3.arc()
                .innerRadius(0)
                .outerRadius(50)
                .startAngle(0)
                .endAngle(-phi / 2 + Math.PI / 2);

            d3.select('#anglePath2').attr('d', angleIndicatorInner);

            var angleIndicatorOuter2 = d3.arc()
                .innerRadius(50)
                .outerRadius(52)
                .startAngle(0)
                .endAngle(phi / 2 - Math.PI / 2);

            d3.select('#anglePathS').attr('d', angleIndicatorOuter2);

            var angleIndicatorInner2 = d3.arc()
                .innerRadius(0)
                .outerRadius(50)
                .startAngle(0)
                .endAngle(phi / 2 - Math.PI / 2);

            d3.select('#anglePath2S').attr('d', angleIndicatorInner2);

            d3.select('#rayIn').attr('x2', width / 2 + Math.cos(phi / 2) * width * rayLength)
                .attr('y2', height / 2 - Math.sin(phi / 2) * width * rayLength)

            d3.select('#rayReflected').attr('x2', width / 2 + Math.sin(phi / 2 - Math.PI / 2) * 10 * width)
                .attr('y2', height / 2 - Math.cos(phi / 2 - Math.PI / 2) * 10 * width);

            d3.select('#dragPoint').attr('cx', width / 2 + Math.cos(phi / 2) * height / 2.5)
                .attr('cy', height / 2 - Math.sin(phi / 2) * height / 2.5)
                .datum({
                    x: width / 2 + Math.cos(phi / 2) * height / 2.5,
                    y: height / 2 - Math.sin(phi / 2) * height / 2.5
                }).raise();
        }
        else {
            var angleIndicatorInnera = d3.arc()
                .innerRadius(0)
                .outerRadius(50)
                .startAngle(0)
                .endAngle(-phi / 2 + Math.PI / 2);

            d3.select('#anglePath2').attr('d', angleIndicatorInnera);

            var angleIndicatorInner2a = d3.arc()
                .innerRadius(0)
                .outerRadius(50)
                .startAngle(0)
                .endAngle(phi / 2 - Math.PI / 2);

            d3.select('#anglePath2S').attr('d', angleIndicatorInner2a);

            var phi2 = (Math.asin(n1 / n2 * Math.sin(phi / 2 - Math.PI / 2)) + Math.PI) * (-1);

            var angleIndicatorInner3 = d3.arc()
                .innerRadius(0)
                .outerRadius(50)
                .startAngle(-Math.PI)
                .endAngle(phi2);

            d3.select('#anglePath2S2').attr('d', angleIndicatorInner3);

            d3.select('#rayIn').attr('x2', width / 2 + Math.cos(phi / 2) * width * rayLength)
                .attr('y2', height / 2 - Math.sin(phi / 2) * width * rayLength);

            d3.select('#rayReflected').attr('x2', width / 2 + Math.sin(phi / 2 - Math.PI / 2) * 10 * width)
                .attr('y2', height / 2 - Math.cos(phi / 2 - Math.PI / 2) * 10 * width);

            d3.select('#rayRefracted').attr('x2', width / 2 + Math.sin(phi2) * 10 * width)
                .attr('y2', height / 2 - Math.cos(phi2) * 10 * width);
            d3.select('#dragPoint').attr('cx', width / 2 + Math.cos(phi / 2) * height / 2.5)
                .attr('cy', height / 2 - Math.sin(phi / 2) * height / 2.5)
                .datum({
                    x: width / 2 + Math.cos(phi / 2) * height / 2.5,
                    y: height / 2 - Math.sin(phi / 2) * height / 2.5
                }).raise();


        }
    }
    const round = (number, precision) => {
        var pair = (number + "e").split("e");
        var value = Math.round(pair[0] + "e" + (+pair[1] + precision));
        pair = (value + "e").split("e");
        return +(pair[0] + "e" + (+pair[1] - precision));
    }
    useEffect(() => {
        width = $(document).width();
        height = $(document).height();
        updateAngle(animatedAngle);
    }, [n1, n2])
    useEffect(() => {
        var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(d3.zoom().on("zoom", function () {
                svg.attr("transform", d3.event.transform);
            }))
            .append("g");

        var viewport = svg.append('g');

        var x = d3.scaleLinear().range([width / 2 - 5000 * width / height, width / 2 + 5000 * width / height]).domain([-50, 50]);
        var y = d3.scaleLinear().range([height / 2 - 5000 * width / height, height / 2 + 5000 * width / height]).domain([50, -50]);

        svg.append("g")
            .attr("transform", "translate(" + 0 + "," + height / 2 + ")")
            .call(d3.axisBottom(x).ticks(100)).attr("stroke", "white")

        svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + 0 + ")").attr("stroke", "white")
            .call(d3.axisLeft(y).ticks(100));
        $(".domain , .tick line").css("stroke", "white");
        viewport.append('line')
            .attr('x1', width / 2)
            .attr('y1', height / 2)
            .attr('x2', width * rayLength + width / 2)
            .attr('y2', height / 2)
            .attr("stroke-width", 2)
            .attr("stroke", "red")
            .attr('id', 'rayIn');

        viewport.append('line')
            .attr('x1', width / 2)
            .attr('y1', height / 2)
            .attr('x2', width / 2)
            .attr('y2', height / 2)
            .attr("stroke-width", 2)
            .attr("stroke", "red")
            .attr('id', 'rayReflected');

        viewport.append('line')
            .attr('x1', width / 2)
            .attr('y1', height / 2)
            .attr('x2', width / 2)
            .attr('y2', height / 2)
            .attr("stroke-width", 2)
            .attr("stroke", "red")
            .attr('id', 'rayRefracted');

        viewport.append('circle')
            .attr('cx', height / 2.5 + width / 2)
            .attr('cy', height / 2)
            .attr('r', 5)
            .attr('id', 'dragPoint')
            .style('fill', 'blue')
            .datum({
                x: height / 2.5 + width / 2,
                y: height / 2
            })
            .call(d3.drag()
                .on("start", () => d3.select(this).classed("active", true))
                .on("drag", dragged)
                .on("end", () => d3.select(this).classed("active", false)));
        var angleIndicatorInner = d3.arc()
            .innerRadius(0)
            .outerRadius(50)
            .startAngle(0)
            .endAngle(0);

        var angleIndicatorOuter = d3.arc()
            .innerRadius(50)
            .outerRadius(52)
            .startAngle(0)
            .endAngle(0);

        viewport.append('path')
            .attr('d', angleIndicatorInner)
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
            .attr('id', 'anglePath2')
            .style('fill', 'green')
            .style('opacity', 1);

        viewport.append('path')
            .attr('d', angleIndicatorInner)
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
            .attr('id', 'anglePath2S')
            .style('fill', 'orange')
            .style('opacity', 1);

        viewport.append('path')
            .attr('d', angleIndicatorOuter)
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
            .attr('id', 'anglePathS2')
            .style('fill', 'blue');

        viewport.append('path')
            .attr('d', angleIndicatorInner)
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
            .attr('id', 'anglePath2S2')
            .style('fill', 'blue')
            .style('opacity', 1);

        updateAngle(45);
        function dragged(d) {
            d.x += d3.event.dx;
            d.y += d3.event.dy;

            var x1 = width / 2 - d.x;
            var y1 = height / 2 - d.y;
            var phi;
            if (y1 < 0) {
                phi =
                    2 * Math.PI + 2 * Math.acos(x1 / (Math.sqrt(x1 * x1 + y1 * y1) * 1));
            } else {
                phi = 2 * Math.acos(x1 / (Math.sqrt(x1 * x1 + y1 * y1) * -1));
            }

            updateAngle(round((phi * 180) / (2 * Math.PI), 2));
        }
    }, []);
    return (
        <div id="calc">
            <div className="menu">
                <div className="form-group">
                    <label htmlFor="inpuFname">n&#x2081;:</label>
                    <div className="input-group">
                        <select
                            className="form-control"
                            id="n1"
                            value={n1}
                            onChange={(e) => handleSelectChange(e, setN1)}
                        >
                            <option>Select n&#x2081;</option>
                            {options.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            className="form-control"
                            name="text"
                            id="n1text"
                            value={n1}
                            onChange={() => (null)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="inpuFname">n&#x2082;:</label>
                    <div className="input-group">
                        <select
                            className="form-control"
                            id="n2"
                            value={n2}
                            onChange={(e) => handleSelectChange(e, setN2)}
                        >
                            <option value="">Select n&#x2082;</option>
                            {options.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            className="form-control"
                            name="text"
                            id="n2text"
                            value={n2}
                            onChange={() => (null)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Calculation;
