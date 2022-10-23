import React from 'react';
import { Link } from "react-router-dom";

const Home = () => {
    return (
      <article>
        <h1>Home</h1>
        <section>
          <Link to="/start">
            <button>Let's play chess</button>
          </Link>
        </section>
      </article>
    );
  };
  
  export default Home;