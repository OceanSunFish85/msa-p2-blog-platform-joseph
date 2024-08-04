# Blog System

## Project Information

The project is a blog system with basic features , including login authentication , user registration , article list , paging queries , global search , article publishing , article editing , article management , comments and other functions . In addition , the project also integrates a public chat room , with a history function , and a simple AI function that automatically summarises the article summary when the user edits or creates a new article .

## Feature List

- User Registration and Login
- Article List & Pagination Search
- Global Search
- Article publishing and editing
- Article Management
- Comment system
- Public Chat Room (history support)
- AI Article Summary Generation
- Rich Text Editor (support video link, image upload)

## Project Features

- Integrate WebSocket to real-time chat
- Integrate AI features to automatically generate article summaries
- Rich text editor for advanced article editing, including video linking and image uploading.
- Article comment system
- Article management system

## Front End Technology Stack

- React
- TypeScript
- Material-UI (MUI)
- npm (Package Management)
- Storybook
- Jest (Testing)
- Redux (State Management)
- React Router (Routing)

### Install and run

1. Install dependencies
   ```bash
   npm install
   ```
   
2. Start the development server
  ```bash
  npm run dev
  ```

3. Start Storybook
   ```bash
   npm run storybook
   ```
4. Run the test
   ```bash
   npm test
   ```

> Note: Due to time constraints, Story and Jest in the project do not cover all components.

## Backend Technology Stack

- NET 8
- C#
- Entity Framework Core
- Azure SQL

### Installation and operation

1. Modify the database connection

   - Modify the database connection string in `appsettings.json` to use your own SQL Server.
   - Use DbContext and EF's migration feature to create new database tables for development.

2. Create the database migration
   ```bash
   dotnet ef migrations add <YourMigrations
   ```
3. Update the database

   ```bash
   dotnet ef database update
   ```

4. Build the project

   ```bash
   dotnet build
   ```

5. Start the backend
   ```bash
   dotnet run
   ```

## Completed basic requirements

### Front End

- TypeScript development for React projects
- Using the MUI style library
- Using Responsive Layout
- Using React Router routing
- Using Git Version Control

### Backend

- Using C# and .NET 8
- Using EF Core
- Using Azure SQL Database
- Implementing CRUD Operations
- Version Control with Git

## Advanced Requirements

- Storybook Integration
- Integration with WebSocket
- Redux status management
- Implementing Theme Switching
- Applying AI Article Summary

## Other

- Project attempted to use Docker containerisation, but encountered issues with linking Azure SQL, not fully fixed due to time constraints

## Contact Us

If you have any questions or need further assistance, please contact us at

Email: josephchen935@gmail.com
