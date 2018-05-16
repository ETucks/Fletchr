import React from 'react';
import { Card, CardBody, CardText } from 'reactstrap';

export default function Sidebar() {
  return (
    <aside className="col-sm-12 col-md-4">
      <Card>
        <CardBody>
          <CardText>
            Sidebar Item
          </CardText>
        </CardBody>
      </Card>
    </aside>
  );
}