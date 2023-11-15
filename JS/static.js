// Fetch asteroid data from the NASA API
async function fetchAsteroidData() {

    const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2023-08-25&end_date=2023-09-01&api_key=dhPb2jn8OnyMTgJTHGnxhYWq5oB9aCgwLu1GeGs5';
  
    try {
        const response = await fetch(url);
        const data = await response.json();
    
        // Process the asteroid data
        processAsteroidData(data);
      } catch (error) {
        console.error('Error fetching asteroid data:', error);
      }
    }
    
    // Process asteroid data to count asteroids by date
    function processAsteroidData(data) {
      const neoData = data.near_earth_objects;
      const asteroidCounts = {};
    
      Object.keys(neoData).forEach(date => {
        asteroidCounts[date] = neoData[date].length;
      });
    
      const asteroidCountArray = Object.entries(asteroidCounts).map(([date, count]) => ({ date, count }));
    
      createBarGraph(asteroidCountArray);
    }
    
    function createBarGraph(data) {
        const margin = { top: 30, right: 30, bottom: 50, left: 60 };
        const width = 350 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
      
        const svg = d3.select('#static')
          .attr('width', width)
          .attr('height', height);
      
        const xScale = d3.scaleBand()
          .domain(data.map(d => d.date))
          .range([margin.left, width - margin.right])
          .padding(0.1);
      
        const yScale = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.count)])
          .nice()
          .range([height - margin.bottom, margin.top]);
      
        svg.append('g')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(xScale))
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('transform', 'rotate(-45)')
          .attr('dx', '-0.5em')
          .attr('dy', '0.5em');
      
        svg.append('g')
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(yScale));
      
        svg.selectAll('rect')
          .data(data)
          .join('rect')
          .attr('x', d => xScale(d.date))
          .attr('y', d => yScale(d.count))
          .attr('width', xScale.bandwidth())
          .attr('height', d => height - margin.bottom - yScale(d.count))
          .attr('fill', 'steelblue');
      
        // X-axis label
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', height + margin.top - 10)
          .style('text-anchor', 'middle')
          .text('Date');
      
        // Y-axis label
        svg.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0)
          .attr('x', 0 - height / 2)
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .text('Asteroid Count');
      
        // Heading
        const heading = document.createElement('h2');
        heading.textContent = 'Number of Asteroids close to Earth on Specific Dates';
        document.getElementById('staticBarGraph').prepend(heading);
      }
      
      // Fetch asteroid data and create the bar graph
      fetchAsteroidData().then(data => {
        const processedData = processAsteroidData(data);
        createBarGraph(processedData);
      });
  