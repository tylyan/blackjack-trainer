import { Text } from '../../src/components/Text';
import { Blockquote, Box, Flex, Select, Separator, Slider } from '@radix-ui/themes';
import { useState } from 'react';

type Size = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Weight = 'light' | 'regular' | 'medium' | 'bold';

const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog.';

const TextPlayground = () => {
  const [size, setSize] = useState<Size>('3');
  const [weight, setWeight] = useState<Weight>('regular');

  return (
    <Flex direction="column" gap="4">
      <Select.Root defaultValue="regular" onValueChange={(value) => setWeight(value as Weight)}>
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            <Select.Item value="light">Light</Select.Item>
            <Select.Item value="regular">Regular</Select.Item>
            <Select.Item value="medium">Medium</Select.Item>
            <Select.Item value="bold">Bold</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Slider defaultValue={[3]} onValueChange={([value]) => setSize(String(value) as Size)} min={1} max={9} step={1} />
      <Text size={size} weight={weight}>
        {SAMPLE_TEXT}
      </Text>
    </Flex>
  );
};

export const Typography = () => {
  const [size, setSize] = useState<Size>('3');
  const [weight, setWeight] = useState<Weight>('regular');

  return (
    <Flex direction="column" gap="4">
      <Select.Root defaultValue="regular" onValueChange={(value) => setWeight(value as Weight)}>
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            <Select.Item value="light">Light</Select.Item>
            <Select.Item value="regular">Regular</Select.Item>
            <Select.Item value="medium">Medium</Select.Item>
            <Select.Item value="bold">Bold</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Blockquote>
        {['1', '2', '3', '4', '5', '6', '7', '8'].reverse().map((size) => (
          <div key={`size-${size}`}>
            <Text weight={weight} size={size as any}>
              {SAMPLE_TEXT}
            </Text>
          </div>
        ))}
      </Blockquote>
      <Separator style={{ width: '100%' }} />
      <Slider defaultValue={[3]} onValueChange={([value]) => setSize(String(value) as Size)} min={1} max={9} step={1} />
      <Blockquote>
        {['light', 'regular', 'medium', 'bold'].reverse().map((weight) => (
          <div key={`weight-${weight}`}>
            <Text weight={weight as any} size={size}>
              {SAMPLE_TEXT}
            </Text>
          </div>
        ))}
      </Blockquote>
    </Flex>
  );
};
