document.getElementById('fetchData').addEventListener('click', () => {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    fetchData(startDate, endDate);
});

const tooltip = d3.select('#tooltip');
const asteroidName = d3.select('#asteroid-name');
const asteroidDistance = d3.select('#asteroid-distance');

function fetchData(startDate, endDate) {
    const apiKey = 'dhPb2jn8OnyMTgJTHGnxhYWq5oB9aCgwLu1GeGs5';
    const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const neoData = data.near_earth_objects;
            createVisualization(neoData);
        })
        .catch(error => console.error(error));
}

function createVisualization(neoData) {
    const neoElements = [];
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    const earthRadius = 80;
    const zoomedEarthRadius = 120;
    const earthX = window.innerWidth / 2.28;
    const earthY = window.innerHeight / 3.2;

    const scaleFactor = 0.00005;
    const earthCircle = svg.append("circle")
        .attr("cx", earthX)
        .attr("cy", earthY)
        .attr("r", earthRadius)
        .style("fill", "#001a33");

    const neoKeys = Object.keys(neoData);
    let hazardousAsteroids = 0;

    neoKeys.forEach(date => {
        neoData[date].forEach(neo => {
            const isHazardous = neo.is_potentially_hazardous_asteroid;
            const neoDistance = parseFloat(neo.close_approach_data[0].miss_distance.kilometers) * scaleFactor;
            const neoX = earthX + neoDistance;
            const neoY = earthY;

            const neoColor = isHazardous ? "red" : "green";

            const neoElement = svg.append("circle")
                .attr("cx", neoX)
                .attr("cy", neoY)
                .attr("r", 6.5)
                .style("fill", neoColor);

            neoElement.on('mouseover', () => {

                neoElement.transition().attr("r", 14);
                tooltip.style('display', 'block');
                const name = neo.name;
                const distance = neo.close_approach_data[0].miss_distance.kilometers;
                asteroidName.text(`Name: ${name}`);
                asteroidDistance.text(`Distance from Earth: ${distance} km`);
            }).on('mouseout', () => {
                
                neoElement.transition().attr("r", 6.5);


                tooltip.style('display', 'none');
            });

            if (isHazardous) {
                hazardousAsteroids++;
            }

            neoElements.push(neoElement);
        });
    });

    earthCircle.on('mouseover', () => {
        earthCircle.transition().attr("r", zoomedEarthRadius);
        tooltip.style('display', 'block');
        asteroidName.text(`Name: Earth`);
        asteroidDistance.text(`Number of Asteroids: ${neoElements.length}`);
    }).on('mouseout', () => {
        earthCircle.transition().attr("r", earthRadius);
        tooltip.style('display', 'none');
    });

    
    const orbitRadius = 250;
    const orbitSpeed = 200000;

    neoElements.forEach((neoElement, index) => {
        const angle = (index / neoElements.length) * 2 * Math.PI;
        animateOrbit(neoElement, earthX, earthY, orbitRadius, angle, orbitSpeed);
    });
    console.log(`Number of Hazardous Asteroids: ${hazardousAsteroids}`);
}

function animateOrbit(neoElement, earthX, earthY, radius, initialAngle, speed) {
    const start = Date.now();
    function animate() {
        const now = Date.now();
        const elapsed = now - start;
        const angle = initialAngle + (elapsed / speed) * 2 * Math.PI;
        const neoX = earthX + radius * Math.cos(angle);
        const neoY = earthY + radius * Math.sin(angle);
        neoElement.attr("cx", neoX).attr("cy", neoY);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}