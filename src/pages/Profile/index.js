import React from 'react';
import { MdArrowBack, MdSave } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from './styles';


export default () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  return (
    <Container>
      <div>
        <button
          data-testid="back"
          type="button"
          className="unstyled"
          onClick={() => history.push('/')}
        >
          <MdArrowBack color="#FFF" size="24" />
        </button>
      </div>
    </Container>
  );
};
