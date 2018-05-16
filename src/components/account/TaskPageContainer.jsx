import React from 'react';
import { connect } from 'react-redux';

import TaskPage from './TaskPage';

export class TaskPageContainer extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
  }

  render() {
    return (
      <div>
        <TaskPage />
      </div>
    );
  }
}

export default connect()(TaskPageContainer);