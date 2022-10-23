import React from 'react';
import { Link } from "react-router-dom";

const Start = () => {
    return (
      <article>
        <h1>Start</h1>
        <section>
          <Link to="/play">
            <button>No really, let's play chess</button>
          </Link>
        </section>
      </article>

    );
  };
  
  export default Start;