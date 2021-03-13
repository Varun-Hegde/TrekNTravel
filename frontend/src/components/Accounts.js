import React from 'react'
import {Row} from 'react-bootstrap'
const Accounts = ({profile}) => {

    const availableMethods = ['google','facebook']

    return (
        <div>
            <Row>
                {availableMethods.map(method => <h1>jeee</h1>) }
            </Row>
        </div>
    )
}

export default Accounts
