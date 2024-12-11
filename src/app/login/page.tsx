import { LoginForm } from '@/features/users/components/LoginForm';
import { Flex, Box } from '@radix-ui/themes';

export default function LoginPage() {
  return (
    <Box style={{ background: 'var(--gray-a2)', borderRadius: 'var(--radius-3)', minHeight: '100vh' }}>
      <Flex justify="center" align="center" style={{ height: '100vh' }}>
        <LoginForm />
      </Flex>
    </Box>
  );
}
