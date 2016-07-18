import { Observable, Subject } from 'rx';

import intent from './intent';
import model from './model';
import view from './view';
import todoForm from '../todoForm';
import todoList from '../todoList';
import todoListToolbar from '../todoListToolbar';
import todoNav from '../todoNav';
import { serialize, deserialize } from '../utils';

const STORAGE_KEY = '__todos';

function ammendState(DOM) {
  return function mapFn(state) {
    const { list, filter } = state;

    return {
      ...state,
      form: todoForm({ DOM }),
      list: todoList({
        DOM,
        props$: Observable.just({ list, filter }),
      }),
      toolbar: todoListToolbar({
        DOM,
        props$: Observable.just({ list }),
      }),
      nav: todoNav({
        props$: Observable.just({ filter }),
      }),
    };
  };
}

function app({ DOM, storage, initialHash, hashChange }) {
  const localStorageData$ = storage.local
      .getItem(STORAGE_KEY)
      .take(1);

  const initialTodosData$ = deserialize(localStorageData$);

  const proxyActions$ = new Subject();

  const actions$ = intent(proxyActions$, initialHash, hashChange);

  const state$ = model(actions$, initialTodosData$);

  const ammendedState$ = state$
      .map(ammendState(DOM))
      .shareReplay(1);

  ammendedState$
      .flatMapLatest(({ form, list, toolbar }) => Observable.merge(
        form.action$,
        list.action$,
        toolbar.action$
      ))
      .subscribe(proxyActions$);

  const vtree$ = view(ammendedState$);

  const storage$ = state$
      .map(serialize)
      .map(state => ({
        key: STORAGE_KEY,
        value: state,
      }));

  return {
    DOM: vtree$,
    storage: storage$,
  };
}

export default app;
