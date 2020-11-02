// Importeer React
import React from 'react'
// Importeer ReactDOM
import ReactDOM from 'react-dom'
// Importeer normalize.css
// Importeer custom stylesheet
import './styles/styles.scss'
// Importeer Route, BrowserRouter en Link
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

// Te renderen componenten op pagina's
import PageOne from './components/pages/PageOne'
import PageTwo from './components/pages/PageTwo'
import PageThree from './components/pages/PageThree'

/*
 * Root component die
 * wordt meegegeven aan html element
 */

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={PageOne} />
        <Route exact path="/pagetwo" component={PageTwo} />
        <Route exact path="/pagethree" component={PageThree} />
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('app'))
