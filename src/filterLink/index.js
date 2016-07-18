import model from './model';
import view from './view';

function filterLink({ props$ }) {
  const state$ = model(props$);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
  };
}

export default filterLink;
