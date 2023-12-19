import { ReactNode } from "react";

function getTitle(title: string): string {
  return title;
}

function App(): ReactNode {
  return (
    <div>
      <h1>Hello {getTitle("React")}!</h1>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
