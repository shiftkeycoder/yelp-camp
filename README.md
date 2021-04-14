# YelpCamp

## ABOUT
Demo Full Stack Web App that is built on: 
- **NodeJS**: Back-end runtime environment
- **Express**: Back-end web application framework  
- **MongoDB**: No SQL Document oriented database
- **Vue**: Front-end framework

Uses contemporary web development/design standards and tools.

## FEATURES
**Basic CRUD operations**: 
- Creating: users, campsites, and reviews.
- Reading: users, campsites, and reviews from a database.
- Updating: users, campsites, and reviews in a database.
- Deleting: users, campsites, and reviews from a database.

**Express Restful Routing**:
- Uses the express router to break out routes into a modular pattern.
- Allows for scalability and adds organization for easier management.

**Passport Authentication**
- Security conscience methods for handling passwords and authentication.
- Can be easily modified to authenticate with vendors such as: Google, Facebook, etc.

**Error Handling and Flash Notification**
- For a better user experience users are directed to an error page when fatal errors are thrown.
- Users are notified when an operation has succeeded or failed via a dismissible flash notification.

## USAGE
### Updating the back-end
1. clone or download the project from the GitHub repository
2. cd into the app directory
3. `npm run start`
4. Navigate to: http://localhost:3000
### Updating the front-end
1. clone or download the project from the GitHub repository
2. cd into the build directory
3. `npm run build &`
4. `npm run start &`
5. Navigate to: http://localhost:8080 *(browser opens to this url automatically)*