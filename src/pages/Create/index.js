import React, { useCallback, useState } from 'react';
import { MdArrowBack, MdCameraAlt, MdSave } from 'react-icons/md';
import api from '~/services/api';
import { Container, ImagePicker } from './styles';

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
