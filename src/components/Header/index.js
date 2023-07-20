import React from 'react';
import { Link } from 'react-router-dom';
import { MdExitToApp } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import Logo from '~/assets/logo.svg';
import { signOut } from '~/store/actions/user';
import { Container } from './styles';

export default () => {
  const dispatch = useDispatch();
  const user = useSelector(state => {
    return state.user;
  });

  return (
    <Container>
      <div>
        <Link to="/dashboard" data-testid="dashboard">
          <img src={Logo} alt="Meetapp" />
        </Link>

        <aside>
          <div>
            <strong>{user.name}</strong>
            <Link to="/profile">Meu Perfil</Link>
          </div>
          <button
            type="button"
            data-testid="logout"
            onClick={() => dispatch(signOut())}
          >
            <MdExitToApp size="15" />
            Sair
          </button>
        </aside>
      </div>
    </Container>
  );
};
