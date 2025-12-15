import { render } from '@testing-library/react';
import NodeContent from '@components/nodeContent/NodeContent';

describe('NodeContent', () => {
  it('should render skill and description if we have them both', () => {
    const { asFragment } = render(<NodeContent skillName="Random skill" description="Random description" />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render just skill if description is not passed', () => {
    const { asFragment } = render(<NodeContent skillName="Random skill" description="" />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render just description if skill is not passed', () => {
    const { asFragment } = render(<NodeContent skillName="" description="Random description" />);

    expect(asFragment()).toMatchSnapshot();
  });
});

