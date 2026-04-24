# ShopMini

A modern e-commerce mini application built with React, Vite, Tailwind CSS, and Shadcn UI.

## Setup Instructions

Follow these steps to get the project running locally:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. This project uses `yarn` as the package manager.

### 2. Installation
Clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/Pratham-Makwana/shopmini.git

# Navigate to the project directory (if not already there)
cd shopmini

# Install dependencies
yarn install
```

### 3. Running the Development Server
Start the Vite development server:

```bash
yarn run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Building for Production
To create an optimized production build:

```bash
yarn build
```

You can preview the built app using:
```bash
yarn preview
```

## State Management Choice

For this application, we have chosen the **React Context API** alongside native React Hooks (`useState`, `useEffect`, `useCallback`) as our state management solution. 

You can find the context implementations in the `context/` directory (e.g., `auth-context.tsx`, `cart-context.tsx`).

### Why React Context?
1. **Simplicity and Bundle Size**: The application's state requirements are relatively straightforward, primarily handling user authentication state and shopping cart data. Introducing a robust third-party library like Redux or Zustand would add unnecessary weight and boilerplate.
2. **Native Support**: Context API is built directly into React, requiring zero extra dependencies while natively supporting React's latest features.
3. **Separation of Concerns**: By splitting the state into logically separated contexts, we ensure that components only subscribe to the specific data they care about, keeping the application fast and easy to reason about.

For an application of this scale—a mini e-commerce platform—native React state management is robust, clean, and perfectly suited to handle the requirements without over-engineering.
