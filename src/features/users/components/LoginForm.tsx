import { Button, Card, Flex, TextField } from '@radix-ui/themes';

export const LoginForm = () => {
  return (
    <Card size="2">
      <Flex direction="column" justify="center" gap="4">
        <TextField.Root placeholder="user@example.com" />
        <TextField.Root placeholder="************" />
        <Button>Sign in</Button>
      </Flex>
    </Card>
  );
};
