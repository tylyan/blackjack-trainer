import { Button } from '@/components/Button';
import { InputWithLabel } from '@/components/Input';
import { Text } from '@/components/Text';
import { Card, Flex } from '@radix-ui/themes';

interface LoginFormProps {
  onSignUp: () => void;
}

export const LoginForm = ({ onSignUp }: LoginFormProps) => {
  return (
    <Card style={{ width: '24rem' }} size="5">
      <Flex direction="column" justify="center" gap="5">
        <Text variant="h2">Log in</Text>
        <Flex direction="column" justify="center" gap="3">
          <InputWithLabel label="Email" placeholder="user@example.com" />
          <InputWithLabel label="Password" placeholder="************" type="password" />
        </Flex>
        <Flex direction="column" gap="2">
          <Button>Log in</Button>
          <Button variant="secondary" onClick={onSignUp}>
            Sign up
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};
