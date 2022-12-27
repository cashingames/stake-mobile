import AppButton from "../../shared/AppButton";
import { render, fireEvent } from '@testing-library/react-native';

test('that the passed onPress was called', () => {

    //write test for AppButton
    const mockFn = jest.fn();
    const { getByText } = render(<AppButton onPress={mockFn} text="Submit" />);
    fireEvent.press(getByText('Submit'));
    expect(mockFn).toHaveBeenCalled();
});