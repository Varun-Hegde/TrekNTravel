import React from 'react'
import { Spinner } from 'react-bootstrap'
import Loader from "react-loader-spinner";

/* const Loader = () => {
  return (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: '100px',
        height: '100px',
        margin: 'auto',
        display: 'block',
      }}
    >
      <span className='sr-only'>Loading...</span>
    </Spinner>
  )
} */

export default class App extends React.Component {
  //other logic
  render() {
    return (
      <Loader
        type="Bars"
        color="rgb(126, 124, 143)"
        height={100}
        width={100}
        style={{
          width: '100px',
          height: '100px',
          margin: 'auto',
          display: 'block',
      }}
      />
    );
  }
}
