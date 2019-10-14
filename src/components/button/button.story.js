import React from 'react';
import Button from './button';
import { withKnobs, select } from '@storybook/addon-knobs';

/* storiesOf('Button', module).add('Default', () => {
    return <Button>Default</Button>;
});
 */

export const defaultButton = () => <Button>Default</Button>;
export const outlineButton = () => <Button style="outline">Default</Button>;
export const knobs = () => (
    <Button style={select('Style', ['default', 'outline'])}>Button</Button>
);
knobs.story = {
    decorators: [withKnobs],
};

export default {
    title: 'Button',
    parameters: {
        component: Button,
        componentSubtitle: 'Button with few variants',
    },
};
