const asteroids_for_final_artwork = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2023-08-25&end_date=2023-09-01&api_key=dhPb2jn8OnyMTgJTHGnxhYWq5oB9aCgwLu1GeGs5';
async function fetchAsteroidData() {
    try {
      const response = await fetch(asteroids_for_final_artwork);
      const data = await response.json();
      visualizeAsteroidData(data);
    } catch (error) {
      console.error('Error fetching asteroid data:', error);
    }
  }
  
  //fetch asteroid data and create visualization
  fetchAsteroidData();
  
  function visualizeAsteroidData(data) {
    const neoData = data.near_earth_objects;
    const processedAsteroidData = [];
  
    Object.keys(neoData).forEach((date) => {
      const asteroids = neoData[date];
      asteroids.forEach((asteroid) => {

        const processedAsteroid = {
          date: date,
          speed: asteroid.close_approach_data[0].relative_velocity.kilometers_per_second,
          size: asteroid.estimated_diameter.meters.estimated_diameter_max,
        };
        processedAsteroidData.push(processedAsteroid);
      });
    });
  
    function setupSVG() {
      const margin = { top: 50, right: 1150, bottom: 50, left: 50 };
  
      const containerWidth = document.getElementById('visualization').clientWidth;
      const containerHeight = 0.6 * containerWidth; 
      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      d3.select('#visualization').selectAll('*').remove();
  
      const svg = d3.select('#visualization')
        .attr('width', containerWidth)
        .attr('height', containerHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
      return { svg, width, height };
    }
    const { svg, width, height } = setupSVG();

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(processedAsteroidData, (d) => parseFloat(d.date))])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(processedAsteroidData, (d) => parseFloat(d.speed))])
      .range([height, 0]);
  
    svg.selectAll('circle')
      .data(processedAsteroidData)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(parseFloat(d.date)))
      .attr('cy', (d) => yScale(parseFloat(d.speed)))
      .attr('r', (d) => Math.sqrt(parseFloat(d.size)))
      .attr('fill', 'steelblue')
      .attr('opacity', 0.7)
      .on('mouseover', function (event, d) {
        // Tooltip
        const tooltip = d3.select('#tooltip');
        tooltip.style('display', 'block')
          .style('left', (event.pageX + 50) + 'px')
          .style('top', (event.pageY - 20) + 'px')
          .html(`Date: ${d.date}<br>Speed: ${d.speed} km/s<br>Size: ${d.size} meters`);
  
        // Zoom
        d3.select(this)
          .transition()
          .duration(300)
          .attr('r', (d) => Math.sqrt(parseFloat(d.size)) * 1.5); // Increase size on hover
      })
      .on('mouseout', function () {
        // Hide tooltip
        const tooltip = d3.select('#tooltip');
        tooltip.style('display', 'none');
  
        //remove zoom
        d3.select(this)
          .transition()
          .duration(300)
          .attr('r', (d) => Math.sqrt(parseFloat(d.size)));
      })
      .transition()
      .duration(2000)
      .delay((d, i) => i * 100)
      .attr('cx', (d) => xScale(parseFloat(d.date) + 0.5))
      .attr('cy', (d) => yScale(parseFloat(d.speed) + 100))
      .on('end', function repeat() {
        svg.selectAll('circle')
          .attr('cx', (d) => xScale(parseFloat(d.date)))
          .attr('cy', (d) => yScale(parseFloat(d.speed)))
          .transition()
          .duration(2000)
          .delay((d, i) => i * 100)
          .attr('cx', (d) => xScale(parseFloat(d.date) + 0.5))
          .attr('cy', (d) => yScale(parseFloat(d.speed) + 100))
          .on('end', repeat); //repeat the animation
      });
  
    function updateCircles() {
      svg.selectAll('circle')
        .transition()
        .duration(2000)
        .delay((d, i) => i * 100)
        .attr('cx', (d) => xScale(parseFloat(d.date) + 0.5))
        .attr('cy', (d) => yScale(parseFloat(d.speed) + 100))
        .on('end', function repeat() {
          svg.selectAll('circle')
            .attr('cx', (d) => xScale(parseFloat(d.date)))
            .attr('cy', (d) => yScale(parseFloat(d.speed)))
            .transition()
            .duration(2000)
            .delay((d, i) => i * 100)
            .attr('cx', (d) => xScale(parseFloat(d.date) + 0.5))
            .attr('cy', (d) => yScale(parseFloat(d.speed) + 100))
            .on('end', repeat); //ursive call to repeat the animation
        });
    }
    updateCircles();
  }