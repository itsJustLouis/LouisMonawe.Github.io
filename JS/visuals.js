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
    const ctx = document.getElementById('lineGraphCanvas');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: asteroidData.map(item => item.date),
        datasets: [
          {
            label: 'Number of Asteroids',
            data: asteroidData.map(item => item.asteroidCount),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
          },
          {
            label: 'Potentially Hazardous Asteroids',
            data: asteroidData.map(item => item.potentiallyHazardousCount),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Line Chart: Number of Asteroids vs Number of Potentially Hazardous Asteroids',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Dates',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Asteroids',
            },
          },
        },
      },
    });
  }
}

displayLineChart();
