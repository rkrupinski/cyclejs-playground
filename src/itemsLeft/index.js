import model from './model';
import view from './view';

function itemsLeft({ props$ }) {
  const state$ = model(props$);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
  };
}

export default itemsLeft;
