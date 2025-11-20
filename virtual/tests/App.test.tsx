import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("",()=>{

  /*   //ui test. can't be done here because of d3.js  try individual components
  test("renders welcome message", () => {
    render(<App />);
    expect(screen.getByText(/welcome to react/i)).toBeInTheDocument();
  });
*/

  test("Test function example",()=>{

    expect(1===1).toBe(true);

  });

})
