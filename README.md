
# My Vite + React Project

This is a modern web application built with Vite, React, Tailwind CSS, Mantine, and Redux. It uses a `json-server` to serve a mock JSON API for development purposes.

---

## Features

- **Vite**: Lightning-fast build tool for modern web applications.
- **React**: Component-based UI library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Mantine**: Fully-featured UI components with built-in hooks.
- **Redux**: State management for predictable state transitions.
- **json-server**: Serves a mock REST API for development and testing.

---

## Project Structure

```plaintext
root/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── redux/           # Redux store, slices, and hooks
│   ├── styles/          # Tailwind CSS styles or additional styles
│   ├── App.jsx          # Main React component
│   └── main.jsx         # Application entry point
├── database.json        # Mock JSON data served by json-server
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

---

## Installation and Setup

1. **Clone the repository**  
   ```bash
   git clone https://github.com/hashimaw/project-form.git
   cd your-repo
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Run the JSON Server**  
   ```bash
   npx json-server database.json
   ```

   This will serve the `database.json` file at `http://localhost:3000`.

4. **Start the development server**  
   ```bash
   npm run dev
   ```

5. **Access the application**  
   Open your browser and go to `http://localhost:5173`.

---

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build.
- `npx json-server database.json`: Starts the JSON Server.

---

## Technologies Used

- **Vite**: [https://vitejs.dev](https://vitejs.dev)
- **React**: [https://reactjs.org](https://reactjs.org)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)
- **Mantine**: [https://mantine.dev](https://mantine.dev)
- **Redux**: [https://redux.js.org](https://redux.js.org)
- **json-server**: [https://github.com/typicode/json-server](https://github.com/typicode/json-server)

---

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.


