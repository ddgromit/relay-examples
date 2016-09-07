import Relay from 'react-relay';

export default class ChangeAllShipsMutation extends Relay.Mutation {
  getVariables() {
    return {
      factionIds: this.props.factionIds,
      viewerId: this.props.viewerId,
    };
  }

  getMutation() {
    return Relay.QL`mutation { changeAllShips }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on ChangeAllShipsPayload @relay(pattern: true) {
        viewer {
          name
          factions {
            ships
          }
        }
      }
    `;
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewerId,
        },
      },
    ];
  }

}
