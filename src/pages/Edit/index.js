import React, { useCallback, useEffect, useState } from 'react';
import { parseISO } from 'date-fns';
import { MdArrowBack, MdCameraAlt, MdSave } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import { useMatch, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { DatePicker } from '~/components/Datepicker';
import { upsertMeetup } from '~/store/actions/meetup';
import api from '~/services/api';
import { Container, ImagePicker } from './styles';

export function Edit() {
  const match = useMatch('/meetups/:id/edit');
  const dispatch = useDispatch();
  const { id } = match.params;
  const [meetup, setMeetup] = useState({});
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const uploadBanner = useCallback(
    (e) => {
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

  const schema = Yup.object().shape({
    banner: id
      ? Yup.string()
      : Yup.string().required('O campo banner é obrigatório'),
    date: Yup.date().required('O campo data é obrigatório'),
    description: Yup.string()
      .min(10, 'Poxa, explica mais sobre esse meetup ;)')
      .required('O campo descrição é obrigatório'),
    localization: Yup.string().required('O campo localização é obrigatório'),
    title: Yup.string()
      .min(6, 'O título deve ter no minimo 6 caracteres')
      .required('O campo título é obrigatório'),
  });

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`scheduled/${id}`);
      setMeetup({
        ...data,
        date: data.date ? parseISO(data.date) : '',
      });

      if (data.banner) {
        setPreview(data.banner.url);
      }
    })();
  }, [id]);

  return (
    <Container>
      <div>
        <button
          data-testid="back"
          type="button"
          className="unstyled"
          onClick={() => navigate(-1)}
        >
          <MdArrowBack color="#FFF" size="24" />
        </button>
      </div>

      <Form
        initialData={meetup}
        schema={schema}
        onSubmit={(data) => {
          dispatch(
            upsertMeetup({
              ...meetup,
              ...data,
              id,
            })
          );
        }}
      >
        <ImagePicker htmlFor="banner">
          {preview && <img src={preview} alt="Preview" />}
          <div>
            <MdCameraAlt size="54" />
            <span>Selecionar imagem</span>
          </div>
          <Input
            data-testid="file"
            accept="image/*"
            id="banner"
            name="banner"
            type="file"
            onChange={uploadBanner}
          />
        </ImagePicker>
        <Input name="title" type="text" placeholder="Título do Meetup" />
        <Input
          name="description"
          multiline
          placeholder="Descrição completa"
          rows={10}
          value={meetup.description}
          onChange={(e) =>
            setMeetup({ ...meetup, description: e.target.value })
          }
        />
        <DatePicker
          name="date"
          placeholderText="Data do evento"
          value={meetup.date}
          onChange={(value) => {
            setMeetup({
              ...meetup,
              date: value,
            });
          }}
        />
        <Input name="localization" placeholder="Localização" type="text" />
        <div>
          <button type="submit">
            <MdSave size="17" />
            Salvar meetup
          </button>
        </div>
      </Form>
    </Container>
  );
}
