import React from 'react';
import { shallow } from 'enzyme';
import { LoginForm, mapStateToProps, mapDispatchToProps } from './LoginForm';
import { handleError, updateLoggedInStatus, updateUser } from '../actions';

describe('LoginForm Container', () => {
  describe('LoginForm component', () => {
    let wrapper;
    let mockUpdateUser;
    let mockUpdateLoggedInStatus;
    let mockHandleError;

    beforeEach(() => {
      mockUpdateUser = jest.fn();
      mockUpdateLoggedInStatus = jest.fn();
      mockHandleError = jest.fn();
      wrapper = shallow(<LoginForm
        isLoggedIn={false}
        errorMessage={''}
        updateUser={mockUpdateUser}
        updateLoggedInStatus={mockUpdateLoggedInStatus}
        handleError={mockHandleError}
      />);
    });

    it('should match the LoginForm Snapshot when no one is logged in', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should match the LoginForm Snapshot when user is logged in', () => {
      wrapper = shallow(<LoginForm
        isLoggedIn={true}
        errorMessage={''}
        updateUser={mockUpdateUser}
        updateLoggedInStatus={mockUpdateLoggedInStatus}
        handleError={mockHandleError}
      />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should match the LoginForm Snapshot when error occurs', () => {
      wrapper = shallow(<LoginForm
        isLoggedIn={false}
        errorMessage={'There is an error'}
        updateUser={mockUpdateUser}
        updateLoggedInStatus={mockUpdateLoggedInStatus}
        handleError={mockHandleError}
      />);
      const mockState = { email: '',
        password: '',
        error: 'Error!' }
      wrapper.setState(mockState);

      expect(wrapper).toMatchSnapshot();
    });

    it('should invoke handleSubmit on button click to submit form', () => {
      const mockEvent = { preventDefault: jest.fn() };
      wrapper.instance().handleSubmit = jest.fn();
      wrapper.find('form').simulate('submit', mockEvent);

      expect(wrapper.instance().handleSubmit).toHaveBeenCalledWith(mockEvent);
    });

    it('should invoke handleInputChange on change within email input field',
      () => {
        const mockEvent = { target: { name: 'testName', value: 'testValue' } }
        wrapper.instance().handleInputChange = jest.fn();
        wrapper.find('#email-input').simulate('change', mockEvent);
        expect(wrapper.instance().handleInputChange)
          .toHaveBeenCalledWith(mockEvent);

        wrapper.find('#password-input').simulate('change', mockEvent);
        expect(wrapper.instance().handleInputChange)
          .toHaveBeenCalledWith(mockEvent);
    });

    it('should invoke validateInputs when handleSubmit is called', () => {
      const mockEvent = { preventDefault: jest.fn() };
      wrapper.instance().validateInputs = jest.fn();
      wrapper.instance().handleSubmit(mockEvent);
      expect(wrapper.instance().validateInputs).toHaveBeenCalled();
    });

    it('should setState when validateInputs is called with an input empty',
      () => {
        const mockStartingState = {email: 'fakeemail@email.com',
          password: '',
          error: ''};
        const mockEndingState = {email: 'fakeemail@email.com',
          password: '',
          error: 'All input fields required'};
        wrapper.setState(mockStartingState);
        expect(wrapper.state()).toEqual(mockStartingState);

        wrapper.instance().validateInputs();
        expect(wrapper.state()).toEqual(mockEndingState);
    });

    it('should setState when handleInputChange is called', () => {
      const mockEvent = { target: { name: 'email', value: 'testValue' } };
      const mockStartingState = {
        email: 'fakeemail@email.com',
        password: 'fakepassword',
        error: 'fakeerror' };
      const mockEndingState = {
        email: 'testValue',
        password: 'fakepassword',
        error: '' };
      wrapper.setState(mockStartingState);
      wrapper.instance().handleInputChange(mockEvent);
      expect(wrapper.state()).toEqual(mockEndingState);
    });

    it('should invoke handleError prop method when handleInputChange is called', () => {
      const mockEvent = { target: { name: 'email', value: 'testValue' } };
      wrapper.instance().handleInputChange(mockEvent);
      expect(mockHandleError).toHaveBeenCalled();
    });

    // it('should do a bunch of stuff based on successful or fail fetches', () => {
    //   // should these things be tested as unit tests or as part of async testing in the api calls file?
    //   'should invoke updateLoggedInStatus with true'
    //   'should invoke updateUser with data from fetches responses'
    //   'should invoke handleError if fails'
    // });

  });

  describe('mapStateToProps', () => {
    it('should return an object with error and loggedIn properties from state', () => {
      const mockState = {
        movies: [],
        user: {},
        isLoggedIn: true,
        errorMessage: '',
        loadingStatus: false,
      };
      const expected = {
        isLoggedIn: true,
        errorMessage: ''
      };
      const mappedProps = mapStateToProps(mockState);

      expect(mappedProps).toEqual(expected);
    });
  });

  describe('mapDispatchToProps', () => {
    it('calls dispatch with a handleError action when handleInputChange is called', () => {
      const mockDispatch = jest.fn();
      const actionToDispatch = handleError('mockError');
      const mappedProps = mapDispatchToProps(mockDispatch);

      mappedProps.handleError('mockError');

      expect(mockDispatch).toHaveBeenCalledWith(actionToDispatch);
    });

    it('calls dispatch with an updateUser action when updateUser is called', () => {
      const mockDispatch = jest.fn();
      const actionToDispatch = updateUser({mock: 'property'});
      const mappedProps = mapDispatchToProps(mockDispatch);

      mappedProps.updateUser({mock: 'property'});

      expect(mockDispatch).toHaveBeenCalledWith(actionToDispatch);
    });

    it('calls dispatch with an updateLoggedInStatus action when updateLoggedInStatus is called', () => {
      const mockDispatch = jest.fn();
      const actionToDispatch = updateLoggedInStatus(true);
      const mappedProps = mapDispatchToProps(mockDispatch);

      mappedProps.updateLoggedInStatus(true);

      expect(mockDispatch).toHaveBeenCalledWith(actionToDispatch);
    });
  });
});
