# Custom-Made Widget

The custom widget that' I have added on planner app is:

- <strong>Weather Forecast Widget</strong>

## Reason to choose Weather Forecast Widget

- Daily Planning: Having weather information readily available within the planner app allows users to consider weather conditions when planning their day. They can easily see the forecasted temperature, precipitation, or other weather elements that may impact their activities or plans.

- Visual Aid: Weather widgets often include weather icons or graphical representations that make it easier for users to quickly grasp the current or forecasted weather conditions. Visual cues such as sun, clouds, raindrops, or snowflakes provide an intuitive way to understand the weather at a glance.

- User Experience: Integrating a weather widget enhances the overall user experience of the planner app. It adds a useful and dynamic element to the interface, providing users with relevant and real-time information that complements their planning and decision-making process.

- Location-Based Customization: A weather widget can be customized based on the user's location, providing accurate and localized weather information. This allows users to receive personalized weather updates and forecasts specific to their geographical area.

## Widget Working Mechanism

Here's an explanation of how the widget works:

- The user launches the planner app on their device, either through a web browser.

- Within the planner app's user interface, the weather forecast widget is already integrated. It is displayed in a left section of the web app of the screen.

- The weather forecast widget utilizes the browser's geolocation API to automatically detect the user's current location. This enables the widget to provide weather information specific to the user's location.

- Once the user opens the planner app, the weather forecast widget initiates a process to fetch weather data from the specified weather API using the provided API key.

- During the data retrieval process, the widget displays a "Loading weather forecast..." message to inform the user that the weather data is being fetched.

- Once the weather data is retrieved, the widget presents the information in a user-friendly format within the planner app's interface. This includes displaying the current weather conditions and the forecasted weather for the specified number of days (in this case, 3 days).

- The widget also shows the current location, which is extracted from the fetched weather data. The user can see the name of the city or location associated with the weather information.

- For each forecasted day, the widget provides details such as the date, time, weather icon, weather description, temperature, and humidity. These details are presented in separate sections for each forecasted day.

- The weather forecast widget may include a mechanism to automatically update the weather information at regular intervals. This ensures that the displayed data remains current and reflects any changes in the weather conditions.

By following these steps, the user can utilize the weather forecast widget within the planner app to stay informed about the current and forecasted weather conditions for their location. This information can help them plan their activities and schedule accordingly, taking weather factors into consideration.

## Code Working Mechanism

Here's an explanation of how the code works:

1. The `WeatherForecastWidget` component is a React functional component that displays a weather forecast for the user's current location.

2. It starts by defining state variables using the `useState` hook:

   - `forecastData` holds the weather forecast information.
   - `location` stores the current location name.
   - `error` keeps track of any error that occurs during data retrieval.

3. The `fetchWeatherData` function is responsible for fetching weather data from the Weatherbit API based on the user's latitude and longitude coordinates.

   - It uses the `fetch` function to send requests to the API and retrieve the forecast and current weather data.
   - If the API calls are successful (status code 200), it updates the state variables with the received data.
   - If an error occurs during the API calls, it sets the `error` state variable with an appropriate error message.

4. The `useEffect` hook is used to fetch weather data when the component is mounted.

   - It checks if the browser supports geolocation using the `navigator.geolocation` object.
   - If geolocation is supported, it calls `getCurrentPosition` to retrieve the user's latitude and longitude coordinates.
   - Once the coordinates are obtained, the `fetchWeatherData` function is called with the coordinates to fetch weather data.
   - If geolocation is not supported, it sets the `error` state variable to notify the user.

5. Two helper functions, `formatDateTime` and `formatDate`, are defined to format the date and time values received from the weather data.

6. The JSX code within the `return` statement defines the UI of the widget:

   - If an error occurs during data retrieval, an error message is displayed.
   - If no error occurs, the current location and weather forecast information are displayed.
   - The forecast data is mapped using the `map` function to generate forecast items, which display the date, time, weather icon, description, temperature, and humidity.

7. To use this weather forecast widget in a planner app, you can simply include the `WeatherForecastWidget` component within the desired section or component of the app. When the component is rendered, it automatically fetches weather data based on the user's location and displays the forecast.

In summary, this code fetches weather data using the user's geolocation, displays the forecast in a user-friendly format, and can be easily integrated into a planner app to provide weather information to the user.
