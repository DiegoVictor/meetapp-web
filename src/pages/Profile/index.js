import React from 'react';
import { MdArrowBack, MdSave } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { Container } from './styles';

const schema = Yup.object().shape(
  {
    confirm_password: Yup.string().when('password', (password, field) =>
      password
        ? field
            .required()
            .oneOf(
              [Yup.ref('password')],
              'A confirmação da senha parece diferente da senha nova'
            )
        : field
    ),
    email: Yup.string().email('Informe um email válido'),
    name: Yup.string(),
    old_password: Yup.string()
      .emptyMin(
        6,
        'A sua senha atual parece meio curta, deveria ter no mínimo 6 caracteres'
      )
      .when('password', (password, field) =>
        password ? field.required('Digite a senha atual') : field
      ),
    password: Yup.string()
      .emptyMin(6, 'A nova senha deve conter no mínimo 6 caracteres')
      .when('old_password', (old_password, field) =>
        old_password ? field.required('Informe a nova senha') : field
      ),
  },
  ['old_password', 'password']
);

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
