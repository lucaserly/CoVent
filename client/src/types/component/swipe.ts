import { RouteComponentProps } from 'react-router-dom';
import {Profile} from './../user'

export interface SwipeInterface extends RouteComponentProps {
  location: {
    state: {
     profiles: Profile[]
    },
    pathname: string,
    search: string,
    hash: string
  }
}