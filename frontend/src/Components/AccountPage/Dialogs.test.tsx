import { render, screen, fireEvent, within } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dialogs from './Dialogs';

const theme = createTheme();

const mockProps = {
  open: true,
  onClose: jest.fn(),
  selectedFile: null,
  onFileChange: jest.fn(),
  onUpload: jest.fn(),
  deleteOpen: true,
  deleteClose: jest.fn(),
  deleteId: 1,
  onDelete: jest.fn(),
  passwordOpen: true,
  passwordClose: jest.fn(),
  currentPassword: '',
  newPassword: '',
  onPasswordChange: jest.fn(),
  onPasswordSubmit: jest.fn(),
  isLoading: false,
  error: null,
  editOpen: true,
  editClose: jest.fn(),
  username: 'testuser',
  bio: 'test bio',
  onUserInfoChange: jest.fn(),
  onUserInfoSubmit: jest.fn(),
};

describe('Dialogs Component', () => {
  const renderComponent = (props: any) => {
    return render(
      <ThemeProvider theme={theme}>
        <Dialogs {...props} />
      </ThemeProvider>
    );
  };

  it('should render Change Avatar dialog', () => {
    renderComponent(mockProps);
    expect(screen.getByText('Change Avatar')).toBeInTheDocument();
    expect(
      screen.getByText('Please select the avatar image to upload:')
    ).toBeInTheDocument();
  });

  it('should render Delete Article dialog', () => {
    renderComponent(mockProps);
    expect(screen.getByText('Delete Article !')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to delete this post? This action cannot be undone.'
      )
    ).toBeInTheDocument();
  });

  it('should call onDelete when Confirm button is clicked in Delete Article dialog', () => {
    renderComponent(mockProps);
    const deleteDialog = screen.getByText('Delete Article !').closest('div');
    if (deleteDialog) {
      const { getByText } = within(deleteDialog);
      fireEvent.click(getByText('Confirm'));
    }
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.deleteId);
  });

  it('should render Reset Password dialog', () => {
    renderComponent(mockProps);
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
  });

  it('should call onPasswordChange when password fields are changed', () => {
    renderComponent(mockProps);
    fireEvent.change(screen.getByLabelText('Current Password'), {
      target: { value: 'oldpassword' },
    });
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'newpassword' },
    });
    expect(mockProps.onPasswordChange).toHaveBeenCalledTimes(2);
  });

  it('should render Edit Info dialog', () => {
    renderComponent(mockProps);
    expect(screen.getByText('Edit Info')).toBeInTheDocument();
    expect(screen.getByLabelText('UserName')).toBeInTheDocument();
    expect(screen.getByLabelText('Biography')).toBeInTheDocument();
  });

  it('should call onUserInfoChange when user info fields are changed', () => {
    renderComponent(mockProps);
    fireEvent.change(screen.getByLabelText('UserName'), {
      target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByLabelText('Biography'), {
      target: { value: 'new bio' },
    });
    expect(mockProps.onUserInfoChange).toHaveBeenCalledTimes(2);
  });

  it('should call onClose when Cancel button is clicked in Change Avatar dialog', () => {
    renderComponent(mockProps);
    const changeAvatarDialog = screen.getByText('Change Avatar').closest('div');
    if (changeAvatarDialog) {
      const { getByText } = within(changeAvatarDialog);
      fireEvent.click(getByText('Cancel'));
    }
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call deleteClose when Cancel button is clicked in Delete Article dialog', () => {
    renderComponent(mockProps);
    const deleteDialog = screen.getByText('Delete Article !').closest('div');
    if (deleteDialog) {
      const { getByText } = within(deleteDialog);
      fireEvent.click(getByText('Cancel'));
    }
    expect(mockProps.deleteClose).toHaveBeenCalledTimes(1);
  });

  it('should call passwordClose when Cancel button is clicked in Reset Password dialog', () => {
    renderComponent(mockProps);
    const passwordDialog = screen.getByText('Reset Password').closest('div');
    if (passwordDialog) {
      const { getByText } = within(passwordDialog);
      fireEvent.click(getByText('Cancel'));
    }
    expect(mockProps.passwordClose).toHaveBeenCalledTimes(1);
  });

  it('should call editClose when Cancel button is clicked in Edit Info dialog', () => {
    renderComponent(mockProps);
    const editDialog = screen.getByText('Edit Info').closest('div');
    if (editDialog) {
      const { getByText } = within(editDialog);
      fireEvent.click(getByText('Cancel'));
    }
    expect(mockProps.editClose).toHaveBeenCalledTimes(1);
  });
});
