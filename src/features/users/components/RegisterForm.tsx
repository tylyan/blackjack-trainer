import { Button } from '@/components/Button';
import { InputWithLabel } from '@/components/Input';
import { Text } from '@/components/Text';
import { Card, Flex } from '@radix-ui/themes';

interface RegisterFormProps {
  onLogin: () => void;
}

export const RegisterForm = ({ onLogin }: RegisterFormProps) => {
  return (
    <Card style={{ width: '24rem' }} size="5">
      <Flex direction="column" justify="center" gap="5">
        <Text variant="h2">Sign up</Text>
        <Flex direction="column" justify="center" gap="3">
          <InputWithLabel label="Email" placeholder="user@example.com" />
          <InputWithLabel label="Password" placeholder="************" type="password" />
        </Flex>
        <Flex direction="column" gap="2">
          <Button>Sign up</Button>
          <Button variant="secondary" onClick={onLogin}>
            Log in
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};
