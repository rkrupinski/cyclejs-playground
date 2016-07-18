import model from './model';
import view from './view';

function todoNav({ props$ }) {
  const state$ = model(props$);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
  };
}

export default todoNav;
