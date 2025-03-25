# Do It - Task Management Application

A dynamic task management web application built as part of [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-todo-list/) curriculum. This project demonstrates proficiency in JavaScript, DOM manipulation, and modern CSS techniques.

## Features

- **Project Management**

  - Create, edit, and delete projects
  - Organize tasks within projects
  - Intuitive project navigation via sidebar

- **Task Management**

  - Create, edit, and delete tasks
  - Set task priorities (Low, Medium, High)
  - Add due dates
  - Mark tasks as complete
  - View task details

- **Task Views**

  - Today: View tasks due today
  - Next 7 Days: View upcoming tasks
  - All Tasks: View all tasks across projects
  - Important: View high-priority tasks

- **User Interface**

  - Clean, modern design
  - Collapsible sidebar
  - Smooth animations
  - Responsive layout
  - Scrollable task and project lists

- **Data Persistence**
  - Local storage implementation
  - Demo project available for new users

## Technical Details

- **Vanilla JavaScript** - No frameworks, demonstrating core JavaScript proficiency
- **CSS Custom Properties** - For consistent theming and maintainable styles
- **CSS Animations** - Smooth transitions and keyframe animations
- **LocalStorage API** - For data persistence
- **Date-fns Library** - For date manipulation and formatting
- **UUID** - For unique identifier generation

## Demo

First-time users are greeted with an option to load a demo project that showcases the application's features. This demo project includes various tasks with different priorities and due dates.

## Project Structure

- `src/`
  - `index.js` - Main application logic and state management
  - `Task.js` - Task class definition
  - `Project.js` - Project class definition
  - `ui.js` - UI rendering and DOM manipulation
  - `styles.css` - Application styling
  - `testProject.js` - Demo project implementation

## Future Enhancements

- Theme toggle (Light/Dark mode)
- Backend integration
- User authentication
- Mobile responsiveness improvements
- Task sorting and filtering
- Data export/import functionality

## Credits

- Project specification from [The Odin Project](https://www.theodinproject.com/)
- Icons and design inspiration from [Material Icons](https://fonts.google.com/icons)
- Special thanks to Shia LaBeouf for motivation 😉

## License

This project is open source and available under the [MIT License](LICENSE).
