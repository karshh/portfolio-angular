export const Projects: Array<any> = [
	{
	  	title: 'Medium-Fake',
		skillList: ['HTML', 'CSS', 'PHP 7.0+', 'Javascript', 'MySQL', 'Bootstrap',  'Laravel', 'Ubuntu', 'Apache2', 'AWS EC2'],
		timeLine: 'March 2018 - Ongoing',
		website: 'medium.usharma.ca',
		github: 'github.com/karshh/medium-fake',
		description: `
				<p> 
					This web application demonstrates server support and database, in addition to web componentization and layout in Laravel.
					A basic layout resembling <a href="https://www.medium.com" target="_blank">medium.com</a> was implemented.
					Laravel blades were used to break down the website into components, along with ensuring ease of routing.
				</p>

				<p> 
					Controllers and Eloquent models were implemented to hook up the client with a MySQL database, such that data could be persisted. 
					The application is hosted on Amazon EC2.
				</p>

				<p><strong>NOTE:</strong> This site is only partially responsive. Making it fully responsive is an ongoing phase.</p>
	  	`
	},

	{
	  	title: 'TrafficYYC',
		skillList: ['HTML', 'CSS', 'JQuery', 'Bootstrap', 'Express', 'Node.js', 'Debian', 'Nginx', 'GCP VI'],
		timeLine: 'February 2018 - Ongoing',
		website: 'trafficyyc.usharma.ca',
		github: 'github.com/karshh/Traffic.YYC',
		description: `
				<p> 
					Utilisation of REST API's to retrieve traffic data from the City of calgary datasets to build a responsive bootstrapped web application. 
				<p> 
				<p>
					This application was an introduction to bootstrap into our web application, ensuring ease of responsiveness implementation as an 
					alternative to writing media queries from scratch.
				</p>
				<p>
					Ongoing rewrite of the client side of this application into React.
				</p>

				<p><strong>NOTE:</strong> The 'Contact' form on this web application is a dummy. </p>
	  	`
	},

	{
	  	title: 'WeatherYYC',
		skillList: ['HTML', 'CSS', 'JQuery', 'Express', 'Node.js', 'Debian', 'Nginx', 'GCP VI'],
		timeLine: 'February 2018',
		website: 'weatheryyc.usharma.ca',
		github: 'github.com/karshh/WeatherWebApp',
		description: `
				<p> 
					A basic introduction to using REST API's and GET methods to display weather data in Calgary. 
					<a href="https://darksky.net/dev" title="https://darksky.net/dev">Darksky API</a> was used to retrieve data. 
				</p>
				<p> 
					However, instead of making the call directly from client, a basic express server was set up to interact with darksky.
					The client jquery simply made a GET request to this Express server and populated a simple table with the temperature and 
					humidity in Calgary over the next 3 hours.
				</p>
				<p> 
					Instead of Apache, the node server was proxied on an nginx web server on Google cloud platform.
				</p>
				<p><strong>NOTE:</strong> This site is not responsive. </p>
	  	`
	},

	{
	  	title: 'BlogYYC',
		skillList: ['HTML', 'CSS', 'Bootstrap', 'Apache','Ubuntu', 'AWS EC2'],
		timeLine: 'January 2018',
		website: 'blogyyc.usharma.ca',
		github: 'github.com/karshh/WebLayoutThemes',
		description: `
				<p> 
					A template homepage, with the goal of implementing responsiveness from scratch, without the use of any framework or libraries. 
				</p>
				<p><strong>NOTE:</strong> All links and buttons on this page are dummies.</p>
	  	`
	},

	{
	  	title: 'Sample Themes',
		skillList: ['HTML', 'CSS', 'Apache', 'Amazon AMI', 'AWS EC2'],
		timeLine: 'January 2018',
		website: 'themes.usharma.ca',
		github: 'github.com/karshh/WebLayoutThemes',
		description: `
				<p> 
					An introduction to HTML & CSS. These series of web pages were made to demonstrate the different color swathes to match different themes. 
				</p>

				<p><strong>NOTE:</strong> This site is not responsive. </p>
	  	`
	}
	

];

