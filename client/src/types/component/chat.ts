import { RouteComponentProps } from 'react-router-dom';

export interface ChatInterface extends RouteComponentProps {
  location: {
    state: {
      id: number,
      firstName: string,
    },
    pathname: string,
    search: string,
    hash: string
  }
}