/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { observer } from 'mobx-react';
import './App.css';
import { fetchCoins } from '../tradingView/gateway';
import { createStore } from './store';
import { OptionsForm } from './OptionsForm';

function sendMessage(payload) {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, payload, resolve);
    });
  });
}

class App extends Component {
  constructor(props) {
    super(props);
    this.store = createStore();
    this.selectCoins = this.selectCoins.bind(this);
  }

  selectCoins() {
    const { store } = this;
    store.setLoading(true);
    const config = { limit: store.limit, blacklist: store.blacklist };
    return fetchCoins(config)
      .then((coins) => sendMessage({ coins }))
      .finally(() => {
        store.setLoading(false);
      });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <OptionsForm
              store={this.store}
              handleButtonClick={this.selectCoins}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default observer(App);
