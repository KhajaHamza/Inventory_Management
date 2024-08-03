Inventory Management Project

Overview

This project is an Inventory Management System built using Next.js, React.js, and Firebase. It allows users to manage their inventory, add and remove items, search for items, and get recipe suggestions based on their inventory.

Features

Add new items to inventory
Remove items from inventory
Search for items in the inventory
View total items and quantities
Get recipe suggestions based on inventory items
Technologies Used

Next.js: For server-side rendering and routing.
React.js: For building the user interface.
Firebase: For real-time database and authentication.
Material-UI: For UI components and styling.
Axios: For making API requests.
Prerequisites

Before you begin, ensure you have met the following requirements:

Node.js and npm installed on your machine.
Firebase project set up and configured.
OpenAI API key for recipe suggestions.
Getting Started
Follow these steps to set up and run the project locally:

1. Clone the Repository

git clone https://github.com/KhajaHamza/Inventory_Management.git
cd Inventory-Management
2. Install Dependencies
npm install
3. Set Up Firebase
Go to Firebase Console.
Create a new project if you don't have one.
Add a new web app to your project.
4. Set Up OpenAI API Key
Obtain an API key from OpenAI.
Add the API key to your .env.local file:
OPENAI_API_KEY=your_openai_api_key
5. Run the Development Server

npm run dev
Open http://localhost:3000 in your browser to see the application.

Project Structure

/pages: Contains the main pages of the application.
/components: Contains reusable React components.
/firebase: Contains Firebase configuration and initialization.
/utils: Contains utility functions, such as API requests.
/public: Contains static assets like images and fonts.
How It Works

Inventory Management: Users can add items to the inventory, specify their quantities, and remove items as needed. The inventory data is stored in Firebase and updated in real-time.
Search Functionality: Users can search for specific items in the inventory using a search bar.
Recipe Suggestions: Users can get recipe suggestions based on the items in their inventory. This is done using the OpenAI API, which generates recipe ideas based on the list of ingredients.
Contributing

Contributions are welcome! If you have suggestions or improvements, please fork the repository and create a pull request. Ensure that your code adheres to the project's coding standards and passes all tests.

