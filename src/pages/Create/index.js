import React, { useCallback, useState } from 'react';
import { MdArrowBack, MdCameraAlt, MdSave } from 'react-icons/md';
import * as Yup from 'yup';

import api from '~/services/api';

import { Container, ImagePicker } from './styles';
const schema = Yup.object().shape({
  date: Yup.date().required('O campo data é obrigatório'),
  description: Yup.string()
    .min(10, 'Poxa, explica mais sobre esse meetup ;)')
    .required('O campo descrição é obrigatório'),
  localization: Yup.string().required('O campo localização é obrigatório'),
  title: Yup.string()
    .min(6, 'O título deve ter no minimo 6 caracteres')
    .required('O campo título é obrigatório'),
});

export default () => {
  const [meetup, setMeetup] = useState({});
  const [preview, setPreview] = useState(null);

  const uploadBanner = useCallback(
    e => {
      (async () => {
        const data = new FormData();
        data.append('file', e.target.files[0]);
        const response = await api.post('files', data);

        setMeetup({
          ...meetup,
          banner_id: response.data.id,
        });
        setPreview(response.data.url);
      })();
    },
    [meetup]
  );

  return (
    <Container>
      <div>
        <button
          data-testid="back"
          type="button"
          className="unstyled"
          onClick={() => history.goBack()}
        >
          <MdArrowBack color="#FFF" size="24" />
        </button>
      </div>
    </Container>
  );
};
