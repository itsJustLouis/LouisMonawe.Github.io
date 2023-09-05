//Assignment Starts here
    const asteroids_api_url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2023-08-25&end_date=2023-09-01&api_key=dhPb2jn8OnyMTgJTHGnxhYWq5oB9aCgwLu1GeGs5'; //Define API
 
    async function getNasaAsteroids(){
      const response = await fetch(asteroids_api_url);
      const data = await response.json(); //convert response to json
      console.log(data.near_earth_objects);

      // Loop through each date and its array of asteroids
    for (const date in data.near_earth_objects) {      
      //console.log(`Date: ${date}`);
      const asteroids = data.near_earth_objects[date];
      const asteroidCount = asteroids.length;

   //   console.log(`Number of Asteroids on ${date}: ${asteroidCount}`); //this will display the number of asteroids available on a certain day
    }
     // array of date keys
     const dates = Object.keys(data.near_earth_objects);
     dates.sort(); //sorting out the dates
      // array to store the number of asteroids for each date
    const asteroidCounts = dates.map(date => data.near_earth_objects[date].length);
   // console.log( dates);
   // console.log( asteroidCounts);
    //Drawing my Bar Graph
    const ctx = document.getElementById('canvas');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Recent Asteroids to Approach Earth',
          data: asteroidCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2',
            'rgba(54, 162, 235, 0.2',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor:[
            'rgba(255, 99, 132, 1',
            'rgba(54, 162, 235, 1',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Number of Asteroids Approaching Earth on Specific Dates', // Add a title to the chart
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Dates', // Label for the x-axis
            },
            ticks: {
              fontSize: 25, // Increase the font size of the x-axis labels
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Asteroids', // Label for the y-axis
            },
            ticks: {
              fontSize: 25, // Increase the font size of the y-axis labels
            },
            beginAtZero: true,
            },
        }
      }
    });
 
}





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

// display the line and bar graph here......don forget
getNasaAsteroids();
displayLineChart();
