import { FC, ReactNode } from "react";

const list = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

type ListItem = (typeof list)[number];

const App: FC = () => {
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />

      <hr />

      <ul>
        {/* if array items do not have an unique value, */}
        {/* their indices could be used as a last resort, */}
        {/* given that the order of the items in the array doesn't change */}
        {list.map(
          (x: ListItem): ReactNode => (
            <li key={x.objectID}>
              <span>
                <a href={x.url} target="_blank">
                  {x.title}
                </a>
              </span>
              <span>{x.author}</span>
              <span>{x.num_comments}</span>
              <span>{x.points}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default App;
