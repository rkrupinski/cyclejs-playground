import intent from './intent';
import model from './model';
import view from './view';

function clearCompletedBtn({ DOM, props$ }) {
  const action$ = intent(DOM);
  const state$ = model(props$);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
    action$,
  };
}

export default clearCompletedBtn;
