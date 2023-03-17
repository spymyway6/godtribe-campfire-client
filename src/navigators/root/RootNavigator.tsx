/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ErrorBoundary from '../../components/HOCs/ErrorBoundary';
import { Loader } from '../../components/atoms/Loader';
import { MainPage } from '../../components/pages/MainPage';
import { NewActivePage } from '../../components/pages/NewActivePage';
import { LoginPage } from '../../components/pages/LoginPage';

import { useUserState, useUserAction } from '../../hooks/user';
import { useSocketAction } from '../../hooks/socket';

const ProtectedRoutes = () => (
  <Routes>
    <Route path="/*" element={<Navigate to="/campfires" />} />
    <Route path="/campfires/active/:id" element={<NewActivePage />} />
    <Route path="/campfires" element={<MainPage />} />
    <Route path="/groups/:group/campfire" element={<MainPage />} />
  </Routes>
);

const UnprotectedRoutes = () => (
  <Routes>
    <Route path="/*" element={<Navigate to="/campfires/auth" />} />
    <Route path="/campfires/auth" element={<LoginPage />} />
  </Routes>
);

const Navigator = () => {
  const {
    setCurrentUser,
    setIsLoading,
    token: stateToken,
    setToken,
  } = useUserState();
  const { fetchCurrentUser } = useUserAction();

  const { socketInit } = useSocketAction();

  // TODO: use this to manually logout for testing purposes
  // localStorage.removeItem('access-token');
  // setToken('');

  const token = localStorage.getItem('access-token') || stateToken;
  // const token = 'testtoken';

  const { refetch: refetchCurrentUser, isLoading } = useQuery(
    'current-user',
    () => fetchCurrentUser(token),
    {
      enabled: false,
      onSuccess: (response: {
        avatar: string;
        firstName: string;
        lastName: string;
        nickname: string;
        role: [];
        id: string;
        email: string;
        username: string;
      }) => {
        const {
          id,
          avatar,
          firstName,
          lastName,
          role,
          email,
          username,
        } = response;

        const name = response.nickname
          ? response.nickname
          : !response.nickname && response.username
          ? response.username
          : `${firstName} ${lastName}`;

        const user = {
          id,
          name,
          email,
          profileUrl: avatar,
          role,
          username,
        };
        setCurrentUser(user);
      },
      onError: () => {
        setCurrentUser(undefined);
        localStorage.removeItem('access-token');
        setToken('');
      },
    },
  );

  // const { refetch: refetchRandomUser, isLoading: isLoadingRandom } = useQuery(
  //   'current-user',
  //   () => fetchRandomTestUser(),
  //   {
  //     enabled: false,
  //     onSuccess: (response: {
  //       profileUrl: string;
  //       name: string;
  //       id: string;
  //       email: string;
  //     }) => {
  //       const { id, profileUrl, name, email } = response;
  //       const user = {
  //         id,
  //         name,
  //         email,
  //         profileUrl,
  //         role: '',
  //         username: '',
  //       };
  //       setCurrentUser(user);
  //     },
  //     onError: () => {
  //       setCurrentUser(undefined);
  //       localStorage.removeItem('access-token');
  //       setToken('');
  //     },
  //   },
  // );

  // const handleAllUsers = (arr: UserInterface[] | undefined) => {
  //   setAllUsers(arr || []);
  // };

  // const { mutate: getAllUsers } = useMutation(() => fetchAllUsers(), {
  //   onSuccess: (res) => {
  //     handleAllUsers(res);
  //   },
  //   onError: (error) => {
  //     console.log('getALl Error: ', error);
  //   },
  // });

  useEffect(() => {
    if (token) {
      refetchCurrentUser();
      // getAllUsers();
    } else {
      setCurrentUser(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, setCurrentUser, refetchCurrentUser]);

  const isLoggedIn = !!token;

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    socketInit();
  }, []);

  // useEffect(() => {
  //   if (socketError !== null) {
  //     ErrorModal(
  //       'Something went wrong. Please try again.',
  //       () => {
  //         setSocketError(null);
  //         window.location.reload();
  //       },
  //       'Try Again',
  //     );
  //   }
  // }, [setSocketError, socketError]);

  return (
    <ErrorBoundary
      fallback={(error: any) => <div>ERROR!!! {error?.message}</div>}>
      <BrowserRouter>
        {!isLoading ? (
          isLoggedIn ? (
            <ProtectedRoutes />
          ) : (
            <UnprotectedRoutes />
          )
        ) : (
          <Loader />
        )}
      </BrowserRouter>
    </ErrorBoundary>
  );
};

const RootNavigator = (): React.ReactElement => (
  <React.Suspense fallback={null}>
    <Navigator />
  </React.Suspense>
);

export default RootNavigator;
