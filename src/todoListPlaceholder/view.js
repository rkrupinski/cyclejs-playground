import { Observable } from 'rx';

import { p } from '@cycle/dom';

function view() {
  return Observable.just(
    p('Hooray, no todos!')
  );
}

export default view;
