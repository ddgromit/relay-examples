/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';
import Relay from 'react-relay';
import StarWarsShip from './StarWarsShip';
import AddShipMutation from '../mutation/AddShipMutation';
import ChangeAllShipsMutation from '../mutation/ChangeAllShipsMutation';

class StarWarsApp extends React.Component {
  constructor() {
    super();
    this.state = {
      factionId: 1,
      shipName: '',
    };
  }

  handleAddShip() {
    const name = this.state.shipName;
    this.props.relay.commitUpdate(
      new AddShipMutation({
        name,
        faction: this.props.viewer.factions[this.state.factionId],
      })
    );
    this.setState({shipName: ''});
  }

  handleInputChange(e) {
    this.setState({
      shipName: e.target.value,
    });
  }

  handleSelectionChange(e) {
    this.setState({
      factionId: e.target.value,
    });
  }

  handleChangeAllShips() {
    this.props.relay.commitUpdate(
      new ChangeAllShipsMutation({
        factionIds: this.props.viewer.factions.map((f) => f.id),
        viewerId: this.props.viewer.id,
      })
    );
  }

  render() {
    const {factions} = this.props.viewer;
    return (
      <div>
        User: { this.props.viewer.name } ({ this.props.viewer.id })
        <br />
        <ol>
          {factions.map(faction => (
            <li key={faction.id}>
              <h1>{faction.name}</h1>
              <ol>
                {faction.ships.edges.map(({node}) => (
                  <li key={node.id}><StarWarsShip ship={node} /></li>
                ))}
              </ol>
            </li>
          ))}
            <li>
              <h1>Introduce Ship</h1>
              <ol>
                <li>
                  Name:
                  <input type="text" value={this.state.shipName} onChange={this.handleInputChange.bind(this)} />
                </li>
                <li>
                  Faction:
                  <select onChange={this.handleSelectionChange.bind(this)} value={this.state.factionId}>
                    <option value="0">Galactic Empire</option>
                    <option value="1">Alliance to Restore the Republic</option>
                  </select>
                </li>
                <li>
                  <button onClick={this.handleAddShip.bind(this)}>Add Ship</button>
                </li>
              </ol>
            </li>
            <li>
              <button onClick={this.handleChangeAllShips.bind(this)}>
                Change All Ships
              </button>
            </li>
        </ol>
      </div>
    );
  }
}

export default Relay.createContainer(StarWarsApp, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        name
        id
        factions(names: ["empire", "rebels"]) {
          id,
          factionId,
          name,
          ships(first: 10) {
            edges {
              node {
                id
                ${StarWarsShip.getFragment('ship')}
              }
            }
          }
          ${AddShipMutation.getFragment('faction')},
        }
      }
    `,
  },
});
