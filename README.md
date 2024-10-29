# StoryPath - Web
**Visit the Site** @ https://main--storypath.netlify.app/

StoryPath - Web is a platform that enables users to design and build interactive, location-based experiences (such as museum tours, treasure hunts, and guided explorations). The web platform allows creators to author, publish, and manage these experiences, while participants can access them to follow clues, unlock content, and track their progress on the accompanying **Mobile Application**.

## Key Site Features

### Project Management:
- **Create, Edit, and Delete Projects**: Users can author interactive projects with titles, descriptions, instructions, and initial clues.
- **Publication Status**: Projects can be published or remain unpublished, giving creators control over visibility.

### Location Management:
- **Location-Based Content**: Add locations to projects, each with coordinates, triggers, and point-based scoring systems.
- **Priority Management**: Control the order of locations within a project using up and down buttons to adjust priority.

### User Interactivity:
- **AI Project and Location Creation**: The 'Ai Assist' button takes a simple user input, and designs and deploys a project with accompanying locations within seconds.
- **On-site AI Assistant**: Integrated GPT assistant that allows users to interact with an AI chatbot for guidance and support.
- **Theme Toggle**: Switch between light and dark modes to match user preferences for accessibility.

### Streamlined User Interface:
- **Project and Location Cards**: Consistent and reusable card components for displaying project and location information, actions, and status.
- **Interactive Forms**: Forms for creating and editing projects and locations with real-time API interaction.

## Technology Stack

- **Frontend Framework**: React with Vite for fast development and deployment
- **UI Library**: MUI (Material UI) for consistent styling and responsive components
- **Routing**: React Router for seamless navigation between views
- **Backend API Integration**: Custom API endpoints for projects and locations management
- **Secure API Key Management**: API Keys are embedded within .env files for secure management.
- **GPT Integration**: OpenAI GPT-3.5 for real-time chat interactions and project creation
- **State Management**: React Hooks (useState, useEffect) for component state handling

## Usage Workflow

1. **Create and Manage Projects**:
   - Navigate to the Projects page.
   - Create new projects or edit/delete existing ones using the provided buttons.
   - Assign locations to projects with triggers and score points.

2. **Edit Project Locations**:
   - Select a project to view its associated locations.
   - Add or edit locations to define triggers and actions.
   - Organize location priorities with drag-and-drop or up/down actions.

3. **AI Assistance**:
   - Use the floating button to open the GPT assistant and ask questions or seek guidance.

4. **Theme Customization**:
   - Use the theme toggle button to switch between light and dark modes.

## Setup & Deployment

### Prerequisites:
- npm installed

### Install Dependencies:
Run the following command to install all dependencies:
```bash
npm install