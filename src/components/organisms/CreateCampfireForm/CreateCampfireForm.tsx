import React, { useRef, useEffect } from 'react';
import { Formik } from 'formik';

import { CreateCampfire } from '../../molecules/CreateCampfire';

import { CampfireParams } from '../../../../common/domain/entities/campfire';
import { CreateCampfireSchema } from './validation';

import { useUserState } from '../../../hooks/user';

type Props = {
  onSubmit: (values: CampfireParams) => void;
  onPress: () => void;
  fetchUserList?: (username: string) => void;
  onClickShowInvites?: (value: boolean) => void;
  isInviteTagOpen?: boolean;
  toggle: boolean;
  isLoading?: boolean;
};

const CreateCampfireForm = ({
  onSubmit,
  onPress,
  fetchUserList = () => {},
  onClickShowInvites = () => {},
  isInviteTagOpen = false,
  toggle,
  isLoading = false,
}: Props): React.ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<any>(null);
  const { currentUser } = useUserState();

  useEffect(() => {
    if (formRef && toggle === false) {
      formRef?.current?.resetForm();
    }
  }, [formRef, toggle]);

  return (
    <Formik
      initialValues={{
        topic: '',
        description: '',
        hidden: false,
        scheduleToStart: new Date(),
        openTo: 'Everyone',
        invited: [],
        duration: '01:00',
      }}
      validationSchema={CreateCampfireSchema}
      onSubmit={(values: CampfireParams) => {
        onSubmit(values);
      }}
      innerRef={formRef}>
      {({ values, handleChange, handleSubmit, setFieldValue }) => (
        <CreateCampfire
          onChangeScheduleTostart={(schedule) => {
            const scheduleToStart =
              schedule === 'IMMEDIATELY' ? new Date() : new Date(schedule);
            setFieldValue('scheduleToStart', scheduleToStart);
          }}
          onPress={values.topic && values.description ? onPress : () => {}}
          onPressSubmit={
            !values.topic && !values.description && toggle
              ? onPress
              : handleSubmit
          }
          onChangeCheckbox={() => {
            setFieldValue('hidden', !values.hidden);
          }}
          checked={values.hidden}
          topicValue={values.topic}
          descriptionValue={values.description}
          onChangeTopic={handleChange('topic')}
          onChangeDescription={handleChange('description')}
          toggled={toggle}
          isLoading={isLoading}
          fetchUserList={fetchUserList}
          onChangeOpenTo={(type, invited) => {
            setFieldValue('openTo', type);
            setFieldValue('invited', type === 'Everyone' ? [] : invited);
          }}
          onChangeDuration={(duration) => {
            setFieldValue('duration', duration);
          }}
          onClickShowInvites={onClickShowInvites}
          isInviteTagOpen={isInviteTagOpen}
          profileUrl={currentUser?.profileUrl}
        />
      )}
    </Formik>
  );
};

export default CreateCampfireForm;
