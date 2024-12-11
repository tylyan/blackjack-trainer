'use client';

import { Flex } from '@radix-ui/themes';
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const LoginOrRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <Flex direction="column" gap="2">
      {isLogin ? <LoginForm onSignUp={() => setIsLogin(false)} /> : <RegisterForm onLogin={() => setIsLogin(true)} />}
    </Flex>
  );
};
