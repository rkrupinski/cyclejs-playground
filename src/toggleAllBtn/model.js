import { Observable } from 'rx';

function model(props$) {
  return Observable.combineLatest(
    props$,
    props => props
  );
}

export default model;
