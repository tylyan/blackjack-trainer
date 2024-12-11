import { LoginForm } from '@/features/users/components/LoginForm';
import { LoginOrRegister } from '@/features/users/components/LoginOrRegister';
import { Flex, Box } from '@radix-ui/themes';

export default function LoginPage() {
  return (
    <Flex justify="center" align="center">
      <LoginOrRegister />
    </Flex>
  );
}
