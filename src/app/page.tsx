import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Flex, Box } from '@radix-ui/themes';
import Link from 'next/link';

export default function Home() {
  return (
    <Flex direction="column" justify="center" align="center" gap="5">
      <Text variant="title">Welcome to Black & Jack</Text>
      <Text variant="h1">A simple & intuitive training app</Text>
      <Link href="/login">
        <Button variant="cta" size="4">
          Get started
        </Button>
      </Link>
    </Flex>
  );
}
