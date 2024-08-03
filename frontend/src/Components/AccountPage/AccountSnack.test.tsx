import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AccountSnack from './AccountSnack';

const theme = createTheme();

describe('AccountSnack', () => {
  const handleSnackbarClose = jest.fn();

  const renderComponent = (snackbarOpen: boolean, snackbarMessage: string) => {
    return render(
      <ThemeProvider theme={theme}>
        <AccountSnack
          snackbarOpen={snackbarOpen}
          snackbarMessage={snackbarMessage}
          handleSnackbarClose={handleSnackbarClose}
        />
      </ThemeProvider>
    );
  };

  it('should render the snackbar with the correct message', () => {
    renderComponent(true, 'Test message');

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should call handleSnackbarClose when the close button is clicked', () => {
    renderComponent(true, 'Test message');

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(handleSnackbarClose).toHaveBeenCalledTimes(1);
  });

  it('should not render the snackbar when snackbarOpen is false', () => {
    renderComponent(false, 'Test message');

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });
});
