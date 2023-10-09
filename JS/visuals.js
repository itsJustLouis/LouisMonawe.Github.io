//Assignment Starts here
    const asteroids_api_url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2023-08-25&end_date=2023-09-01&api_key=dhPb2jn8OnyMTgJTHGnxhYWq5oB9aCgwLu1GeGs5'; //Define API
 
    async function getNasaAsteroids(){
      const response = await fetch(asteroids_api_url);
      const data = await response.json(); 
    //  console.log(data.near_earth_objects);

    for (const date in data.near_earth_objects) {      
      //console.log(`Date: ${date}`);
      const asteroids = data.near_earth_objects[date];
      const asteroidCount = asteroids.length;
   //   console.log(`Number of Asteroids on ${date}: ${asteroidCount}`);
    }

     const dates = Object.keys(data.near_earth_objects);
     dates.sort(); 
    const asteroidCounts = dates.map(date => data.near_earth_objects[date].length);
   // console.log( dates);


     const margin = { top: 30, right: 30, bottom: 50, left: 60 };
     const width = 800 - margin.left - margin.right;
     const height = 400 - margin.top - margin.bottom;
 
// this will create a graph and make it also responsive
     const svg = d3.select("#canvas")
       .append("svg")
       .attr("preserveAspectRatio", "xMinYMin meet")
       .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
       .classed("svg-content-responsive", true); 

   const g = svg.append("g")
     .attr("transform", `translate(${margin.left},${margin.top})`);

   const x = d3.scaleBand()
     .range([0, width])
     .domain(dates)
     .padding(0.1);

   const y = d3.scaleLinear()
     .range([height, 0])
     .domain([0, d3.max(asteroidCounts)]);

   g.append("g")
     .attr("transform", `translate(0,${height})`)
     .call(d3.axisBottom(x))
     .selectAll("text")
     .style("text-anchor", "middle")
     .attr("dy", "0.7em");

   g.append("g")
     .call(d3.axisLeft(y))
     .selectAll("text")
     .attr("dy", "-0.5em");

   const bars = g.selectAll(".bar")
     .data(asteroidCounts)
     .enter().append("rect")
     .attr("class", "bar")
     .attr("x", (d, i) => x(dates[i]))
     .attr("y", d => y(d))
     .attr("width", x.bandwidth())
     .attr("height", d => height - y(d))
     .attr("fill", (d, i) => {
       const colors = [
         'rgba(225, 99, 110, 0.3)',
         'rgba(54, 162, 235, 0.3)',
         'rgba(255, 206, 86, 0.3)',
         'rgba(75, 192, 192, 0.3)',
         'rgba(153, 102, 255, 0.3)',
         'rgba(255, 159, 64, 0.3)',
         'rgba(220, 99, 170, 0.3)',
         'rgba(54, 162, 180, 0.3)'
       ];
       return colors[i];
     })
     .datum((d, i) => ({ date: dates[i], asteroidCount: d }));
//mouseover
   bars
     .on("mouseover", function (event, d) {
       d3.select(this).classed("hovered", true);
//tooltip
       const date = d.date;
       const asteroidCount = d.asteroidCount;
       const tooltipText = `Date: ${date}\nAsteroids Count: ${asteroidCount}`;


       const tooltip = svg.append("text")
         .attr("class", "tooltip")
         .attr("x", width / 3.7)
         .attr("y", margin.top + 15) 
         .attr("text-anchor", "middle")
         .text(tooltipText)
         .style("font-weight", "bold")
         .style("font-size", "14px");
     })
     .on("mouseout", function () {
       d3.select(this).classed("hovered", false);

       svg.selectAll(".tooltip").remove();
     });

   g.append("text")
     .attr("x", width / 2)
     .attr("y", -margin.top + 10) 
     .attr("text-anchor", "middle")
     .text("Number of Asteroids to Approach Earth on Specific Dates")
     .style("font-weight", "bold")
     .style("font-size", "16px");

   g.append("text")
     .attr("x", width / 2)
     .attr("y", height + margin.bottom - 10)
     .attr("text-anchor", "middle")
     .text("Dates");

   g.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", -height / 2)
     .attr("y", -margin.left + 20)
     .attr("dy", "0.7em")
     .attr("text-anchor", "middle")
     .text("Number of Asteroids");
 }
 getNasaAsteroids();













 async function getAsteroids() {
  try {
    const response = await fetch(asteroids_api_url);
    const data = await response.json();

    const dates = Object.keys(data.near_earth_objects);
    dates.sort();

    const asteroidData = dates.map(date => {
      const asteroids = data.near_earth_objects[date];
      const asteroidCount = asteroids.length;
      const potentiallyHazardousCount = asteroids.filter(asteroid => asteroid.is_potentially_hazardous_asteroid).length;

      return {
        date,
        asteroidCount,
        potentiallyHazardousCount
      };
    });

    return asteroidData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function displayLineChart() {
  const asteroidData = await getAsteroids();

  if (asteroidData) {
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#lineGraphCanvas")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .classed("svg-content-responsive", true);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
      .range([0, width])
      .domain(asteroidData.map(item => item.date))
      .padding(0.5);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(asteroidData, d => Math.max(d.asteroidCount, d.potentiallyHazardousCount))]);

    const lineAsteroids = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.asteroidCount));

    const linePotentiallyHazardous = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.potentiallyHazardousCount));

    const lineAsteroidsPath = g.append("path")
      .datum(asteroidData)
      .attr("fill", "none")
      .attr("stroke", "rgba(75, 192, 192, 1)")
      .attr("stroke-width", 1.5)
      .attr("d", lineAsteroids)
      .attr("class", "lineAsteroids")
      .attr("active", true);

    const linePotentiallyHazardousPath = g.append("path")
      .datum(asteroidData)
      .attr("fill", "none")
      .attr("stroke", "rgba(255, 99, 132, 1)")
      .attr("stroke-width", 1.5)
      .attr("d", linePotentiallyHazardous)
      .attr("class", "linePotentiallyHazardous")
      .attr("active", true);

    const dotAsteroids = g.selectAll(".dotAsteroids")
      .data(asteroidData)
      .enter().append("circle")
      .attr("class", "dotAsteroids")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.asteroidCount))
      .attr("r", 5)
      .attr("fill", "rgba(75, 192, 192, 1)")
      .attr("active", true);

    const dotPotentiallyHazardous = g.selectAll(".dotHazardous")
      .data(asteroidData)
      .enter().append("circle")
      .attr("class", "dotHazardous")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.potentiallyHazardousCount))
      .attr("r", 5)
      .attr("fill", "rgba(255, 99, 132, 1)")
      .attr("active", true);

    //tooltip
    const tooltip = g.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("rect")
      .attr("width", 100)
      .attr("height", 40)
      .attr("fill", "rgba(255, 255, 255, 0.8)")
      .attr("rx", 5)
      .attr("ry", 5)
      .style("pointer-events", "none");

    const tooltipText = tooltip.append("text")
      .attr("x", 5)
      .attr("y", 20);

    dotAsteroids.on("mouseover", (event, d) => {
      tooltipText.text(`Asteroids: ${d.asteroidCount}`);
      tooltip.attr("transform", `translate(${x(d.date) - 50},${y(d.asteroidCount) - 50})`);
      tooltip.style("display", "block");
    });

    dotPotentiallyHazardous.on("mouseover", (event, d) => {
      tooltipText.text(`Dangerous Asteroids: ${d.potentiallyHazardousCount}`);
      tooltip.attr("transform", `translate(${x(d.date) - 50},${y(d.potentiallyHazardousCount) - 50})`);
      tooltip.style("display", "block");
    });

    dotAsteroids.on("mouseout", () => {
      tooltip.style("display", "none");
    });

    dotPotentiallyHazardous.on("mouseout", () => {
      tooltip.style("display", "none");
    });

    g.append("g")
      .call(d3.axisBottom(x))
      .attr("transform", `translate(0,${height})`)
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dy", "0.7em");

    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("dy", "-0.5em");

    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Dates");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("dy", "0.7em")
      .attr("text-anchor", "middle")
      .text("Number of Asteroids");

    //legends
    const legendAsteroids = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(20,20)")
      .style("cursor", "pointer")
      .on("click", function () {
        const isActive = lineAsteroidsPath.attr("active") === "true";
        const newDisplay = isActive ? "none" : "block";
        lineAsteroidsPath.attr("active", !isActive);
        dotAsteroids.attr("active", !isActive);
        lineAsteroidsPath.style("display", newDisplay);
        dotAsteroids.style("display", newDisplay);
      });

    legendAsteroids.append("rect")
      .attr("x", 45)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 10)
      .attr("fill", "rgba(75, 192, 192, 1)");

    const legendPotentiallyHazardous = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(120,20)")
      .style("cursor", "pointer")
      .on("click", function () {
        const isActive = linePotentiallyHazardousPath.attr("active") === "true";
        const newDisplay = isActive ? "none" : "block";
        linePotentiallyHazardousPath.attr("active", !isActive);
        dotPotentiallyHazardous.attr("active", !isActive);
        linePotentiallyHazardousPath.style("display", newDisplay);
        dotPotentiallyHazardous.style("display", newDisplay);
      });

    legendPotentiallyHazardous.append("rect")
      .attr("x", 45)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 10)
      .attr("fill", "rgba(255, 99, 132, 1)");

    legendAsteroids.append("text")
      .attr("x", 70)
      .attr("y", 8)
      .text("Asteroids")
      .style("font-size", "12px");

    legendPotentiallyHazardous.append("text")
      .attr("x", 70)
      .attr("y", 8)
      .text("Potentially Hazardous")
      .style("font-size", "12px");
  }
}
displayLineChart();